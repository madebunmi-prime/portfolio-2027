'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, REDUCED_MOTION, ScrollTrigger } from '@/lib/gsap';

/** Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION).matches) return;

    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -96 } });
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
