// API Endpoint: Post/Article OG Image
// Generates and returns a PNG OG image for knowledge articles
// Route: /api/og/posts/[slug].png

import type { APIRoute, GetStaticPathsItem } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImageForPost } from '../../../../../utils/generateOgImages.js';

// Strip emojis and other special Unicode symbols that may render as blank in SVG
function stripEmojis(text: string): string {
  return text
    .replace(
      /[\u{1F600}-\u{1F64F}]/gu, // emoticons
      ''
    )
    .replace(
      /[\u{1F300}-\u{1F5FF}]/gu, // symbols & pictographs
      ''
    )
    .replace(
      /[\u{1F680}-\u{1F6FF}]/gu, // transport & map symbols
      ''
    )
    .replace(
      /[\u{1F1E0}-\u{1F1FF}]/gu, // flags
      ''
    )
    .replace(
      /[\u{2600}-\u{26FF}]/gu, // miscellaneous symbols
      ''
    )
    .replace(
      /[\u{2700}-\u{27BF}]/gu, // dingbats
      ''
    )
    .replace(
      /[\u{FE00}-\u{FE0F}]/gu, // variation selectors
      ''
    )
    .replace(
      /[\u{200D}]/gu, // zero-width joiner
      ''
    )
    .trim();
}

export const GET: APIRoute = async ({ params, request }) => {
  const slug = params.slug || '';
  const url = new URL(request.url);
  const theme = url.searchParams.get('theme') || 'dark';

  // Find the knowledge article first, then fall back to news
  const allArticles = await getCollection('knowledge');
  let article = allArticles.find((a) => {
    const cleanId = a.id.replace(/^(en|th)\//, '');
    return cleanId === slug;
  });

  // Fall back to news collection if not found in knowledge
  if (!article) {
    const allNews = await getCollection('news');
    const newsItem = allNews.find((a) => {
      const cleanId = a.id.replace(/^(en|th)\//, '');
      return cleanId === slug;
    });
    if (newsItem) {
      article = newsItem as any;
    }
  }

  if (!article) {
    return new Response('Not found', { status: 404 });
  }

  const pngBuffer = await generateOgImageForPost(
    {
      title: stripEmojis(article.data.title),
      author: article.data.author ? stripEmojis(article.data.author) : undefined,
      description: article.data.description ? stripEmojis(article.data.description) : undefined,
      tags: article.data.tags,
      locale: article.data.locale,
    },
    theme as any
  );

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
};

export async function getStaticPaths(): Promise<GetStaticPathsItem[]> {
  const allArticles = await getCollection('knowledge');
  const allNews = await getCollection('news');
  
  const allItems = [...allArticles, ...allNews];
  return allItems.map((article) => ({
    params: { slug: article.id.replace(/^(en|th)\//, '') },
  }));
}
