'use client';

import { useRef, type HTMLAttributes } from 'react';
import { FULL_MOTION, gsap, useGSAP } from '@/lib/gsap';

type Direction = 'up' | 'x';

const FROM: Record<Direction, string> = {
  up: 'inset(100% 0% 0% 0% round 24px)',
  x: 'inset(0% 100% 0% 0%)',
};
const TO: Record<Direction, string> = {
  up: 'inset(0% 0% 0% 0% round 24px)',
  x: 'inset(0% 0% 0% 0%)',
};

type Props = HTMLAttributes<HTMLDivElement> & {
  /** `up` = masked rise for cards, `x` = left-to-right wipe for headings */
  direction?: Direction;
  /** seconds */
  delay?: number;
};

/** Clip-path wipe on first scroll into view. No-op under reduced motion. */
export function Reveal({ direction = 'up', delay = 0, children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.fromTo(
          el,
          { clipPath: FROM[direction] },
          {
            clipPath: TO[direction],
            duration: 1,
            delay,
            ease: 'expo.out',
            clearProps: 'clipPath',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
}
