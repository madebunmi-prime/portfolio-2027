'use client';

import Image from 'next/image';
import { useRef } from 'react';
import type { Portfolio } from '@/content/schema';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ACCENTS } from '@/lib/palette';

export function Testimonials({ data }: { data: Portfolio['testimonials'] }) {
  const track = useRef<HTMLUListElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * Math.min(420, el.clientWidth * 0.86), behavior: 'smooth' });
  };

  const arrow =
    'grid size-[52px] place-items-center rounded-full border border-ink-500 bg-ink-900 text-lg text-fg transition-colors hover:border-fg';

  return (
    <section id={data.id} className="flex flex-col gap-10 pt-24 md:pt-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />
        <div className="flex gap-2.5">
          <button type="button" onClick={() => scrollBy(-1)} aria-label={data.labels.previous} className={arrow}>←</button>
          <button type="button" onClick={() => scrollBy(1)} aria-label={data.labels.next} className={arrow}>→</button>
        </div>
      </div>

      <ul
        ref={track}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 md:-mx-12 md:scroll-px-12 md:px-12"
      >
        {data.items.map((t, i) => (
          <li key={`${t.name}-${i}`} className="flex-[0_0_min(400px,84%)] snap-start">
            <Reveal delay={i * 0.07} className="h-full">
              <figure className="flex h-full flex-col gap-7 rounded-3xl border border-ink-700 bg-ink-900 p-8">
                <span aria-hidden="true" className="text-gradient h-9 text-[72px] leading-[0.6] font-extrabold">“</span>
                <blockquote className="text-lg leading-normal text-pretty text-[#e4e1fa]">{t.quote}</blockquote>
                <figcaption className="mt-auto flex items-center gap-3.5">
                  <span
                    className="relative size-[52px] flex-none overflow-hidden rounded-full border-2 bg-[repeating-linear-gradient(135deg,#221e4e_0_4px,#1a1745_4px_8px)]"
                    style={{ borderColor: ACCENTS[t.accent] }}
                  >
                    {t.avatar ? <Image src={t.avatar} alt={t.name} fill sizes="52px" className="object-cover" /> : null}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-semibold text-fg">{t.name}</span>
                    <span className="text-sm text-muted">{[t.role, t.company].filter(Boolean).join(' · ')}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
