'use client';

import { useMemo, useState } from 'react';
import type { Portfolio } from '@/content/schema';
import { Reveal } from '@/components/motion/Reveal';
import { Glow } from '@/components/ui/Glow';
import { HTrack } from '@/components/ui/HTrack';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { contextView, KIND_COLOR, type C4View } from '@/lib/c4';
import { curve } from '@/lib/graph';
import { ACCENTS, withAlpha } from '@/lib/palette';
import { cn } from '@/lib/utils';

type View = 'context' | 'container';

export function Systems({ data }: { data: Portfolio['systems'] }) {
  const L = data.labels;
  const [sysIndex, setSys] = useState(0);
  const [view, setView] = useState<View>('container');
  const [zonesOn, setZones] = useState(false);
  const [nodeId, setNode] = useState<string | null>(null);

  const sys = data.items[sysIndex] ?? data.items[0]!;
  const V: C4View = useMemo(
    () => (view === 'context' ? contextView(sys, L.systemTech) : { nodes: sys.container.nodes, edges: sys.container.edges, zones: sys.container.zones }),
    [sys, view, L.systemTech],
  );
  const byId = useMemo(() => Object.fromEntries(V.nodes.map((n) => [n.id, n])), [V]);
  const sel = (nodeId ? byId[nodeId] : undefined) ?? V.nodes.find((n) => n.kind !== 'actor') ?? V.nodes[0]!;
  const showZones = zonesOn && view === 'container';

  const views: { id: View | 'zones'; label: string; on: boolean }[] = [
    { id: 'context', label: L.viewContext, on: view === 'context' },
    { id: 'container', label: L.viewContainer, on: view === 'container' && !showZones },
    { id: 'zones', label: L.viewZones, on: showZones },
  ];
  const pickView = (id: View | 'zones') => {
    if (id === 'zones') {
      setZones(!showZones);
      setView('container');
    } else {
      setZones(false);
      setView(id);
      setNode(null);
    }
  };
  const k = KIND_COLOR[sel.kind];

  return (
    <section id={data.id} className="flex flex-col gap-9 pt-[clamp(96px,11vw,160px)] gap-7">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />

      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div role="tablist" aria-label="Systems" className="no-scrollbar flex max-w-full gap-2 overflow-x-auto">
          {data.items.map((s, i) => (
            <button
              key={s.name}
              role="tab"
              aria-selected={i === sysIndex}
              onClick={() => {
                setSys(i);
                setNode(null);
              }}
              className={cn('flex flex-none cursor-pointer flex-col items-start gap-0.5 rounded-2xl border px-[18px] py-3 text-left text-fg', i === sysIndex ? 'border-violet bg-[linear-gradient(160deg,rgb(139_92_246/0.25),var(--color-ink-900))]' : 'border-ink-700 bg-ink-900')}
            >
              <span className="text-[15px] font-semibold">{s.name}</span>
              <span className="font-mono text-[11px] tracking-[0.06em] text-muted uppercase">{s.kind}</span>
            </button>
          ))}
        </div>
        <div className="glass flex gap-1.5 rounded-full p-[5px]">
          {views.map((v) => (
            <button key={v.id} onClick={() => pickView(v.id)} aria-pressed={v.on} className={cn('cursor-pointer rounded-full px-3.5 py-2 font-mono text-xs tracking-[0.04em]', v.on ? 'bg-fg text-ink-950' : 'text-body')}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <Reveal className="flex flex-wrap items-stretch gap-4">
        <div className="flex min-w-0 flex-[2_1_640px] flex-col overflow-hidden rounded-3xl border border-ink-700 bg-[radial-gradient(80%_80%_at_50%_40%,rgb(139_92_246/0.12),transparent_70%),var(--color-ink-925)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-700 px-[18px] py-3.5 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
            <span>{`${sys.name} · ${view === 'context' ? L.contextTitle : L.containerTitle}${showZones ? L.deploymentSuffix : ''}`}</span>
            <span className="flex flex-wrap gap-3.5">
              <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 bg-[#8b7ff0]" />{L.sync}</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-4 border-t-2 border-dashed border-amber" />{L.async}</span>
            </span>
          </div>
          <div className="no-scrollbar overflow-x-auto">
            <div className="relative m-2 aspect-video min-w-[680px]">
              {showZones
                ? V.zones.map((z) => (
                    <div key={z.label} className="absolute rounded-[18px] border border-dashed border-ink-500 bg-violet/[0.04]" style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}>
                      <span className="label absolute top-2 left-3 text-[10px]">{z.label}</span>
                    </div>
                  ))
                : null}
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
                {V.edges.map((e) => {
                  const a = byId[e.from];
                  const b = byId[e.to];
                  if (!a || !b) return null;
                  const hot = e.from === sel.id || e.to === sel.id;
                  const d = curve(a, b);
                  return (
                    <g key={`${e.from}-${e.to}`}>
                      <path d={d} fill="none" stroke={hot ? '#c4b5fd' : e.async ? withAlpha(ACCENTS.amber, 0.55) : '#3a3478'} strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeDasharray={e.async ? '2 1.6' : undefined} pathLength={100} />
                      <path className="flow" d={d} fill="none" stroke={e.async ? ACCENTS.amber : ACCENTS.cyan} strokeWidth={2.5} vectorEffect="non-scaling-stroke" strokeDasharray="1.5 8" strokeLinecap="round" pathLength={100} opacity={hot ? 1 : 0.35} />
                    </g>
                  );
                })}
              </svg>
              {V.nodes.map((n) => {
                const c = KIND_COLOR[n.kind];
                const on = n.id === sel.id;
                const big = n.kind === 'system';
                const dashed = n.kind === 'actor' || n.kind === 'external';
                return (
                  <button
                    key={n.id}
                    onClick={() => setNode(n.id)}
                    aria-pressed={on}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-[3px] text-center text-fg transition-[box-shadow,border-color] duration-300"
                    style={{
                      left: `${n.x}%`, top: `${n.y}%`,
                      minWidth: big ? 200 : 118, padding: big ? '22px 26px' : '9px 14px',
                      borderRadius: n.kind === 'store' ? 22 : n.kind === 'actor' ? 999 : 14,
                      border: `${on ? 2 : 1}px ${dashed ? 'dashed' : 'solid'} ${on ? '#ffffff' : withAlpha(c, dashed ? 0.5 : 0.75)}`,
                      background: big ? 'linear-gradient(160deg,#2a1f6e,#151236)' : on ? '#1e1a4f' : '#120f33',
                      boxShadow: on ? `0 0 0 4px ${withAlpha(c, 0.18)}, 0 10px 40px -10px ${c}` : 'none',
                    }}
                  >
                    <span className="font-mono text-[9px] tracking-[0.1em] uppercase" style={{ color: c }}>{L.kinds[n.kind]}</span>
                    <span className="leading-[1.15] font-semibold whitespace-nowrap" style={{ fontSize: big ? 20 : 14 }}>{n.label}</span>
                    <span className="font-mono text-[10px] whitespace-nowrap text-muted">{n.tech}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap border-t border-ink-700">
            {sys.scale.map((m) => (
              <div key={m.label} className="flex flex-[1_1_140px] flex-col gap-0.5 px-[18px] py-3.5 shadow-[inset_-1px_0_0_var(--color-ink-700)]">
                <span className="font-display text-[1.4rem] font-semibold text-fg">{m.value}</span>
                <span className="font-mono text-[10.5px] tracking-[0.08em] text-muted uppercase">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <Glow as="aside" color={ACCENTS.cyan} lift={false} aria-live="polite" className="glass flex min-w-0 flex-[1_1_300px] flex-col gap-5 rounded-3xl p-[26px]">
          <div className="flex flex-col gap-2">
            <span className="self-start rounded-full px-2.5 py-1 font-mono text-[10.5px] tracking-[0.08em] uppercase" style={{ background: withAlpha(k, 0.14), color: k }}>{L.kinds[sel.kind]}</span>
            <h3 className="font-display text-[1.75rem] leading-[1.1] font-semibold text-fg">{sel.label}</h3>
            <span className="font-mono text-[12.5px] text-cyan">{sel.tech}</span>
          </div>
          <dl className="flex flex-col gap-4">
            <div className="flex flex-col gap-1"><dt className="label">{L.decision}</dt><dd className="font-medium text-fg">{sel.decision ?? L.placeholder.decision}</dd></div>
            <div className="flex flex-col gap-1"><dt className="label">{L.why}</dt><dd className="text-body">{sel.why ?? L.placeholder.why}</dd></div>
            <div className="flex flex-col gap-1"><dt className="label">{L.tradeoff}</dt><dd className="text-body">{sel.tradeoff ?? L.placeholder.tradeoff}</dd></div>
          </dl>
          <div className="mt-auto flex flex-col gap-2 border-t border-ink-700 pt-4">
            <span className="label">{L.modelledWith}</span>
            <span className="font-mono text-[12.5px] text-body">{L.modelledWithValue}</span>
          </div>
        </Glow>
      </Reveal>

      <HTrack small header={<span className="font-mono text-xs tracking-[0.08em] text-fg uppercase">{`${L.adrs} · ${sys.name}`}</span>} className="gap-3.5" key={sys.name}>
        {sys.adrs.map((a) => (
          <Glow as="article" key={a.id} color={ACCENTS.cyan} className="glass flex w-[min(400px,86%)] flex-none snap-start flex-col gap-3.5 rounded-[20px] p-[22px] select-none">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-cyan">{a.id}</span>
              <span className="rounded-full bg-green/12 px-[9px] py-[3px] font-mono text-[10.5px] tracking-[0.06em] text-green uppercase">{a.status}</span>
            </div>
            <h4 className="text-lg leading-[1.3] font-semibold text-fg">{a.title}</h4>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-2 text-[14.5px]">
              <dt className="label pt-[3px]">{L.adrContext}</dt><dd className="text-body">{a.context}</dd>
              <dt className="label pt-[3px]">{L.adrDecision}</dt><dd className="text-fg">{a.decision}</dd>
              <dt className="label pt-[3px]">{L.adrCost}</dt><dd className="text-body">{a.consequence}</dd>
            </dl>
          </Glow>
        ))}
      </HTrack>
    </section>
  );
}
