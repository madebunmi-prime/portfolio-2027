import { describe, expect, it } from 'vitest';
import raw from '../content/portfolio.json';
import { portfolioSchema } from '@/content/schema';

describe('content/portfolio.json', () => {
  it('matches the schema', () => {
    const result = portfolioSchema.safeParse(raw);
    if (!result.success) console.error(result.error.issues);
    expect(result.success).toBe(true);
  });

  it('marks exactly one highlighted word per section title', () => {
    const parsed = portfolioSchema.parse(raw);
    const titles = [parsed.stack, parsed.experience, parsed.projects, parsed.approach, parsed.testimonials, parsed.contact].map((s) => s.title);
    for (const t of titles) expect(t.match(/\[[^\]]+\]/g)?.length).toBe(1);
  });
});
