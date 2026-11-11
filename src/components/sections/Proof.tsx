import type { Portfolio } from '@/content/schema';
import { CountUp } from '@/components/motion/CountUp';
import { Reveal } from '@/components/motion/Reveal';

export function Proof({ data }: { data: Portfolio['proof'] }) {
  return (
    <section aria-label="Proof" className="flex flex-col gap-2.5 pt-14">
      <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] overflow-hidden rounded-3xl border border-ink-700 bg-linear-to-b from-[rgb(22_19_57/0.9)] to-[rgb(14_12_40/0.9)]">
        {data.items.map((p) => (
          <div key={p.label} className="flex flex-col gap-2 px-[22px] py-6 shadow-[inset_-1px_0_0_var(--color-ink-700)]">
            <span className="font-display text-[clamp(2rem,1.4vw+1.4rem,2.75rem)] leading-none font-semibold tracking-[-0.01em] text-fg">
              <CountUp value={p.value} decimals={p.decimals} />
              {p.suffix}
            </span>
            <span className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">{p.label}</span>
          </div>
        ))}
      </Reveal>
      {data.note ? <span className="label pl-1 text-[11px]">{data.note}</span> : null}
    </section>
  );
}
