'use client';

import { useEffect, useRef } from 'react';

const LIFE_MS = 480;
const HEAD = 'M0 -7 L5 0 L0 7 L-5 0 Z';

/**
 * Violet→cyan comet trail that follows the pointer everywhere.
 * Inside `[data-cursor-zone]` the native cursor is hidden and a diamond head is drawn.
 * Fine pointers only; disabled under reduced motion.
 */
export function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !window.matchMedia('(pointer: fine)').matches) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const fit = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    fit();

    const head = new Path2D(HEAD);
    const points: { x: number; y: number; t: number }[] = [];
    let cursor: { x: number; y: number } | null = null;
    let inZone = false;

    const onMove = (e: PointerEvent) => {
      cursor = { x: e.clientX * dpr, y: e.clientY * dpr };
      inZone = !!(e.target instanceof Element && e.target.closest('[data-cursor-zone]'));
      if (!reduced) points.push({ ...cursor, t: performance.now() });
    };

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const now = performance.now();
      while (points.length && now - points[0]!.t > LIFE_MS) points.shift();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1]!;
        const b = points[i]!;
        const life = 1 - (now - b.t) / LIFE_MS;
        const k = i / points.length;
        ctx.strokeStyle = `hsla(${190 + (1 - k) * 80}, 95%, ${60 + k * 10}%, ${life * 0.9})`;
        ctx.lineWidth = (1 + 5 * life * k) * dpr;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';

      if (cursor && inZone) {
        ctx.save();
        ctx.translate(cursor.x, cursor.y);
        ctx.scale(dpr * 1.4, dpr * 1.4);
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#ffffff';
        ctx.fill(head);
        ctx.restore();
      }
    };
    draw();

    window.addEventListener('resize', fit);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', fit);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] h-screen w-screen" />;
}
