import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { Highlight } from './Highlight';

type Props = { eyebrow: string; title: string; intro?: string; aside?: ReactNode; as?: 'h2' | 'h3' };

export function SectionHeading({ eyebrow, title, intro, aside }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="flex max-w-[680px] flex-col gap-3.5">
        <p className="eyebrow">{eyebrow}</p>
        <Reveal direction="x">
          <h2 className="font-display text-[clamp(2.25rem,2.6vw+1.2rem,4.25rem)] leading-[0.98] font-semibold tracking-[-0.015em] whitespace-pre-line text-fg">
            <Highlight text={title} />
          </h2>
        </Reveal>
        {intro ? <p className="text-pretty text-body">{intro}</p> : null}
      </div>
      {aside}
    </div>
  );
}
