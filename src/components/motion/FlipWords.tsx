'use client';

import { useRef } from 'react';
import { FULL_MOTION, gsap, useGSAP } from '@/lib/gsap';

/** Rotates through `words` with a slot-machine roll and a width tween. */
export function FlipWords({ words, interval = 2.6 }: { words: string[]; interval?: number }) {
  const wrap = useRef<HTMLSpanElement>(null);
  const word = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const w = word.current;
      const box = wrap.current;
      if (!w || !box || words.length < 2) return;
      gsap.matchMedia().add(FULL_MOTION, () => {
        let i = 0;
        const next = () => {
          i = (i + 1) % words.length;
          const from = box.getBoundingClientRect().width;
          gsap.to(w, {
            yPercent: -100,
            opacity: 0,
            duration: 0.32,
            ease: 'power2.in',
            onComplete: () => {
              w.textContent = words[i] ?? '';
              const to = box.getBoundingClientRect().width;
              gsap.fromTo(box, { width: from }, { width: to, duration: 0.38, ease: 'expo.out', clearProps: 'width' });
              gsap.fromTo(w, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.46, ease: 'expo.out' });
            },
          });
        };
        const id = window.setInterval(next, interval * 1000);
        return () => window.clearInterval(id);
      });
    },
    { dependencies: [words.join('|'), interval] },
  );

  return (
    <span
      ref={wrap}
      className="inline-grid h-[1.4em] overflow-hidden align-bottom font-semibold whitespace-nowrap text-fg shadow-[inset_0_-2px_0_var(--color-cyan)]"
    >
      <span ref={word} className="inline-block" aria-live="polite">
        {words[0]}
      </span>
    </span>
  );
}
