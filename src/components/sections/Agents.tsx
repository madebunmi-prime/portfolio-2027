'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Portfolio } from '@/content/schema';
import { Reveal } from '@/components/motion/Reveal';
import { Glow } from '@/components/ui/Glow';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { curve } from '@/lib/graph';
import { gsap, useGSAP } from '@/lib/gsap';
import { ACCENTS, accentGradient, TONES, withAlpha } from '@/lib/palette';

type Line = { id: number; time: string; tone: string; who: string; message: string };

export function Agents({ data }: { data: Portfolio['agents'] }) {
  const L = data.labels;
  const [selId, setSel] = useState(data.initial);
  const [log, setLog] = useState<Line[]>([]);
  const graph = useRef<HTMLDivElement>(null);

  const byId = useMemo(() => Object.fromEntries(data.nodes.map((n) => [n.id, n])), [data.nodes]);
  const sel = byId[selId] ?? data.nodes[0]!;
  const isHuman = (id: string) => id === data.orchestrator;

  // Streaming run log.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let i = 0;
    const push = () => {
      const e = data.log[i % data.log.length]!;
      const line = { id: i, time: new Date().toTimeString().slice(0, 8), tone: TONES[e.tone], who: e.who, message: e.message };
      i++;
      setLog((l) => [...l, line].slice(-4));
    };
    push();
    push();
    if (reduced) return;
    const id = window.setInterval(push, 1700);
    return () => window.clearInterval(id);
  }, [data.log]);

  // Packets travelling along every edge.
  useGSAP(
    () => {
      const root = graph.current;
      if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const paths = [...root.querySelectorAll<SVGPathElement>('[data-edge]')];
      const dots = [...root.querySelectorAll<HTMLElement>('[data-packet]')];
      const tick = (t: number) => {
        paths.forEach((p, k) => {
          const d = dots[k];
          if (!d) return;
          const u = (t * 0.32 + k * 0.173) % 1;
          const pt = p.getPointAtLength(u * p.getTotalLength());
          d.style.left = `${pt.x}%`;
          d.style.top = `${pt.y}%`;
          d.style.opacity = Math.sin(u * Math.PI).toFixed(2);
        });
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: graph },
  );

  return (
    <section id={data.id} className="flex flex-col gap-9 pt-[clamp(96px,11vw,160px)] gap-7">
      <SectionHeading
        eyebrow={data.eyebrow}
        title={data.title}
        intro={data.intro}
        aside={
          <div className="flex flex-wrap gap-2.5">
            {data.stats.map((s) => (
              <div key={s.label} className="glass flex min-w-[120px] flex-col gap-0.5 rounded-2xl px-4 py-3">
                <span className="font-display text-2xl font-semibold text-fg">{s.value}</span>
                <span className="font-mono text-[10.5px] tracking-[0.06em] text-muted uppercase">{s.label}</span>
              </div>
            ))}
          </div>
        }
      />

      <Reveal className="flex flex-wrap items-stretch gap-4">
        <div className="flex min-w-0 flex-[2_1_640px] flex-col overflow-hidden rounded-3xl border border-ink-700 bg-[radial-gradient(70%_90%_at_45%_50%,rgb(34_211_238/0.08),transparent_70%),var(--color-ink-925)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-700 px-[18px] py-3.5 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
            <span className="inline-flex items-center gap-2"><span className="size-[7px] rounded-full bg-green shadow-[0_0_8px_var(--color-green)]" />{L.live}</span>
            <span>{L.hint}</span>
          </div>
          <div className="label px-[18px] pt-2 sm:hidden">Swipe to explore →</div>
          <div className="no-scrollbar overflow-x-auto max-sm:[mask-image:linear-gradient(90deg,#000_92%,transparent)] max-sm:[-webkit-mask-image:linear-gradient(90deg,#000_92%,transparent)]">
            <div ref={graph} className="relative mx-3 my-2 aspect-[2.6/1] min-w-[1180px]">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
                {data.edges.map((e) => {
                  const a = byId[e.from]!;
                  const b = byId[e.to]!;
                  const hot = e.from === sel.id || e.to === sel.id;
                  return <path key={`${e.from}-${e.to}`} data-edge d={curve(a, b)} fill="none" stroke={hot ? '#c4b5fd' : e.tool ? withAlpha(ACCENTS.cyan, 0.45) : '#2f2a66'} strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeDasharray={e.tool ? '4 4' : undefined} />;
                })}
              </svg>
              {data.edges.map((e) => {
                const c = e.tool ? ACCENTS.cyan : TONES[byId[e.from]!.tone];
                return <span key={`p-${e.from}-${e.to}`} data-packet aria-hidden="true" className="pointer-events-none absolute top-0 left-0 -mt-1 -ml-1 size-2 rounded-full opacity-0" style={{ background: c, boxShadow: `0 0 12px 2px ${c}` }} />;
              })}
              {data.nodes.map((n) => {
                const on = n.id === sel.id;
                const you = isHuman(n.id);
                const c = TONES[n.tone];
                return (
                  <button
                    key={n.id}
                    onClick={() => setSel(n.id)}
                    aria-pressed={on}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-2.5 rounded-[14px] border py-2.5 pr-3.5 pl-2.5 text-left whitespace-nowrap transition-[box-shadow,border-color] duration-300"
                    style={{
                      left: `${n.x}%`, top: `${n.y}%`,
                      borderColor: on ? '#ffffff' : withAlpha(c, 0.55),
                      background: you ? '#ffffff' : on ? '#1e1a4f' : '#120f33',
                      color: you ? '#05041a' : '#ffffff',
                      boxShadow: on ? `0 0 0 4px ${withAlpha(c, 0.2)}, 0 10px 40px -10px ${c}` : 'none',
                    }}
                  >
                    <span className="grid size-[30px] flex-none place-items-center rounded-[9px] font-mono text-[11px] font-semibold text-fg" style={{ background: you ? '#05041a' : accentGradient(c) }}>{n.mono}</span>
                    <span className="flex flex-col gap-px">
                      <span className="text-[13.5px] leading-[1.2] font-semibold">{n.label}</span>
                      <span className="font-mono text-[10px]" style={{ color: you ? '#3a3478' : '#aaa5d6' }}>{n.tech}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="min-h-[118px] border-t border-ink-700 bg-[#07061a] px-[18px] py-3.5 font-mono text-[12.5px] leading-[1.7]" aria-live="polite">
            {log.map((l) => (
              <div key={l.id} className="text-body">
                <span className="text-[#5d5890]">{l.time}</span>{'  '}<span style={{ color: l.tone }}>[{l.who}]</span> {l.message}
              </div>
            ))}
          </div>
        </div>

        <Glow as="aside" color={ACCENTS.cyan} lift={false} aria-live="polite" className="glass flex min-w-0 flex-[1_1_300px] flex-col gap-[18px] rounded-3xl p-[26px]">
          <div className="flex items-center gap-3.5">
            <span className="grid size-12 place-items-center rounded-[14px] font-mono font-semibold text-fg" style={{ background: isHuman(sel.id) ? '#3a3478' : accentGradient(TONES[sel.tone]) }}>{sel.mono}</span>
            <div className="flex flex-col">
              <h3 className="font-display text-[1.6rem] leading-[1.1] font-semibold text-fg">{sel.label}</h3>
              <span className="font-mono text-xs text-cyan">{sel.tech}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1"><span className="label">{L.role}</span><span className="font-medium text-fg">{sel.role}</span></div>
          <div className="flex flex-col gap-1"><span className="label">{L.guardrail}</span><span className="text-body">{sel.guard}</span></div>
          <div className="mt-auto flex flex-col gap-2.5 border-t border-ink-700 pt-4">
            <span className="label">{L.principles}</span>
            <span className="text-[15px] text-body">{L.principlesBody}</span>
          </div>
        </Glow>
      </Reveal>
    </section>
  );
}
