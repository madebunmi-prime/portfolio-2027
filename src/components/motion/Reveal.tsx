'use client';

import { useRef, type HTMLAttributes } from 'react';
import { FULL_MOTION, gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

type Direction = 'up' | 'x';

const FROM: Record<Direction, string> = { up: 'inset(100% 0% 0% 0% round 24px)', x: 'inset(0% 100% 0% 0%)' };
const TO: Record<Direction, string> = { up: 'inset(0% 0% 0% 0% round 24px)', x: 'inset(0% 0% 0% 0%)' };

type Props = HTMLAttributes<HTMLDivElement> & {
  /** `up` = masked rise for cards, `x` = left-to-right wipe for headings */
  direction?: Direction;
  /** seconds */
  delay?: number;
};

/**
 * Clip-path wipe that replays every time the element enters the viewport —
 * scrolling down or back up. No-op under reduced motion.
 */
export function Reveal({ direction = 'up', delay = 0, children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.matchMedia().add(FULL_MOTION, () => {
        const tween = gsap.fromTo(
          el,
          { clipPath: FROM[direction] },
          { clipPath: TO[direction], duration: 1, delay, ease: 'expo.out', paused: true, onComplete: () => gsap.set(el, { clipPath: 'none' }) },
        );
        const replay = () => tween.restart(true);
        const reset = () => tween.pause(0);
        ScrollTrigger.create({ trigger: el, start: 'top 92%', end: 'bottom 8%', onEnter: replay, onEnterBack: replay, onLeave: reset, onLeaveBack: reset });
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
