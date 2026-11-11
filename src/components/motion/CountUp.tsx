'use client';

import { useRef } from 'react';
import { FULL_MOTION, gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

/** Counts up from 0 every time it scrolls into view. */
export function CountUp({ value, decimals = 0, className }: { value: number; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.matchMedia().add(FULL_MOTION, () => {
        const counter = { v: 0 };
        const render = () => (el.textContent = counter.v.toFixed(decimals));
        const run = () => gsap.fromTo(counter, { v: 0 }, { v: value, duration: 1.6, ease: 'power3.out', onUpdate: render, overwrite: true });
        render();
        ScrollTrigger.create({ trigger: el, start: 'top 90%', end: 'bottom 10%', onEnter: run, onEnterBack: run });
        return () => {
          el.textContent = value.toFixed(decimals);
        };
      });
    },
    { dependencies: [value, decimals] },
  );

  return (
    <span ref={ref} className={className}>
      {value.toFixed(decimals)}
    </span>
  );
}
