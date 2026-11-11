import raw from '@content/portfolio.json';
import { portfolioSchema, type Portfolio } from './schema';

function load(): Portfolio {
  const result = portfolioSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  • ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`content/portfolio.json is invalid:\n${issues}`);
  }
  return result.data;
}

export const content = load();
export type { Portfolio } from './schema';
