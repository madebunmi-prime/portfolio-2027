import type { Portfolio } from '@/content/schema';
import { Reveal } from '@/components/motion/Reveal';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ACCENTS, withAlpha } from '@/lib/palette';

export function Projects({ data }: { data: Portfolio['projects'] }) {
  return (
    <section id={data.id ?? 'work'} className="flex flex-col gap-12 pt-24 md:pt-40">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,330px),1fr))] gap-5">
        {data.items.map((p, i) => {
          const c = ACCENTS[p.accent];
          return (
            <li key={`${p.title}-${i}`}>
              <Reveal
                delay={i * 0.1}
                className="h-full rounded-[26px] p-px transition-shadow duration-500 hover:shadow-[0_30px_80px_-30px_var(--glow)]"
                style={{ background: `linear-gradient(170deg, ${c}, ${withAlpha('#221e4e', 0.7)} 40%)`, ['--glow' as string]: c }}
              >
                <article className="flex h-full flex-col gap-5 rounded-[25px] bg-ink-900 p-3.5">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-ink-700">
                    <Media src={p.cover} alt={`${p.title} cover`} label={`Cover · ${p.title}`} tint={c} />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {p.demo ? (
                        <a href={p.demo} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} — ${data.labels.demo}`} className="grid size-10 place-items-center rounded-full border border-ink-600 bg-ink-950/85 text-fg transition-colors hover:border-fg">
                          <Icon name="globe" className="size-[18px]" />
                        </a>
                      ) : null}
                      {p.repo ? (
                        <a href={p.repo} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} — ${data.labels.source}`} className="grid size-10 place-items-center rounded-full border border-ink-600 bg-ink-950/85 text-fg transition-colors hover:border-fg">
                          <Icon name="github" className="size-[18px]" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 px-2">
                    <h3 className="text-[clamp(1.4rem,0.8vw+1.1rem,1.75rem)] leading-[1.1] font-bold text-fg [font-stretch:92%]">{p.title}</h3>
                    <p className="leading-snug font-medium" style={{ color: `color-mix(in oklab, ${c} 45%, white)` }}>{p.tagline}</p>
                    <p className="text-base text-pretty text-soft">{p.description}</p>
                  </div>
                  <ul className="mt-auto flex flex-wrap gap-2 px-2 pb-2.5">
                    {p.tags.map((t) => (
                      <li key={t.label} className="font-mono text-xs" style={{ color: ACCENTS[t.accent] }}>
                        #{t.label}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
