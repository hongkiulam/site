import React, { useEffect, useRef, useState } from 'react';

interface LightboxProps {
  imageSrc: string;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ imageSrc, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const stateRef = useRef({
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
    lastTapTime: 0,
  });

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const s = stateRef.current;
    if (!canvas || !ctx || !s.img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = s.img.naturalWidth * s.scale;
    const h = s.img.naturalHeight * s.scale;
    ctx.drawImage(s.img, s.cx - w / 2, s.cy - h / 2, w, h);
  };

  const resetView = () => {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s.img) return;

    const padding = 0.9;
    const scaleX = canvas.width / s.img.naturalWidth;
    const scaleY = canvas.height / s.img.naturalHeight;
    s.baseScale = Math.min(scaleX, scaleY) * padding;
    s.scale = s.baseScale;
    s.cx = canvas.width / 2;
    s.cy = canvas.height / 2;
  };

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Load image and setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      if (stateRef.current.img) {
        resetView();
        draw();
      }
    };

    const img = new Image();
    img.onload = () => {
      stateRef.current.img = img;
      setLoading(false);
      resize();
      draw();
    };
    img.onerror = () => {
      setLoading(false);
      setError(true);
    };
    img.src = imageSrc;

    window.addEventListener('resize', resize);
    resize();

    return () => window.removeEventListener('resize', resize);
  }, [imageSrc]);

  // Wheel zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const s = stateRef.current;
      if (!s.img) return;

      const dpr = window.devicePixelRatio || 1;
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const newScale = Math.max(s.baseScale, Math.min(s.baseScale * 10, s.scale * factor));

      const mx = e.clientX * dpr;
      const my = e.clientY * dpr;
      s.cx = mx - (mx - s.cx) * newScale / s.scale;
      s.cy = my - (my - s.cy) * newScale / s.scale;
      s.scale = newScale;

      draw();
    };

    canvas.addEventListener('wheel', handler, { passive: false });
    return () => canvas.removeEventListener('wheel', handler);
  }, []);

  // Mouse drag
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    const onDown = (e: MouseEvent) => {
      const s = stateRef.current;
      s.isDragging = true;
      s.hasDragged = false;
      s.dragStartX = e.clientX * dpr;
      s.dragStartY = e.clientY * dpr;
      s.dragStartCx = s.cx;
      s.dragStartCy = s.cy;
      canvas.style.cursor = 'grabbing';
    };

    const onMove = (e: MouseEvent) => {
      const s = stateRef.current;
      if (!s.isDragging) return;

      const dx = e.clientX * dpr - s.dragStartX;
      const dy = e.clientY * dpr - s.dragStartY;
      if (Math.abs(dx) > 3 * dpr || Math.abs(dy) > 3 * dpr) s.hasDragged = true;

      s.cx = s.dragStartCx + dx;
      s.cy = s.dragStartCy + dy;
      draw();
    };

    const onUp = () => {
      const s = stateRef.current;
      s.isDragging = false;
      canvas.style.cursor = s.scale > s.baseScale * 1.05 ? 'grab' : 'default';
    };

    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  // Touch: pinch-to-zoom, drag, double-tap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    const dist = (a: Touch, b: Touch) =>
      Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

    const center = (a: Touch, b: Touch) => ({
      x: ((a.clientX + b.clientX) / 2) * dpr,
      y: ((a.clientY + b.clientY) / 2) * dpr,
    });

    const onStart = (e: TouchEvent) => {
      e.preventDefault();
      const s = stateRef.current;

      if (e.touches.length === 1) {
        const now = Date.now();
        if (now - s.lastTapTime < 300) {
          // Double tap
          if (s.scale > s.baseScale * 1.05) {
            resetView();
          } else {
            const mx = e.touches[0].clientX * dpr;
            const my = e.touches[0].clientY * dpr;
            const newScale = s.baseScale * 2.5;
            s.cx = mx - (mx - s.cx) * newScale / s.scale;
            s.cy = my - (my - s.cy) * newScale / s.scale;
            s.scale = newScale;
          }
          draw();
          s.lastTapTime = 0;
          return;
        }
        s.lastTapTime = now;

        s.isDragging = true;
        s.hasDragged = false;
        s.dragStartX = e.touches[0].clientX * dpr;
        s.dragStartY = e.touches[0].clientY * dpr;
        s.dragStartCx = s.cx;
        s.dragStartCy = s.cy;
      } else if (e.touches.length === 2) {
        s.isDragging = false;
        s.lastPinchDist = dist(e.touches[0], e.touches[1]);
      }
    };

    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      const s = stateRef.current;

      if (e.touches.length === 1 && s.isDragging) {
        const dx = e.touches[0].clientX * dpr - s.dragStartX;
        const dy = e.touches[0].clientY * dpr - s.dragStartY;
        if (Math.abs(dx) > 3 * dpr || Math.abs(dy) > 3 * dpr) s.hasDragged = true;

        s.cx = s.dragStartCx + dx;
        s.cy = s.dragStartCy + dy;
        draw();
      } else if (e.touches.length === 2) {
        const d = dist(e.touches[0], e.touches[1]);
        const c = center(e.touches[0], e.touches[1]);

        if (s.lastPinchDist > 0) {
          const factor = d / s.lastPinchDist;
          const newScale = Math.max(
            s.baseScale,
            Math.min(s.baseScale * 10, s.scale * factor)
          );

          s.cx = c.x - (c.x - s.cx) * newScale / s.scale;
          s.cy = c.y - (c.y - s.cy) * newScale / s.scale;
          s.scale = newScale;
        }

        s.lastPinchDist = d;
        draw();
      }
    };

    const onEnd = (e: TouchEvent) => {
      const s = stateRef.current;

      if (e.touches.length === 0) {
        s.isDragging = false;
        s.lastPinchDist = 0;
      } else if (e.touches.length === 1) {
        // Transitioned from pinch to single finger
        s.isDragging = true;
        s.hasDragged = true;
        s.dragStartX = e.touches[0].clientX * dpr;
        s.dragStartY = e.touches[0].clientY * dpr;
        s.dragStartCx = s.cx;
        s.dragStartCy = s.cy;
        s.lastPinchDist = 0;
      }
    };

    canvas.addEventListener('touchstart', onStart, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    canvas.addEventListener('touchend', onEnd);

    return () => {
      canvas.removeEventListener('touchstart', onStart);
      canvas.removeEventListener('touchmove', onMove);
      canvas.removeEventListener('touchend', onEnd);
    };
  }, []);

  // Double-click to toggle zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    const handler = (e: MouseEvent) => {
      const s = stateRef.current;
      if (!s.img) return;

      if (s.scale > s.baseScale * 1.05) {
        resetView();
      } else {
        const mx = e.clientX * dpr;
        const my = e.clientY * dpr;
        const newScale = s.baseScale * 2.5;
        s.cx = mx - (mx - s.cx) * newScale / s.scale;
        s.cy = my - (my - s.cy) * newScale / s.scale;
        s.scale = newScale;
      }
      draw();
    };

    canvas.addEventListener('dblclick', handler);
    return () => canvas.removeEventListener('dblclick', handler);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.92)',
      }}
    >
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1rem',
          }}
        >
          Loading...
        </div>
      )}
      {error && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1rem',
          }}
        >
          Failed to load image
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          touchAction: 'none',
          cursor: 'default',
        }}
      />
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'rgba(0, 0, 0, 0.5)',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}
        aria-label="Close lightbox"
      >
        &times;
      </button>
    </div>
  );
};

export default Lightbox;
