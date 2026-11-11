import type { C4Kind, Portfolio } from '@/content/schema';

type System = Portfolio['systems']['items'][number];
export type C4Node = System['container']['nodes'][number];
export type C4Edge = { from: string; to: string; async: boolean };
export type C4View = { nodes: C4Node[]; edges: C4Edge[]; zones: System['container']['zones'] };

/** Derives the C4 *context* view (actors → system → externals) from the content JSON. */
export function contextView(sys: System, systemTech: string): C4View {
  const { actors, externals, decision, why, tradeoff } = sys.context;
  const nodes: C4Node[] = [
    ...actors.map((a, i) => ({ id: `a${i}`, label: a.label, tech: a.tech, kind: 'actor' as C4Kind, x: 11, y: actors.length === 1 ? 50 : 26 + i * 48 })),
    { id: 'sys', label: sys.name, tech: systemTech, kind: 'system', x: 50, y: 50, decision, why, tradeoff },
    ...externals.map((e, i) => ({
      id: `e${i}`, label: e.label, tech: e.tech, kind: 'external' as C4Kind, x: 88,
      y: externals.length === 1 ? 50 : 18 + i * (64 / (externals.length - 1)),
    })),
  ];
  const edges: C4Edge[] = [
    ...actors.map((_, i) => ({ from: `a${i}`, to: 'sys', async: false })),
    ...externals.map((e, i) => ({ from: 'sys', to: `e${i}`, async: e.async })),
  ];
  return { nodes, edges, zones: [] };
}

export const KIND_COLOR: Record<C4Kind, string> = {
  actor: '#aaa5d6', system: '#8b5cf6', external: '#aaa5d6', service: '#8b5cf6', store: '#22d3ee', queue: '#fbbf24', ai: '#f472b6',
};
