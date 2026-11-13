import { z } from 'zod';

export const accentSchema = z.enum(['violet', 'cyan', 'pink', 'amber', 'green', 'blue']);
/** Accents plus neutral tones — used where an item may be "plain" (e.g. the orchestrator node). */
export const toneSchema = z.union([accentSchema, z.enum(['white', 'muted'])]);
export const iconSchema = z.enum([
  'idea', 'concept', 'design', 'code', 'shield', 'cloud', 'lock', 'chip', 'clock',
  'discover', 'blueprint', 'pulse',
  'github', 'linkedin', 'x', 'mail', 'globe',
]);
export const modelSchema = z.enum(['cube', 'hex', 'interlock', 'orbitals', 'branch', 'orb']);
export const c4KindSchema = z.enum(['actor', 'system', 'external', 'service', 'store', 'queue', 'ai']);

export type Accent = z.infer<typeof accentSchema>;
export type Tone = z.infer<typeof toneSchema>;
export type IconName = z.infer<typeof iconSchema>;
export type ModelName = z.infer<typeof modelSchema>;
export type C4Kind = z.infer<typeof c4KindSchema>;

const text = z.string().min(1);
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use the YYYY-MM format, e.g. "2024-09"');
const media = z.string().nullable().default(null);
const url = z.string().url().nullable().default(null);
const link = z.object({ label: text, href: text });
const field = z.object({ label: text, placeholder: z.string() });
const kv = z.object({ label: text, value: text });
const pct = z.number().min(0).max(100);
/** Every section heading. Wrap ONE word of `title` in [brackets] to highlight it. */
const section = z.object({ id: z.string().optional(), eyebrow: text, title: text, intro: z.string().optional() });
const decision = { decision: z.string().optional(), why: z.string().optional(), tradeoff: z.string().optional() };

const screensSchema = z.object({
  tabs: z.object({ main: z.array(text).length(4), side: z.array(text).length(4), laptop: z.array(text).length(4) }),
  issue: z.array(z.string()),
  diagram: z.object({
    caption: text,
    /** Canvas coordinates on a 1600×900 screen; boxes are 230×110. */
    nodes: z.array(z.object({ label: text, sub: z.string(), x: z.number(), y: z.number(), accent: accentSchema.nullable() })),
    edges: z.array(z.object({ from: z.number().int(), to: z.number().int(), async: z.boolean().default(false) })),
  }),
  agentPanes: z.array(z.object({ name: text, accent: accentSchema, lines: z.array(z.string()) })).length(3),
  welcome: z.object({ code: z.array(z.string()), running: text, title: text, line: text, hint: text }),
  metrics: z.object({ label: text, bad: text, good: text, healthy: text, budget: text, remaining: text }),
  adr: z.array(z.string()),
  ci: z.array(text),
  laptop: z.object({ problem: z.array(z.string()), design: z.array(z.string()), agents: z.array(z.string()), code: z.array(z.string()) }),
});

const c4Node = z.object({ id: text, label: text, tech: z.string(), kind: c4KindSchema, x: pct, y: pct, ...decision });

