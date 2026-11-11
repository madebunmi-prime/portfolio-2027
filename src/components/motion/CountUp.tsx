'use client';

import { useRef } from 'react';
import { FULL_MOTION, gsap, useGSAP } from '@/lib/gsap';

export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.matchMedia().add(FULL_MOTION, () => {
        const counter = { v: 0 };
        el.textContent = '0';
        gsap.to(counter, {
          v: value,
          duration: 1.6,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v));
          },
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
        return () => {
          el.textContent = String(value);
        };
      });
    },
    { dependencies: [value] },
  );

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
