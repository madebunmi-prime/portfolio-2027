import { describe, expect, it } from 'vitest';
import raw from '../content/portfolio.json';
import { portfolioSchema } from '@/content/schema';

const sections = (p: ReturnType<typeof portfolioSchema.parse>) =>
  [p.lifecycle, p.systems, p.agents, p.capabilities, p.work, p.experience, p.leadership, p.toolbox, p.testimonials, p.contact];

describe('content/portfolio.json', () => {
  it('matches the schema', () => {
    const result = portfolioSchema.safeParse(raw);
    if (!result.success) console.error(result.error.issues);
    expect(result.success).toBe(true);
  });

  it('marks exactly one highlighted word per section title', () => {
    for (const s of sections(portfolioSchema.parse(raw))) expect(s.title.match(/\[[^\]]+\]/g)?.length, s.title).toBe(1);
  });

  it('uses unique section ids', () => {
    const ids = sections(portfolioSchema.parse(raw)).map((s) => s.id).filter(Boolean);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('rejects an agent edge that points at a missing node', () => {
    const bad = structuredClone(raw);
    bad.agents.edges.push({ from: 'you', to: 'nobody', tool: false });
    expect(portfolioSchema.safeParse(bad).success).toBe(false);
  });
});
