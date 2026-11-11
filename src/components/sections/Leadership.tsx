import type { Portfolio } from '@/content/schema';
import { Glow } from '@/components/ui/Glow';
import { HTrack } from '@/components/ui/HTrack';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ACCENTS } from '@/lib/palette';

export function Leadership({ data }: { data: Portfolio['leadership'] }) {
  return (
    <section id={data.id} className="flex flex-col gap-9 pt-[clamp(96px,11vw,160px)]">
      <HTrack header={<SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />}>
        {data.items.map((l, i) => {
          const c = ACCENTS[l.accent];
          return (
            <Glow as="article" key={l.title} color={c} className="glass flex min-h-[280px] w-[min(330px,80%)] flex-none snap-start flex-col justify-between gap-7 rounded-3xl p-7 select-none">
              <span className="bg-clip-text font-display text-[4rem] leading-[0.8] font-semibold text-transparent" style={{ backgroundImage: `linear-gradient(180deg, ${c}, rgb(14 12 40 / 0))` }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-[1.4rem] leading-[1.15] font-semibold text-fg">{l.title}</h3>
                <p className="text-[15px] text-pretty text-body">{l.description}</p>
              </div>
            </Glow>
          );
        })}
      </HTrack>
    </section>
  );
}
