import { z } from 'zod';

export const accentSchema = z.enum(['violet', 'cyan', 'pink', 'amber', 'green', 'blue']);
export const iconSchema = z.enum([
  'idea', 'concept', 'design', 'code', 'shield', 'cloud', 'lock', 'chip', 'clock',
  'github', 'linkedin', 'x', 'mail', 'globe',
]);
export const modelSchema = z.enum(['cube', 'hex', 'interlock', 'orbitals', 'branch', 'orb']);

export type Accent = z.infer<typeof accentSchema>;
export type IconName = z.infer<typeof iconSchema>;
export type ModelName = z.infer<typeof modelSchema>;

const text = z.string().min(1);
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use the YYYY-MM format, e.g. "2024-09"');
const media = z.string().nullable().default(null);
const link = z.object({ label: text, href: text });
const field = z.object({ label: text, placeholder: z.string() });
const section = z.object({ id: z.string().optional(), eyebrow: text, title: text, intro: z.string().optional() });

export const portfolioSchema = z.object({
  site: z.object({
    title: text,
    description: text,
    url: z.string().url(),
    locale: z.string().default('en'),
    ogImage: media,
  }),
  person: z.object({ name: text, shortName: text, role: text }),
  nav: z.object({ links: z.array(link), cta: link }),
  hero: z.object({
    eyebrow: z.string(),
    title: text,
    tagline: text,
    primaryCta: link,
    secondaryCta: link.optional(),
    chapters: z.array(text).min(1),
    poster: media,
  }),
  process: z.object({
    label: text,
    steps: z.array(z.object({ label: text, icon: iconSchema, accent: accentSchema })).min(1),
  }),
  stack: section.extend({
    roles: z.array(z.object({ title: text, tags: z.array(z.string()), model: modelSchema, accent: accentSchema })),
  }),
  experience: section.extend({
    labels: z.object({
      ribbon: text, ribbonHint: text, present: text, ongoing: text,
      solo: text, parallelOne: text, parallelMany: text,
    }),
    items: z.array(
      z.object({
        title: text,
        company: text,
        logo: media,
        start: yearMonth,
        end: yearMonth.nullable(),
        accent: accentSchema,
        bullets: z.array(text),
      }),
    ),
  }),
  projects: section.extend({
    labels: z.object({ source: text, demo: text }),
    items: z.array(
      z.object({
        title: text,
        tagline: text,
        description: text,
        cover: media,
        repo: z.string().url().nullable(),
        demo: z.string().url().nullable(),
        accent: accentSchema,
        tags: z.array(z.object({ label: text, accent: accentSchema })),
      }),
    ),
  }),
  approach: section.extend({
    items: z.array(z.object({ title: text, description: text, icon: iconSchema, accent: accentSchema })),
    stats: z.array(z.object({ value: z.number(), suffix: z.string().default(''), label: text })),
  }),
  testimonials: section.extend({
    labels: z.object({ previous: text, next: text }),
    items: z.array(
      z.object({ quote: text, name: text, role: z.string(), company: z.string(), avatar: media, accent: accentSchema }),
    ),
  }),
  contact: section.extend({
    body: text,
    formEndpoint: z.union([z.string().url(), z.literal('')]),
    email: z.string().email(),
    fields: z.object({ name: field, email: field, message: field }),
    labels: z.object({ submit: text, sending: text, success: text, error: text }),
  }),
  socials: z.array(z.object({ label: text, handle: z.string(), href: z.string().url(), icon: iconSchema })),
  footer: z.object({ copyright: text, note: z.string() }),
});

export type Portfolio = z.infer<typeof portfolioSchema>;
