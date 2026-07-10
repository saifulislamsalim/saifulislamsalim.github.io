import { z } from 'zod';

export const pubKind = z.enum(['conference', 'journal', 'poster']);
export const pubStatus = z.enum(['published', 'under-review']);

export const publicationsSchema = z.object({
  title: z.string(),
  authors: z.array(z.string()).min(1),
  venue: z.string(),
  year: z.coerce.number().int().min(1900).max(2100),
  type: pubKind.default('conference'),
  url: z.string().url().optional(),
  pdf: z.string().optional(),
  tags: z.array(z.string()).default([]),
  award: z.string().optional(),
  status: pubStatus.default('published'),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().nonnegative().default(999),
});

export const eventKind = z.enum(['award', 'talk', 'education', 'service', 'news']);

export const eventsSchema = z.object({
  date: z.coerce.date(),
  end: z.coerce.date().optional(),
  kind: eventKind,
  title: z.string(),
  detail: z.string().optional(),
  href: z.string().url().optional(),
  pinned: z.boolean().default(false),
});

export type Publication = z.infer<typeof publicationsSchema>;
export type Event = z.infer<typeof eventsSchema>;
export type PubKind = z.infer<typeof pubKind>;
export type EventKind = z.infer<typeof eventKind>;

// Visitor stats written by scripts/fetch-visitor-stats.mjs (keep the script's
// inline copy of this shape in sync). Countries key: ISO 3166-1 alpha-2, uppercase.
export const visitorsSchema = z.object({
  updated: z.string(),                       // 'YYYY-MM-DD', or '' before the first pipeline run
  total: z.number().int().nonnegative(),
  countries: z.record(z.string().regex(/^[A-Z]{2}$/), z.number().int().positive()),
});
export type VisitorsData = z.infer<typeof visitorsSchema>;
