import type { Portfolio } from '@/content/schema';
import { Glow } from '@/components/ui/Glow';
import { HTrack } from '@/components/ui/HTrack';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ACCENTS, accentGradient } from '@/lib/palette';

export function Lifecycle({ data }: { data: Portfolio['lifecycle'] }) {
  return (
    <section id={data.id} className="flex flex-col gap-9 pt-[clamp(96px,11vw,160px)]">
      <HTrack hint="Drag / swipe" header={<SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />}>
        {data.stages.map((s, i) => {
          const c = ACCENTS[s.accent];
          return (
            <Glow as="article" key={s.title} color={c} className="glass flex w-[min(360px,84%)] flex-none snap-start flex-col gap-[22px] rounded-3xl p-[26px] select-none">
              <div className="flex items-center justify-between">
                <span className="grid size-[52px] place-items-center rounded-2xl text-fg" style={{ background: accentGradient(c), boxShadow: `0 10px 30px -10px ${c}` }}>
                  <Icon name={s.icon} className="size-6" />
                </span>
                <span className="font-display text-[44px] leading-none font-semibold text-ink-700">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-[1.6rem] leading-[1.1] font-semibold text-fg">{s.title}</h3>
                <p className="text-pretty text-body">{s.line}</p>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="label text-[11px]">{data.labels.artefacts}</span>
                <div className="flex flex-wrap gap-1.5">
                  {s.artefacts.map((a) => (
                    <span key={a} className="rounded-lg border border-ink-600 bg-ink-750 px-2.5 py-[5px] text-[13px] text-[#e4e1fa]">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-auto flex flex-col gap-2.5">
                <span className="label text-[11px]">{data.labels.tools}</span>
                <span className="font-mono text-[12.5px]" style={{ color: c }}>
                  {s.tools}
                </span>
              </div>
            </Glow>
          );
        })}
      </HTrack>
    </section>
  );
}
