import type { Portfolio } from '@/content/schema';
import { CountUp } from '@/components/motion/CountUp';
import { Reveal } from '@/components/motion/Reveal';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ACCENTS, withAlpha } from '@/lib/palette';

export function Approach({ data }: { data: Portfolio['approach'] }) {
  return (
    <section id={data.id} className="flex flex-col gap-12 pt-24 md:pt-40">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />

      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-4">
        {data.items.map((a, i) => {
          const c = ACCENTS[a.accent];
          return (
            <li key={`${a.title}-${i}`}>
              <Reveal delay={i * 0.07} className="flex h-full flex-col gap-7 rounded-[22px] border border-ink-700 bg-linear-to-b from-ink-850 to-[#0b0a24] px-6 pt-[26px] pb-7 transition-colors hover:border-ink-500">
                <span
                  className="grid size-[52px] place-items-center rounded-2xl text-fg"
                  style={{ background: `linear-gradient(135deg, ${c}, ${withAlpha(c, 0.45)})`, boxShadow: `0 10px 30px -10px ${c}` }}
                >
                  <Icon name={a.icon} className="size-6" />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl leading-tight font-bold text-fg [font-stretch:94%]">{a.title}</h3>
                  <p className="text-base text-pretty text-soft">{a.description}</p>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>

      {data.stats.length ? (
        <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] overflow-hidden rounded-3xl border border-ink-600 bg-[radial-gradient(80%_140%_at_50%_0%,rgb(139_92_246/0.22),var(--color-ink-900)_70%)]">
          {data.stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5 px-6 py-10 text-center">
              <span className="bg-linear-to-b from-fg to-[#b9b0f5] bg-clip-text text-[clamp(3rem,3vw+2rem,5.25rem)] leading-none font-extrabold tracking-[-0.04em] text-transparent [font-stretch:88%]">
                <CountUp value={s.value} />
                {s.suffix}
              </span>
              <span className="font-mono text-xs tracking-[0.1em] text-soft uppercase">{s.label}</span>
            </div>
          ))}
        </Reveal>
      ) : null}
    </section>
  );
}
