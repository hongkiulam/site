<script lang="ts">
  import { onMount } from 'svelte';

  let { src, onclose }: { src: string; onclose: () => void } = $props();

  let isLoading = $state(true);
  let hasError = $state(false);

  let canvas = $state<HTMLCanvasElement>(undefined!);
  let ctx: CanvasRenderingContext2D;

  const view = {
    img: null as HTMLImageElement | null,
    scale: 1,
    baseScale: 1,
    cx: 0,
    cy: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartCx: 0,
    dragStartCy: 0,
    hasDragged: false,
    lastPinchDist: 0,
    lastTapTime: 0
  };

  let prevOverflow = '';

  function draw() {
    if (!view.img || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = view.img.naturalWidth * view.scale;
    const h = view.img.naturalHeight * view.scale;
    ctx.drawImage(view.img, view.cx - w / 2, view.cy - h / 2, w, h);
  }

  function resetView() {
    if (!view.img || !canvas) return;
    const padding = 0.9;
    const scaleX = canvas.width / view.img.naturalWidth;
    const scaleY = canvas.height / view.img.naturalHeight;
    view.baseScale = Math.min(scaleX, scaleY) * padding;
    view.scale = view.baseScale;
    view.cx = canvas.width / 2;
    view.cy = canvas.height / 2;
  }

  function sizeCanvas() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    if (view.img) {
      resetView();
      draw();
    }
  }

  onMount(() => {
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    ctx = canvas.getContext('2d')!;
    sizeCanvas();

    const img = new Image();
    img.onload = () => {
      view.img = img;
      isLoading = false;
      resetView();
      draw();
    };
    img.onerror = () => {
      isLoading = false;
      hasError = true;
    };
    img.src = src;

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onclose();
    };
    const onResize = () => sizeCanvas();

    const onMouseMove = (e: MouseEvent) => {
      if (!view.isDragging) return;
      const dpr = window.devicePixelRatio || 1;
      const dx = e.clientX * dpr - view.dragStartX;
      const dy = e.clientY * dpr - view.dragStartY;
      if (Math.abs(dx) > 3 * dpr || Math.abs(dy) > 3 * dpr) view.hasDragged = true;
      view.cx = view.dragStartCx + dx;
      view.cy = view.dragStartCy + dy;
      draw();
    };
    const onMouseUp = () => {
      view.isDragging = false;
      if (canvas) {
        canvas.style.cursor = view.scale > view.baseScale * 1.05 ? 'grab' : 'default';
      }
    };

    window.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  });

  // --- Canvas event handlers ---

  function onWheel(e: WheelEvent) {
    e.preventDefault();
    if (!view.img) return;

    const dpr = window.devicePixelRatio || 1;
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    const newScale = Math.max(view.baseScale, Math.min(view.baseScale * 10, view.scale * factor));

    const mx = e.clientX * dpr;
    const my = e.clientY * dpr;
    view.cx = mx - ((mx - view.cx) * newScale) / view.scale;
    view.cy = my - ((my - view.cy) * newScale) / view.scale;
    view.scale = newScale;
    draw();
  }

  function onMouseDown(e: MouseEvent) {
    view.isDragging = true;
    view.hasDragged = false;
    const dpr = window.devicePixelRatio || 1;
    view.dragStartX = e.clientX * dpr;
    view.dragStartY = e.clientY * dpr;
    view.dragStartCx = view.cx;
    view.dragStartCy = view.cy;
    canvas.style.cursor = 'grabbing';
  }

  function onDblClick(e: MouseEvent) {
    if (!view.img) return;
    const dpr = window.devicePixelRatio || 1;

    if (view.scale > view.baseScale * 1.05) {
      resetView();
    } else {
      const mx = e.clientX * dpr;
      const my = e.clientY * dpr;
      const newScale = view.baseScale * 2.5;
      view.cx = mx - ((mx - view.cx) * newScale) / view.scale;
      view.cy = my - ((my - view.cy) * newScale) / view.scale;
      view.scale = newScale;
    }
    draw();
  }

  // Touch helpers
  const dist = (a: Touch, b: Touch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  const center = (a: Touch, b: Touch) => {
    const dpr = window.devicePixelRatio || 1;
    return { x: ((a.clientX + b.clientX) / 2) * dpr, y: ((a.clientY + b.clientY) / 2) * dpr };
  };

  function onTouchStart(e: TouchEvent) {
    e.preventDefault();
    const dpr = window.devicePixelRatio || 1;

    if (e.touches.length === 1) {
      const now = Date.now();
      if (now - view.lastTapTime < 300) {
        if (view.scale > view.baseScale * 1.05) {
          resetView();
        } else {
          const mx = e.touches[0].clientX * dpr;
          const my = e.touches[0].clientY * dpr;
          const newScale = view.baseScale * 2.5;
          view.cx = mx - ((mx - view.cx) * newScale) / view.scale;
          view.cy = my - ((my - view.cy) * newScale) / view.scale;
          view.scale = newScale;
        }
        draw();
        view.lastTapTime = 0;
        return;
      }
      view.lastTapTime = now;
      view.isDragging = true;
      view.hasDragged = false;
      view.dragStartX = e.touches[0].clientX * dpr;
      view.dragStartY = e.touches[0].clientY * dpr;
      view.dragStartCx = view.cx;
      view.dragStartCy = view.cy;
    } else if (e.touches.length === 2) {
      view.isDragging = false;
      view.lastPinchDist = dist(e.touches[0], e.touches[1]);
    }
  }

  function onTouchMove(e: TouchEvent) {
    e.preventDefault();
    const dpr = window.devicePixelRatio || 1;

    if (e.touches.length === 1 && view.isDragging) {
      const dx = e.touches[0].clientX * dpr - view.dragStartX;
      const dy = e.touches[0].clientY * dpr - view.dragStartY;
      if (Math.abs(dx) > 3 * dpr || Math.abs(dy) > 3 * dpr) view.hasDragged = true;
      view.cx = view.dragStartCx + dx;
      view.cy = view.dragStartCy + dy;
      draw();
    } else if (e.touches.length === 2) {
      const d = dist(e.touches[0], e.touches[1]);
      const c = center(e.touches[0], e.touches[1]);

      if (view.lastPinchDist > 0) {
        const factor = d / view.lastPinchDist;
        const newScale = Math.max(
          view.baseScale,
          Math.min(view.baseScale * 10, view.scale * factor)
        );
        view.cx = c.x - ((c.x - view.cx) * newScale) / view.scale;
        view.cy = c.y - ((c.y - view.cy) * newScale) / view.scale;
        view.scale = newScale;
      }
      view.lastPinchDist = d;
      draw();
    }
  }

  function onTouchEnd(e: TouchEvent) {
    if (e.touches.length === 0) {
      view.isDragging = false;
      view.lastPinchDist = 0;
    } else if (e.touches.length === 1) {
      const dpr = window.devicePixelRatio || 1;
      view.isDragging = true;
      view.hasDragged = true;
      view.dragStartX = e.touches[0].clientX * dpr;
      view.dragStartY = e.touches[0].clientY * dpr;
      view.dragStartCx = view.cx;
      view.dragStartCy = view.cy;
      view.lastPinchDist = 0;
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="lightbox">
  <canvas
    bind:this={canvas}
    style="display:block; touch-action:none; cursor:default;"
    onwheel={onWheel}
    onmousedown={onMouseDown}
    ondblclick={onDblClick}
    ontouchstart={onTouchStart}
    ontouchmove={onTouchMove}
    ontouchend={onTouchEnd}
  ></canvas>

  {#if isLoading}
    <div class="lightbox-status">Loading...</div>
  {/if}

  {#if hasError}
    <div class="lightbox-status">Failed to load image</div>
  {/if}

  <button class="lightbox-close" aria-label="Close lightbox" onclick={() => onclose()}
    >&times;</button
  >
</div>

<style>
  .lightbox {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.92);
  }

  .lightbox-status {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
    pointer-events: none;
  }

  .lightbox-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
</style>
