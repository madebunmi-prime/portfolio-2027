import Image from 'next/image';
import type { Portfolio } from '@/content/schema';
import { Marquee } from '@/components/motion/Marquee';
import { Glow } from '@/components/ui/Glow';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ACCENTS } from '@/lib/palette';

export function Testimonials({ data }: { data: Portfolio['testimonials'] }) {
  return (
    <section id={data.id} className="flex flex-col gap-6 pt-[clamp(96px,11vw,160px)]">
      <div className="pb-3">
        <SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} aside={<span className="label text-[11px]">{data.labels.pause}</span>} />
      </div>
      <Marquee speed={30} innerClassName="gap-4 pt-4 pb-6">
        {data.items.map((t) => {
          const c = ACCENTS[t.accent];
          return (
            <Glow as="figure" key={t.name} color={c} lift={false} className="glass m-0 flex w-[380px] flex-none flex-col gap-[26px] rounded-3xl p-[30px] select-none">
              <span aria-hidden="true" className="text-gradient h-9 font-display text-[72px] leading-[0.6] font-bold">“</span>
              <blockquote className="text-[1.0625rem] leading-[1.55] text-pretty text-strong">{t.quote}</blockquote>
              <figcaption className="mt-auto flex items-center gap-3.5">
                <span className="relative size-12 flex-none overflow-hidden rounded-full border-2 bg-[repeating-linear-gradient(135deg,#221e4e_0_4px,#1a1745_4px_8px)]" style={{ borderColor: c }}>
                  {t.avatar ? <Image src={t.avatar} alt="" fill sizes="48px" className="object-cover" /> : null}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-semibold text-fg">{t.name}</span>
                  <span className="text-sm text-muted">{[t.role, t.company].filter(Boolean).join(' · ')}</span>
                </span>
              </figcaption>
            </Glow>
          );
        })}
      </Marquee>
    </section>
  );
}
