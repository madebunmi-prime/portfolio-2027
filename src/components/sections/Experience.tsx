'use client';

import Image from 'next/image';
import { Fragment, useEffect, useMemo, useState } from 'react';
import type { Portfolio } from '@/content/schema';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ACCENTS, withAlpha } from '@/lib/palette';
import { formatDuration, formatYearMonth, layoutTimeline } from '@/lib/timeline';
import { initials } from '@/lib/utils';

type Props = { data: Portfolio['experience']; builtAt: string };

const LANE = 32;

export function Experience({ data, builtAt }: Props) {
  // Render with the build date (matches the static HTML), then refresh to "now" on the client.
  const [now, setNow] = useState(() => new Date(builtAt));
  useEffect(() => setNow(new Date()), []);
  const [active, setActive] = useState(-1);

  const { rows, laneCount, years } = useMemo(() => layoutTimeline(data.items, now), [data.items, now]);
  const L = data.labels;

  const parallelNote = (n: number) =>
    n === 0 ? L.solo : n === 1 ? L.parallelOne : L.parallelMany.replace('{n}', String(n));

  const scrollToRow = (i: number) => {
    const el = document.getElementById(`exp-${i}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
  };

  return (
    <section id={data.id ?? 'experience'} className="flex flex-col gap-10 pt-24 md:pt-40">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />

      {/* Career ribbon — every role on one shared axis so overlaps read at a glance */}
      <Reveal className="flex flex-col gap-3.5 rounded-3xl border border-ink-700 bg-ink-900 px-4 pt-6 pb-5 md:px-8">
        <div className="flex flex-wrap justify-between gap-4 font-mono text-xs tracking-[0.1em] text-muted uppercase">
          <span>{L.ribbon}</span>
          <span className="max-md:hidden">{L.ribbonHint}</span>
        </div>
        <div className="relative" style={{ height: laneCount * LANE + 26 }} onMouseLeave={() => setActive(-1)}>
          {years.map((y) => (
            <Fragment key={y.label}>
              <span aria-hidden="true" className="absolute top-0 bottom-[22px] w-px bg-ink-700" style={{ left: `${y.left * 100}%` }} />
              <span className="absolute bottom-0 -translate-x-1/2 font-mono text-[11px] text-faint" style={{ left: `${y.left * 100}%` }}>
                {y.label}
              </span>
            </Fragment>
          ))}
          {rows.map((r) => {
            const c = ACCENTS[r.item.accent];
            const on = active === r.index;
            return (
              <button
                key={r.index}
                type="button"
                onMouseEnter={() => setActive(r.index)}
                onFocus={() => setActive(r.index)}
                onClick={() => scrollToRow(r.index)}
                title={`${r.item.title} — ${r.item.company}`}
                className="absolute h-[26px] cursor-pointer overflow-hidden rounded-lg px-2.5 text-left text-xs font-semibold text-ellipsis whitespace-nowrap text-fg transition-[opacity,box-shadow] duration-300"
                style={{
                  left: `${r.left * 100}%`,
                  width: `${r.width * 100}%`,
                  top: r.lane * LANE,
                  background: `linear-gradient(90deg, ${c}, ${withAlpha(c, 0.55)})`,
                  opacity: active >= 0 && !on ? 0.4 : 1,
                  boxShadow: on ? `0 0 0 2px #fff, 0 0 24px ${c}` : 'none',
                }}
              >
                {r.item.title}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Detailed timeline */}
      <ol className="relative flex flex-col gap-5 pl-10">
        <span aria-hidden="true" className="absolute top-3 bottom-3 left-[11px] w-0.5 bg-linear-to-b from-violet via-cyan to-transparent" />
        {rows.map((r) => {
          const e = r.item;
          const c = ACCENTS[e.accent];
          const on = active === r.index;
          return (
            <li key={r.index} id={`exp-${r.index}`} className="relative" onMouseEnter={() => setActive(r.index)}>
              <span
                aria-hidden="true"
                className="absolute top-[26px] -left-10 grid size-6 place-items-center rounded-full border-2 bg-ink-950"
                style={{ borderColor: c, boxShadow: `0 0 0 4px var(--color-ink-950), 0 0 16px ${c}` }}
              >
                <span className="size-2 rounded-full" style={{ background: c }} />
              </span>
              <Reveal>
                <article
                  className="flex flex-col gap-[18px] rounded-[20px] border bg-ink-900 p-5 transition-colors duration-300 md:p-[30px]"
                  style={{ borderColor: on ? c : 'var(--color-ink-700)' }}
                >
                  <header className="flex flex-wrap items-center gap-4">
                    <span className="relative grid size-[52px] flex-none place-items-center overflow-hidden rounded-[14px] border border-ink-600 bg-[repeating-linear-gradient(135deg,#1c1946_0_5px,#17143a_5px_10px)] font-mono text-xs text-muted">
                      {e.logo ? <Image src={e.logo} alt={`${e.company} logo`} fill sizes="52px" className="object-contain p-2" /> : initials(e.company)}
                    </span>
                    <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-0.5">
                      <h3 className="text-[clamp(1.2rem,0.6vw+1rem,1.5rem)] leading-tight font-bold text-fg [font-stretch:94%]">{e.title}</h3>
                      <p className="text-muted">{e.company}</p>
                    </div>
                    <span className="rounded-full border border-ink-600 bg-ink-950/70 px-3 py-1.5 font-mono text-xs tracking-[0.08em] whitespace-nowrap text-fg uppercase">
                      {formatYearMonth(e.start)} — {e.end ? formatYearMonth(e.end) : L.present}
                    </span>
                  </header>
                  {e.bullets.length ? (
                    <ul className="flex list-disc flex-col gap-2 pl-[18px] text-soft">
                      {e.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                  <footer className="flex flex-wrap items-center gap-2">
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] text-body uppercase"
                      style={{ background: withAlpha(c, 0.14) }}
                    >
                      <span className="size-1.5 rounded-full" style={{ background: c }} />
                      {parallelNote(r.overlaps)}
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.08em] text-faint uppercase">
                      {formatDuration(r.months)}
                      {r.ongoing ? ` · ${L.ongoing}` : ''}
                    </span>
                  </footer>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
