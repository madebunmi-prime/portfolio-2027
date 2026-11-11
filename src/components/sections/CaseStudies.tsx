import type { Portfolio } from '@/content/schema';
import { Glow } from '@/components/ui/Glow';
import { HTrack } from '@/components/ui/HTrack';
import { Media } from '@/components/ui/Media';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ACCENTS } from '@/lib/palette';

/** Lighter accent tints for small text on dark — keeps ≥ 4.5:1 contrast. */
const TEXT_TINT: Record<string, string> = { violet: '#c4b5fd', cyan: '#a5f3fc', pink: '#fbcfe8', amber: '#fde68a', green: '#a7f3d0', blue: '#bfdbfe' };

export function CaseStudies({ data }: { data: Portfolio['work'] }) {
  return (
    <section id={data.id} className="flex flex-col gap-9 pt-[clamp(96px,11vw,160px)]">
      <HTrack hint="Drag / swipe" header={<SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />} className="gap-[18px]">
        {data.items.map((p) => {
          const c = ACCENTS[p.accent];
          const tc = TEXT_TINT[p.accent];
          return (
            <Glow as="article" key={p.title} color={c} className="w-[min(980px,90%)] flex-none snap-start rounded-[28px] p-px select-none" style={{ background: `linear-gradient(170deg, ${c}, rgb(34 30 78 / 0.7) 35%)` }}>
              <div className="grid h-full grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-6 rounded-[27px] bg-ink-900 p-4">
                <div className="relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[18px] border border-ink-700">
                  <Media src={p.cover} alt={p.title} label={`${data.labels.cover} · ${p.title}`} tint={c} />
                  <div className="relative flex flex-wrap gap-2 p-[18px]">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full border border-ink-600 bg-ink-950/75 px-2.5 py-1 font-mono text-[11px] text-[#e4e1fa]">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-[18px] py-2 pr-2">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">{p.meta}</span>
                    <h3 className="font-display text-[clamp(1.6rem,1vw+1.2rem,2.25rem)] leading-[1.05] font-semibold text-fg">{p.title}</h3>
                    <span className="font-medium" style={{ color: tc }}>{p.tagline}</span>
                  </div>
                  <dl className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-5 gap-y-3.5">
                    {p.story.map((s) => (
                      <div key={s.label} className="flex flex-col gap-1 border-t border-ink-600 pt-2.5">
                        <dt className="font-mono text-[10.5px] tracking-[0.08em] uppercase" style={{ color: tc }}>{s.label}</dt>
                        <dd className="text-[14.5px] text-pretty text-body">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-auto flex flex-wrap gap-2.5">
                    {p.metrics.map((m) => (
                      <div key={m.label} className="flex flex-[1_1_100px] flex-col gap-0.5 rounded-[14px] bg-ink-800 px-3.5 py-3">
                        <span className="font-display text-2xl font-semibold text-fg">{m.value}</span>
                        <span className="font-mono text-[10.5px] tracking-[0.06em] text-muted uppercase">{m.label}</span>
                      </div>
                    ))}
                  </div>
                  {p.repo || p.demo ? (
                    <div className="flex gap-4 font-mono text-xs tracking-[0.06em] uppercase">
                      {p.repo ? <a href={p.repo} target="_blank" rel="noopener noreferrer" className="text-fg underline decoration-ink-500 underline-offset-4 hover:decoration-fg">{data.labels.source} ↗</a> : null}
                      {p.demo ? <a href={p.demo} target="_blank" rel="noopener noreferrer" className="text-fg underline decoration-ink-500 underline-offset-4 hover:decoration-fg">{data.labels.demo} ↗</a> : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </Glow>
          );
        })}
      </HTrack>
    </section>
  );
}
