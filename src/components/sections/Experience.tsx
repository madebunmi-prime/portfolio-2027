'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import type { Portfolio } from '@/content/schema';
import { Reveal } from '@/components/motion/Reveal';
import { Glow } from '@/components/ui/Glow';
import { HTrack, type TrackApi } from '@/components/ui/HTrack';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ACCENTS, withAlpha } from '@/lib/palette';
import { formatDuration, formatYearMonth, layoutTimeline } from '@/lib/timeline';
import { initials } from '@/lib/utils';

const LANE = 32;

export function Experience({ data }: { data: Portfolio['experience'] }) {
  const L = data.labels;
  const [active, setActive] = useState(-1);
  const track = useRef<TrackApi>(null);
  const { rows, laneCount, years } = useMemo(() => layoutTimeline(data.items), [data.items]);

  const note = (n: number) => (n === 0 ? L.solo : n === 1 ? L.parallelOne : L.parallelMany.replace('{n}', String(n)));
  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

  const ribbon = (
    <Reveal className="glass flex flex-col gap-3.5 rounded-3xl px-[clamp(16px,2.5vw,30px)] pt-[22px] pb-[18px]">
      <div className="flex flex-wrap justify-between gap-4 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
        <span>{L.ribbon}</span>
        <span>{L.ribbonHint}</span>
      </div>
      <div className="relative" style={{ height: laneCount * LANE + 26 }}>
        {years.map((y) => (
          <span key={y.label}>
            <span className="absolute top-0 bottom-[22px] w-px bg-ink-700" style={{ left: pct(y.left) }} />
            <span className="absolute bottom-0 -translate-x-1/2 font-mono text-[11px] text-faint" style={{ left: pct(y.left) }}>{y.label}</span>
          </span>
        ))}
        {rows.map((r) => {
          const c = ACCENTS[r.item.accent];
          const on = active === r.index;
          return (
            <button
              key={r.index}
              title={`${r.item.title} at ${r.item.company}`}
              onMouseEnter={() => setActive(r.index)}
              onClick={() => {
                setActive(r.index);
                track.current?.scrollToIndex(r.index);
              }}
              className="absolute h-[26px] cursor-pointer overflow-hidden rounded-lg border-0 px-2.5 text-left text-xs font-semibold text-ellipsis whitespace-nowrap text-fg transition-[box-shadow,opacity] duration-300"
              style={{
                left: pct(r.left), width: pct(r.width), top: r.lane * LANE,
                background: `linear-gradient(90deg, ${c}, ${withAlpha(c, 0.55)})`,
                boxShadow: on ? `0 0 0 2px #fff, 0 0 24px ${c}` : 'none',
                opacity: active >= 0 && !on ? 0.4 : 1,
              }}
            >
              {r.item.title} at {r.item.company}
            </button>
          );
        })}
      </div>
    </Reveal>
  );

  return (
    <section id={data.id} className="flex flex-col gap-9 pt-[clamp(96px,11vw,160px)] gap-7">
      <HTrack apiRef={track} header={<SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />} between={ribbon}>
        {rows.map((r) => {
          const e = r.item;
          const c = ACCENTS[e.accent];
          const on = active === r.index;
          return (
            <Glow
              as="article"
              key={r.index}
              color={c}
              onMouseEnter={() => setActive(r.index)}
              className="glass flex w-[min(400px,86%)] flex-none snap-start flex-col gap-4 rounded-[22px] p-6 transition-[border-color] select-none"
              style={{ borderColor: on ? c : undefined }}
            >
              <div className="flex items-center gap-3.5">
                <span className="relative grid size-12 flex-none place-items-center overflow-hidden rounded-[14px] border bg-[repeating-linear-gradient(135deg,#1c1946_0_5px,#17143a_5px_10px)] font-mono text-xs text-fg" style={{ borderColor: c }}>
                  {e.logo ? (
                    <Image src={e.logo} alt={e.company} fill sizes="48px" className="object-contain p-1.5" />
                  ) : (
                    initials(e.company)
                  )}
                </span>
                <div className="flex min-w-0 flex-col">
                  <h3 className="text-lg leading-[1.25] font-semibold text-fg">{e.title}</h3>
                  <span className="text-[15px] text-muted">{e.company}</span>
                </div>
              </div>
              <p className="-mt-1.5 text-[13.5px] leading-[1.45] text-soft italic">{e.mission}</p>
              <span className="self-start rounded-full border border-ink-600 bg-ink-950/70 px-[11px] py-[5px] font-mono text-[11.5px] tracking-[0.04em] text-fg">
                {formatYearMonth(e.start)} — {e.end ? formatYearMonth(e.end) : L.present} · {formatDuration(r.months)}
              </span>
              <dl className="grid grid-cols-3 gap-2">
                {e.scope.map((s) => (
                  <div key={s.label} className="flex flex-col gap-0.5 rounded-xl bg-ink-800 p-2.5">
                    <dt className="font-mono text-[9.5px] tracking-[0.08em] text-faint uppercase">{s.label}</dt>
                    <dd className="text-[13.5px] font-medium text-fg">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-col gap-3">
                {e.achievements.map((a) => (
                  <div key={a.title} className="flex flex-col gap-1.5">
                    <h4 className="text-[15px] leading-[1.3] font-semibold text-fg">{a.title}</h4>
                    <ul className="flex flex-col gap-1 border-l-2 pl-3 text-[14px] leading-[1.45] text-body" style={{ borderColor: withAlpha(c, 0.4) }}>
                      {a.points.map((p) => (
                        <li key={p.label}>
                          <span className="font-mono text-[10.5px] tracking-[0.04em] text-faint uppercase">{p.label}: </span>
                          {p.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <span className="mt-auto inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.06em] text-soft uppercase">
                <span className="size-1.5 rounded-full" style={{ background: c }} />
                {note(r.overlaps)}
              </span>
            </Glow>
          );
        })}
      </HTrack>
    </section>
  );
}
