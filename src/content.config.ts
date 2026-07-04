import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    locale: z.enum(['en', 'th']),
    featured: z.boolean().optional().default(false),
    image: z.string().optional(),
  }),
});

const knowledge = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/knowledge' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    description: z.string(),
    locale: z.enum(['en', 'th']),
    tags: z.array(z.string()).optional().default([]),
    image: z.string().optional(),
  }),
});

export const collections = { news, knowledge };