export const portfolioSchema = z.object({
  site: z.object({ title: text, description: text, url: z.string().url(), locale: z.string().default('en'), ogImage: media }),
  person: z.object({ name: text, shortName: text, role: text }),
  nav: z.object({ links: z.array(link), cta: link }),

  hero: z.object({
    eyebrow: z.string(),
    /** Use \n for a line break and [brackets] for the highlighted word. */
    title: text,
    taglinePrefix: z.string(),
    rotatingWords: z.array(text).min(1),
    taglineSuffix: z.string(),
    primaryCta: link,
    secondaryCta: link.optional(),
    /** Fades in over the monitor at the end of the camera journey. */
    finalCta: link,
    chapters: z.array(text).length(4),
    poster: media,
    screens: screensSchema,
  }),

  proof: z.object({
    note: z.string(),
    items: z.array(z.object({ value: z.number(), decimals: z.number().int().min(0).default(0), suffix: z.string().default(''), label: text })),
  }),

  lifecycle: section.extend({
    labels: z.object({ artefacts: text, tools: text }),
    stages: z.array(z.object({ title: text, line: text, artefacts: z.array(text), tools: text, icon: iconSchema, accent: accentSchema })).min(1),
  }),

  systems: section.extend({
    labels: z.object({
      sync: text, async: text, decision: text, why: text, tradeoff: text, modelledWith: text, modelledWithValue: text,
      adrs: text, viewContext: text, viewContainer: text, viewZones: text,
      contextTitle: text, containerTitle: text, deploymentSuffix: z.string(), systemTech: text,
      adrContext: text, adrDecision: text, adrCost: text,
      placeholder: z.object({ decision: text, why: text, tradeoff: text }),
      kinds: z.record(c4KindSchema, text),
    }),
    items: z.array(
      z.object({
        name: text,
        kind: text,
        scale: z.array(kv),
        context: z.object({
          actors: z.array(z.object({ label: text, tech: z.string() })).min(1),
          externals: z.array(z.object({ label: text, tech: z.string(), async: z.boolean().default(false) })),
          ...decision,
        }),
        container: z.object({
          nodes: z.array(c4Node).min(1),
          edges: z.array(z.object({ from: text, to: text, async: z.boolean().default(false) })),
          zones: z.array(z.object({ label: text, x: pct, y: pct, w: pct, h: pct })).default([]),
        }),
        adrs: z.array(z.object({ id: text, title: text, status: text, context: text, decision: text, consequence: text })),
      }),
    ).min(1),
  }),

  agents: section.extend({
    stats: z.array(kv.extend({ value: text })),
    labels: z.object({ live: text, hint: text, role: text, guardrail: text, principles: text, principlesBody: text }),
    /** id of the human node (rendered inverted) and the node selected on load */
    orchestrator: text,
    initial: text,
    nodes: z.array(z.object({ id: text, label: text, tech: z.string(), mono: z.string().max(3), x: pct, y: pct, tone: toneSchema, role: text, guard: text })).min(2),
    edges: z.array(z.object({ from: text, to: text, tool: z.boolean().default(false) })),
    log: z.array(z.object({ tone: toneSchema, who: text, message: text })).min(1),
  }),

  capabilities: section.extend({
    items: z.array(z.object({ title: text, line: text, tools: z.array(text), model: modelSchema, accent: accentSchema })),
  }),

  work: section.extend({
    labels: z.object({ cover: text, source: text, demo: text }),
    items: z.array(
      z.object({
        title: text, tagline: text, meta: z.string(), tags: z.array(text), accent: accentSchema,
        cover: media, repo: url, demo: url, story: z.array(kv), metrics: z.array(kv),
      }),
    ),
  }),

  experience: section.extend({
    labels: z.object({ ribbon: text, ribbonHint: text, present: text, solo: text, parallelOne: text, parallelMany: text }),
    items: z.array(
      z.object({
        title: text, company: text, mission: text, logo: media, start: yearMonth, end: yearMonth.nullable(), accent: accentSchema, scope: z.array(kv),
        /** Top 3 achievements for this role. Each has a one-line title and 2-3 indented sub-points (label: Problem/Approach/Outcome, or similar). */
        achievements: z.array(z.object({ title: text, points: z.array(kv).min(1) })),
      }),
    ),
  }),

  leadership: section.extend({ items: z.array(z.object({ title: text, description: text, accent: accentSchema })) }),

  toolbox: section.extend({
    labels: z.object({ pause: text, how: text, usedIn: text }),
    categories: z.record(z.string(), accentSchema),
    /** `icon` is a Simple Icons slug (simpleicons.org) or null for initials. */
    items: z.array(z.object({ name: text, icon: z.string().nullable(), category: text, how: text, usedIn: z.array(text) })).min(2),
  }),

  testimonials: section.extend({
    labels: z.object({ pause: text }),
    items: z.array(z.object({ quote: text, name: text, role: z.string(), company: z.string(), avatar: media, accent: accentSchema })).min(1),
  }),

  contact: section.extend({
    body: text,
    tags: z.array(text).default([]),
    formEndpoint: z.union([z.string().url(), z.literal('')]),
    email: z.string().email(),
    fields: z.object({ name: field, email: field, message: field }),
    labels: z.object({ submit: text, sending: text, success: text, error: text }),
  }),

  socials: z.array(z.object({ label: text, handle: z.string(), href: z.string().url(), icon: iconSchema })),
  footer: z.object({ copyright: text, note: z.string().optional() }),
})
  .superRefine((p, ctx) => {
    const ids = new Set(p.agents.nodes.map((n) => n.id));
    for (const e of p.agents.edges) {
      if (!ids.has(e.from) || !ids.has(e.to)) ctx.addIssue({ code: 'custom', path: ['agents', 'edges'], message: `Unknown node in edge ${e.from} → ${e.to}` });
    }
    p.systems.items.forEach((s, i) => {
      const nids = new Set(s.container.nodes.map((n) => n.id));
      for (const e of s.container.edges) {
        if (!nids.has(e.from) || !nids.has(e.to)) ctx.addIssue({ code: 'custom', path: ['systems', 'items', i, 'container', 'edges'], message: `Unknown node in edge ${e.from} → ${e.to}` });
      }
    });
    const cats = new Set(Object.keys(p.toolbox.categories));
    p.toolbox.items.forEach((t, i) => {
      if (!cats.has(t.category)) ctx.addIssue({ code: 'custom', path: ['toolbox', 'items', i, 'category'], message: `Category "${t.category}" is not in toolbox.categories` });
    });
  });

export type Portfolio = z.infer<typeof portfolioSchema>;
