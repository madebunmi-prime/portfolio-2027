'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  /** px per second */
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  innerClassName?: string;
};

/**
 * Infinite, seamless row (content rendered twice) driven by GSAP's ticker.
 * Pauses while hovered or focused; static under reduced motion.
 */
export function Marquee({ children, speed = 30, direction = 'left', className, innerClassName }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = inner.current;
      const host = root.current;
      if (!el || !host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const dir = direction === 'left' ? -1 : 1;
      let x: number | null = null;
      let paused = false;
      const pause = () => (paused = true);
      const play = () => (paused = false);
      host.addEventListener('pointerenter', pause);
      host.addEventListener('pointerleave', play);
      host.addEventListener('focusin', pause);
      host.addEventListener('focusout', play);
      const tick = (_t: number, dtMs: number) => {
        const half = el.scrollWidth / 2;
        if (!half) return;
        if (x === null) x = dir > 0 ? -half : 0;
        if (!paused) x += dir * speed * Math.min(0.05, dtMs / 1000);
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        gsap.set(el, { x });
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        host.removeEventListener('pointerenter', pause);
        host.removeEventListener('pointerleave', play);
        host.removeEventListener('focusin', pause);
        host.removeEventListener('focusout', play);
      };
    },
    { scope: root, dependencies: [speed, direction] },
  );

  return (
    <div
      ref={root}
      className={cn('bleed overflow-hidden px-0!', className)}
      style={{ maskImage: 'linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)' }}
    >
      <div ref={inner} className={cn('flex w-max gap-3 px-(--gutter) py-3.5', innerClassName)}>
        {children}
        <div aria-hidden="true" className="contents">
          {children}
        </div>
      </div>
    </div>
  );
}
