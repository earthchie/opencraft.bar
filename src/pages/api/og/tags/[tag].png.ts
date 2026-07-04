// API Endpoint: Tag OG Image
// Generates and returns a PNG OG image for tag pages
// Route: /api/og/tags/[tag].png

import type { APIRoute, GetStaticPathsItem } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImageForTag } from '../../../../utils/generateOgImages.js';

export const GET: APIRoute = async ({ params, request }) => {
  const tag = params.tag || '';
  const url = new URL(request.url);
  const theme = url.searchParams.get('theme') || 'dark';

  const pngBuffer = await generateOgImageForTag(tag, theme as any);

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
};

export async function getStaticPaths(): Promise<GetStaticPathsItem[]> {
  const allArticles = await getCollection('knowledge');
  const enArticles = allArticles.filter((e) => e.data.locale === 'en');
  const allTags = [...new Set(enArticles.flatMap((e) => e.data.tags || []))];

  return allTags.map((tag) => ({
    params: { tag },
  }));
}
