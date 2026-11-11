import type { Portfolio } from '@/content/schema';
import { Reveal } from '@/components/motion/Reveal';
import { Icon } from '@/components/ui/Icon';
import { ACCENTS, withAlpha } from '@/lib/palette';

export function Process({ data }: { data: Portfolio['process'] }) {
  return (
    <section aria-label={data.label} className="pt-14">
      <Reveal>
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3 rounded-3xl border border-ink-700 bg-linear-to-b from-ink-800/90 to-ink-900/90 p-3">
          {data.steps.map((step, i) => {
            const c = ACCENTS[step.accent];
            return (
              <li key={step.label} className="flex items-center gap-4 rounded-2xl bg-ink-950/55 px-[18px] py-4">
                <span
                  className="grid size-12 flex-none place-items-center rounded-[14px] text-fg"
                  style={{ background: `linear-gradient(135deg, ${c}, ${withAlpha(c, 0.5)})`, boxShadow: `0 8px 24px -8px ${c}` }}
                >
                  <Icon name={step.icon} className="size-[22px]" />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-mono text-xs tracking-[0.1em] text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-lg font-semibold text-fg [font-stretch:96%]">{step.label}</span>
                </span>
                {i < data.steps.length - 1 ? (
                  <span aria-hidden="true" className="ml-auto font-mono text-ink-500">→</span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </Reveal>
    </section>
  );
}
