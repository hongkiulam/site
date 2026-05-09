import type { Action } from 'svelte/action';

interface PanZoomParams {
  src: string;
  onloaded?: () => void;
  onerror?: () => void;
}

export const panZoomCanvas: Action<HTMLCanvasElement, PanZoomParams> = (canvas, params) => {
  const ctx = canvas.getContext('2d')!;

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

  function draw() {
    if (!view.img) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = view.img.naturalWidth * view.scale;
    const h = view.img.naturalHeight * view.scale;
    ctx.drawImage(view.img, view.cx - w / 2, view.cy - h / 2, w, h);
  }

  function resetView() {
    if (!view.img) return;
    const padding = 0.9;
    const scaleX = canvas.width / view.img.naturalWidth;
    const scaleY = canvas.height / view.img.naturalHeight;
    view.baseScale = Math.min(scaleX, scaleY) * padding;
    view.scale = view.baseScale;
    view.cx = canvas.width / 2;
    view.cy = canvas.height / 2;
  }

  function sizeCanvas() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    console.log(parent);
    const rect = parent.getBoundingClientRect();
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    if (view.img) {
      resetView();
      draw();
    }
  }

  function loadImage(src: string) {
    view.img = null;
    const img = new Image();
    img.onload = () => {
      view.img = img;
      params.onloaded?.();
      sizeCanvas();
    };
    img.onerror = () => {
      params.onerror?.();
    };
    img.src = src;
  }

  // --- Wheel zoom ---

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

  // --- Mouse drag ---

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

  function onMouseMove(e: MouseEvent) {
    if (!view.isDragging) return;
    const dpr = window.devicePixelRatio || 1;
    const dx = e.clientX * dpr - view.dragStartX;
    const dy = e.clientY * dpr - view.dragStartY;
    if (Math.abs(dx) > 3 * dpr || Math.abs(dy) > 3 * dpr) view.hasDragged = true;
    view.cx = view.dragStartCx + dx;
    view.cy = view.dragStartCy + dy;
    draw();
  }

  function onMouseUp() {
    view.isDragging = false;
    canvas.style.cursor = view.scale > view.baseScale * 1.05 ? 'grab' : 'default';
  }

  // --- Double-click zoom toggle ---

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

  // --- Touch: pinch-to-zoom, drag, double-tap ---

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

  // --- Bind events ---

  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('dblclick', onDblClick);
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('touchend', onTouchEnd);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('resize', sizeCanvas);

  // Initial load
  sizeCanvas();
  loadImage(params.src);

  return {
    update(newParams: PanZoomParams) {
      if (newParams.src !== params.src) {
        params = newParams;
        loadImage(params.src);
      }
    },
    destroy() {
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('dblclick', onDblClick);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', sizeCanvas);
    }
  };
};
