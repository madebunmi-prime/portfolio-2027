'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import type { Portfolio } from '@/content/schema';
import { Marquee } from '@/components/motion/Marquee';
import { GlowDecor } from '@/components/ui/Glow';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ACCENTS, accentGradient } from '@/lib/palette';
import { initials } from '@/lib/utils';

type Tool = Portfolio['toolbox']['items'][number];
type Tip = { tool: Tool; x: number; y: number; above: boolean };

const iconUrl = (slug: string) => `https://cdn.simpleicons.org/${slug}/ffffff`;

function ToolIcon({ tool }: { tool: Tool }) {
  const [failed, setFailed] = useState(false);
  if (!tool.icon || failed) return <span>{initials(tool.name.replace('.', ' '))}</span>;
  // eslint-disable-next-line @next/next/no-img-element -- external SVG icon, no optimisation needed
  return <img src={iconUrl(tool.icon)} alt="" width={22} height={22} loading="lazy" onError={() => setFailed(true)} className="block size-[22px]" />;
}

export function Toolbox({ data }: { data: Portfolio['toolbox'] }) {
  const L = data.labels;
  const [tip, setTip] = useState<Tip | null>(null);
  const color = (t: Tool) => ACCENTS[data.categories[t.category] ?? 'violet'];

  useEffect(() => {
    if (!tip) return;
    const close = () => setTip(null);
    window.addEventListener('scroll', close, { passive: true, once: true });
    return () => window.removeEventListener('scroll', close);
  }, [tip]);

  const half = Math.ceil(data.items.length / 2);
  const rows = [data.items.slice(0, half), data.items.slice(half)];

  const chip = (t: Tool) => {
    const c = color(t);
    const open = (el: HTMLElement) => {
      const b = el.getBoundingClientRect();
      setTip({ tool: t, x: Math.max(160, Math.min(window.innerWidth - 160, b.left + b.width / 2)), y: b.top > 260 ? b.top : b.bottom, above: b.top > 260 });
    };
    return (
      <button
        key={t.name}
        type="button"
        onMouseEnter={(e) => open(e.currentTarget)}
        onFocus={(e) => open(e.currentTarget)}
        onMouseLeave={() => setTip(null)}
        onBlur={() => setTip(null)}
        aria-describedby={tip?.tool.name === t.name ? 'tool-tip' : undefined}
        className="glow glass flex flex-none cursor-pointer items-center gap-3 rounded-2xl py-2.5 pr-[18px] pl-2.5 text-left text-fg"
        style={{ '--glow': c } as CSSProperties}
      >
        <span className="grid size-10 flex-none place-items-center rounded-[11px] font-mono text-xs font-semibold" style={{ background: accentGradient(c) }}>
          <ToolIcon tool={t} />
        </span>
        <span className="flex flex-col gap-px">
          <span className="text-[15px] leading-[1.2] font-semibold">{t.name}</span>
          <span className="font-mono text-[10.5px] tracking-[0.06em] text-muted uppercase">{t.category}</span>
        </span>
        <GlowDecor spot={false} />
      </button>
    );
  };

  return (
    <section id={data.id} className="flex flex-col gap-5 pt-[clamp(96px,11vw,160px)]">
      <div className="pb-3">
        <SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} aside={<span className="label text-[11px]">{L.pause}</span>} />
      </div>
      <Marquee speed={34} direction="left">{rows[0]!.map(chip)}</Marquee>
      <Marquee speed={28} direction="right">{rows[1]!.map(chip)}</Marquee>

      {tip ? (
        <div
          id="tool-tip"
          role="tooltip"
          className="pointer-events-none fixed z-[75] flex w-[300px] flex-col gap-3 rounded-[18px] border border-lilac/30 bg-[rgb(18_15_51/0.94)] p-[18px] backdrop-blur-[18px]"
          style={{
            left: tip.x, top: tip.y,
            transform: tip.above ? 'translate(-50%, calc(-100% - 12px))' : 'translate(-50%, 12px)',
            boxShadow: `0 24px 70px -20px rgb(0 0 0 / 0.85), 0 0 40px -10px ${color(tip.tool)}`,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-[38px] place-items-center rounded-[10px] font-mono text-xs font-semibold text-fg" style={{ background: accentGradient(color(tip.tool)) }}>
              <ToolIcon tool={tip.tool} />
            </span>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-fg">{tip.tool.name}</span>
              <span className="font-mono text-[10.5px] tracking-[0.06em] uppercase" style={{ color: color(tip.tool) }}>{tip.tool.category}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="label text-[10px]">{L.how}</span>
            <span className="text-[14.5px] leading-[1.45] text-fg">{tip.tool.how}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="label text-[10px]">{L.usedIn}</span>
            <div className="flex flex-wrap gap-1.5">
              {tip.tool.usedIn.map((u) => <span key={u} className="rounded-[7px] bg-ink-700 px-[9px] py-[3px] text-[12.5px] text-fg">{u}</span>)}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
