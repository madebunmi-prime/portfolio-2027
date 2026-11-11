'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRef } from 'react';
import type { Portfolio } from '@/content/schema';
import { Button } from '@/components/ui/Button';
import { Highlight } from '@/components/ui/Highlight';
import { FULL_MOTION, gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

const HeroCanvas = dynamic(() => import('@/components/three/HeroCanvas'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_65%_45%,rgb(139_92_246/0.25),transparent_70%)]" />
  ),
});

export function Hero({ data }: { data: Portfolio['hero'] }) {
  const section = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const chapter = useRef<HTMLSpanElement>(null);
  /** 0→1 scroll progress through the hero, read every frame by the camera rig */
  const progress = useRef(0);

  useGSAP(
    () => {
      const chapters = data.chapters;
      let last = 0;
      ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: ({ progress: p }) => {
          progress.current = p;
          if (bar.current) bar.current.style.transform = `scaleX(${p})`;
          const i = Math.min(chapters.length - 1, Math.floor(p * chapters.length + 0.1));
          if (i !== last && chapter.current) {
            chapter.current.textContent = chapters[i] ?? '';
            last = i;
          }
        },
      });

      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.to(copy.current, {
          clipPath: 'inset(0% 0% 100% 0%)',
          y: -60,
          ease: 'none',
          scrollTrigger: { trigger: section.current, start: '4% top', end: '26% top', scrub: true },
        });
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} id="top" data-cursor-zone aria-label="Introduction" className="relative h-[330vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {data.poster ? <Image src={data.poster} alt="" fill priority className="object-cover" /> : null}
        <div className="absolute inset-0">
          <HeroCanvas progress={progress} />
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(5_4_26/0.92)_0%,rgb(5_4_26/0.55)_38%,transparent_62%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-linear-to-t from-ink-950/90 to-transparent" />

        <div
          ref={copy}
          style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          className="pointer-events-none absolute inset-0 mx-auto flex max-w-[1240px] flex-col justify-center px-5 md:px-12"
        >
          <div className="flex max-w-[760px] gap-5">
            <div aria-hidden="true" className="flex flex-none flex-col items-center pt-3.5">
              <span className="size-4 rounded-full bg-lilac shadow-[0_0_18px_4px_rgb(139_92_246/0.7)]" />
              <span className="min-h-[180px] w-[3px] flex-1 bg-linear-to-b from-violet to-transparent" />
            </div>
            <div className="pointer-events-auto flex flex-col gap-5">
              {data.eyebrow ? <p className="eyebrow">{data.eyebrow}</p> : null}
              <h1 className="flex flex-col gap-[18px]">
                <span className="text-[clamp(3rem,5vw+1rem,7rem)] leading-[0.92] font-extrabold tracking-[-0.035em] whitespace-pre-line text-fg [font-stretch:88%]">
                  <Highlight text={data.title} />
                </span>
                <span className="max-w-[30ch] text-[clamp(1.15rem,0.8vw+0.9rem,1.6rem)] leading-[1.35] text-pretty text-[#e4e1fa]">
                  <Highlight text={data.tagline} variant="underline" />
                </span>
              </h1>
              <div className="flex flex-wrap gap-3 pt-2">
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

        <div aria-hidden="true" className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2">
          <span className="flex h-[52px] w-[30px] justify-center rounded-full border-2 border-body/55 pt-2">
            <span className="size-2 animate-dotfall rounded-full bg-fg" />
          </span>
        </div>

        <div className="pointer-events-none absolute right-5 bottom-9 flex flex-col items-end gap-2 font-mono text-xs tracking-[0.12em] text-muted uppercase md:right-12">
          <span ref={chapter} className="text-fg">
            {data.chapters[0]}
          </span>
          <span className="relative h-0.5 w-40 overflow-hidden rounded-sm bg-body/15">
            <span
              ref={bar}
              className="absolute inset-0 origin-left bg-linear-to-r from-violet to-cyan"
              style={{ transform: 'scaleX(0)' }}
            />
          </span>
        </div>
      </div>
    </section>
  );
}
