// API Endpoint: Homepage OG Image
// Generates and returns a PNG OG image for the homepage

import type { APIRoute } from 'astro';
import { generateOgImageForSite } from '../../utils/generateOgImages.js';

export const GET: APIRoute = async ({ request }) => {
  // Get theme from query params if provided
  const url = new URL(request.url);
  const theme = url.searchParams.get('theme') || 'dark';

  const pngBuffer = await generateOgImageForSite(theme as any);

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
};
