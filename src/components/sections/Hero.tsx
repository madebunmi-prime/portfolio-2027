'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRef } from 'react';
import type { Portfolio } from '@/content/schema';
import { FlipWords } from '@/components/motion/FlipWords';
import { Button } from '@/components/ui/Button';
import { Highlight } from '@/components/ui/Highlight';
import { FULL_MOTION, gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { chapterOf, FINAL_CTA_AT, type HeroProgress } from '@/lib/story';

const HeroCanvas = dynamic(() => import('@/components/three/HeroCanvas'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_65%_45%,rgb(139_92_246/0.25),transparent_70%)]" />,
});

/**
 * Sticky 3D room. Scrolling the 440vh section flies the camera into the main monitor while
 * the screens play the four-chapter story; the final CTA fades in over the monitor.
 */
export function Hero({ data }: { data: Portfolio['hero'] }) {
  const section = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const chapter = useRef<HTMLSpanElement>(null);
  const finalCta = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const progress = useRef<HeroProgress>({ target: 0, smooth: 0 });

  useGSAP(
    () => {
      let lastChapter = 0;
      let ctaOn = false;
      ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: ({ progress: p }) => {
          progress.current.target = p;
          if (bar.current) bar.current.style.transform = `scaleX(${p})`;
          const { ch } = chapterOf(p);
          if (ch !== lastChapter && chapter.current) {
            chapter.current.textContent = data.chapters[ch] ?? '';
            lastChapter = ch;
          }
          const on = p > FINAL_CTA_AT;
          if (on !== ctaOn) {
            ctaOn = on;
            gsap.to(finalCta.current, { autoAlpha: on ? 1 : 0, y: on ? 0 : 20, duration: 0.5, ease: 'expo.out' });
            gsap.to(hint.current, { autoAlpha: on ? 0 : 1, duration: 0.4 });
          }
        },
      });

      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.to(copy.current, {
          clipPath: 'inset(0% 0% 100% 0%)',
          y: -60,
          ease: 'none',
          scrollTrigger: { trigger: section.current, start: '4% top', end: '20% top', scrub: true },
        });
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} id="top" data-cursor-zone aria-label="Introduction" className="relative h-[440vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {data.poster ? <Image src={data.poster} alt="" fill priority className="object-cover" /> : null}
        <div className="absolute inset-0">
          <HeroCanvas progress={progress} screens={data.screens} />
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(5_4_26/0.94)_0%,rgb(5_4_26/0.6)_40%,transparent_64%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-linear-to-t from-ink-950/90 to-transparent" />

        <div ref={copy} style={{ clipPath: 'inset(0% 0% 0% 0%)' }} className="container-page pointer-events-none absolute inset-0 flex flex-col justify-center">
          <div className="flex max-w-[820px] gap-5">
            <div aria-hidden="true" className="flex flex-none flex-col items-center pt-3.5">
              <span className="size-4 rounded-full bg-lilac shadow-[0_0_18px_4px_rgb(139_92_246/0.7)]" />
              <span className="min-h-[200px] w-[3px] flex-1 bg-linear-to-b from-violet to-transparent" />
            </div>
            <div className="pointer-events-auto flex flex-col gap-[22px]">
              {data.eyebrow ? (
                <p className="inline-flex items-center gap-2.5 font-mono text-[13px] tracking-[0.1em] text-body uppercase">
                  <span className="size-2 rounded-full bg-green shadow-[0_0_10px_var(--color-green)]" />
                  {data.eyebrow}
                </p>
              ) : null}
              <h1 className="flex flex-col gap-5">
                <span className="font-display text-[clamp(3.25rem,5.4vw+1rem,7.5rem)] leading-[0.9] font-semibold tracking-[-0.02em] whitespace-pre-line text-fg">
                  <Highlight text={data.title} />
                </span>
                <span className="max-w-[32ch] text-[clamp(1.15rem,0.8vw+0.9rem,1.55rem)] leading-[1.4] tracking-[-0.01em] text-pretty text-[#e4e1fa]">
                  {data.taglinePrefix} <FlipWords words={data.rotatingWords} /> {data.taglineSuffix}
                </span>
              </h1>
              <div className="flex flex-wrap gap-3 pt-1.5">
                <Button href={data.primaryCta.href} className="cursor-none">
                  {data.primaryCta.label} <span aria-hidden="true">→</span>
                </Button>
                {data.secondaryCta ? (
                  <Button href={data.secondaryCta.href} variant="ghost" className="cursor-none">
                    {data.secondaryCta.label}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div ref={finalCta} className="invisible absolute bottom-[16vh] left-1/2 z-[3] -translate-x-1/2 translate-y-5 opacity-0">
          <Button href={data.finalCta.href} className="cursor-none px-7 py-4">
            {data.finalCta.label} <span aria-hidden="true">↓</span>
          </Button>
        </div>

        <div ref={hint} aria-hidden="true" className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2">
          <span className="flex h-[52px] w-[30px] justify-center rounded-full border-2 border-soft/55 pt-2">
            <span className="size-2 animate-dotfall rounded-full bg-fg" />
          </span>
        </div>

        <div className="pointer-events-none absolute right-(--gutter) bottom-9 flex flex-col items-end gap-2 font-mono text-xs tracking-[0.1em] text-muted uppercase">
          <span ref={chapter} className="text-fg">
            {data.chapters[0]}
          </span>
          <span aria-hidden="true" className="relative h-0.5 w-40 overflow-hidden rounded-sm bg-soft/15">
            <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-linear-to-r from-violet to-cyan" />
          </span>
        </div>
      </div>
    </section>
  );
}
