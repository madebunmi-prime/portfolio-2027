'use client';

import { useCallback, useEffect, useImperativeHandle, useRef, useState, type ReactNode, type Ref } from 'react';
import { cn } from '@/lib/utils';

export type TrackApi = { scrollToIndex: (i: number) => void };

type Props = {
  /** Section heading (left side of the header row) */
  header: ReactNode;
  /** e.g. "Drag / swipe" */
  hint?: string;
  children: ReactNode;
  className?: string;
  apiRef?: Ref<TrackApi>;
  /** Rendered between the header row and the track (e.g. the career ribbon) */
  between?: ReactNode;
  small?: boolean;
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Horizontal, full-bleed snap track. Header shows counter, progress and prev/next so it's
 * obvious there is more to the right. Mouse users can drag; touch users swipe natively.
 * Children should be `flex-none snap-start` cards.
 */
export function HTrack({ header, hint, children, className, apiRef, between, small }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ idx: 0, count: 0, progress: 0, frac: 1 });

  const items = useCallback(() => [...(el.current?.children ?? [])].filter((c): c is HTMLElement => c instanceof HTMLElement && c.offsetWidth > 0), []);

  const update = useCallback(() => {
    const t = el.current;
    if (!t) return;
    const list = items();
    const max = t.scrollWidth - t.clientWidth;
    const p = max > 2 ? t.scrollLeft / max : 1;
    const base = list[0]?.offsetLeft ?? 0;
    let idx = 0;
    list.forEach((c, i) => {
      if (c.offsetLeft - base - t.scrollLeft <= 24) idx = i;
    });
    if (p > 0.985) idx = list.length - 1;
    setState({ idx, count: list.length, progress: p, frac: t.scrollWidth ? t.clientWidth / t.scrollWidth : 1 });
  }, [items]);

  const step = (dir: number) => {
    const t = el.current;
    const first = items()[0];
    if (!t) return;
    t.scrollBy({ left: dir * (first ? first.getBoundingClientRect().width + 16 : t.clientWidth * 0.8), behavior: 'smooth' });
  };

  useImperativeHandle(apiRef, () => ({
    scrollToIndex: (i) => {
      const t = el.current;
      const list = items();
      const it = list[i];
      if (t && it && list[0]) t.scrollTo({ left: it.offsetLeft - list[0].offsetLeft, behavior: 'smooth' });
    },
  }));

  // Drag-to-scroll for mouse.
  useEffect(() => {
    const t = el.current;
    if (!t) return;
    t.scrollLeft = 0;
    let down: { x: number; s: number } | null = null;
    let moved = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = { x: e.clientX, s: t.scrollLeft };
      moved = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - down.x;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        t.style.scrollSnapType = 'none';
        t.style.cursor = 'grabbing';
      }
      if (moved) t.scrollLeft = down.s - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = null;
      if (moved) {
        t.style.cursor = '';
        t.style.scrollSnapType = '';
        t.scrollBy({ left: 1, behavior: 'smooth' });
      }
    };
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    t.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    t.addEventListener('click', onClick, true);
    t.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const ro = new ResizeObserver(update);
    ro.observe(t);
    update();
    return () => {
      t.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      t.removeEventListener('click', onClick, true);
      t.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      ro.disconnect();
    };
  }, [update]);

  const atEnd = state.progress > 0.985;
  const btn = cn('grid cursor-pointer place-items-center rounded-full border border-ink-500 bg-ink-900 text-fg transition-[border-color,opacity] hover:border-fg', small ? 'size-10' : 'size-[46px]');
  const mask = atEnd ? undefined : 'linear-gradient(90deg,#000 calc(100% - 110px),transparent)';

  return (
    <div className="flex flex-col gap-9">
      <div className="flex flex-wrap items-end justify-between gap-6">
        {header}
        <div className="flex flex-wrap items-center gap-3.5">
          {hint ? <span className="label">{hint}</span> : null}
          <span className="min-w-14 font-mono text-xs text-fg" aria-live="polite">
            {state.count ? `${pad(state.idx + 1)} / ${pad(state.count)}` : ''}
          </span>
          <span aria-hidden="true" className="relative h-0.5 w-[110px] overflow-hidden rounded-sm bg-soft/15">
            <span
              className="absolute inset-0 origin-left bg-linear-to-r from-violet to-cyan"
              style={{ transform: `scaleX(${Math.min(1, state.frac + state.progress * (1 - state.frac)).toFixed(3)})` }}
            />
          </span>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous" onClick={() => step(-1)} className={btn} style={{ opacity: state.progress < 0.01 ? 0.35 : 1 }}>
              ←
            </button>
            <button type="button" aria-label="Next" onClick={() => step(1)} className={btn} style={{ opacity: atEnd ? 0.35 : 1 }}>
              →
            </button>
          </div>
        </div>
      </div>
      {between}
      <div
        ref={el}
        className={cn('bleed no-scrollbar relative -mt-3.5 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto pt-3.5 pb-6', className)}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        {children}
      </div>
    </div>
  );
}
