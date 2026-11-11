import { Reveal } from '@/components/motion/Reveal';
import { Highlight } from './Highlight';

type Props = { eyebrow: string; title: string; intro?: string };

export function SectionHeading({ eyebrow, title, intro }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="flex flex-col gap-3.5">
        <p className="eyebrow">{eyebrow}</p>
        <Reveal direction="x">
          <h2 className="text-[clamp(2.25rem,2.6vw+1.2rem,4.25rem)] leading-[0.98] font-bold tracking-[-0.03em] whitespace-pre-line text-fg [font-stretch:90%]">
            <Highlight text={title} />
          </h2>
        </Reveal>
      </div>
      {intro ? <p className="max-w-[44ch] text-pretty text-soft">{intro}</p> : null}
    </div>
  );
}
