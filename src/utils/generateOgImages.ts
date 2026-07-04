// OG Image Generator with MD5 Hash Caching
// Core module that generates OG images for posts, site, and tags

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { createHash } from 'crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, basename } from 'path';

import { getOgPalette, type OgThemeName } from './og-theme.js';
import { generatePostSvg } from './og-templates/post-svg.js';
import { siteTemplate } from './og-templates/site.js';
import { tagTemplate } from './og-templates/tag.js';

const CACHE_DIR = join(process.cwd(), '.og-cache');
const SITE_URL = 'https://opencraft.bar';
const HOSTNAME = 'opencraft.bar';
const FONTS_DIR = join(process.cwd(), 'src', 'assets', 'fonts');

interface PostData {
  title: string;
  author?: string;
  description?: string;
  tags?: string[];
  locale?: string;
}

// Ensure cache directory exists
function ensureCacheDir(): void {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

// Generate MD5 hash for cache key
function md5(content: string): string {
  return createHash('md5').update(content).digest('hex');
}

// Get cached PNG or null
function getCachedPng(hash: string): Buffer | null {
  const cachePath = join(CACHE_DIR, `${hash}.png`);
  if (existsSync(cachePath)) {
    return readFileSync(cachePath);
  }
  return null;
}

// Save PNG to cache
function saveToCache(hash: string, pngBuffer: Buffer): void {
  ensureCacheDir();
  const cachePath = join(CACHE_DIR, `${hash}.png`);
  writeFileSync(cachePath, pngBuffer);
}

// Convert SVG string to PNG buffer using @resvg/resvg-js
function svgToPng(svg: string): Buffer {
  const fontFiles = [
    join(FONTS_DIR, 'NotoSans-Regular.ttf'),
    join(FONTS_DIR, 'NotoSans-Bold.ttf'),
  ].filter(f => existsSync(f));

  const resvgOptions: any = {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
    font: {
      fontFiles: fontFiles,
      defaultFontFamily: 'Noto Sans',
      loadSystemFonts: false,
    },
  };

  console.log(`Resvg using ${fontFiles.length} font files:`, fontFiles.map(f => basename(f)));
  const resvg = new Resvg(svg, resvgOptions);
  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}

// Render Satori JSX template to SVG, then to PNG
async function renderTemplate(
  template: ReturnType<typeof siteTemplate>,
  _text: string = ''
): Promise<Buffer> {
  const fontFiles = [
    join(FONTS_DIR, 'NotoSans-Regular.ttf'),
    join(FONTS_DIR, 'NotoSans-Bold.ttf'),
  ].filter(f => existsSync(f));

  const svg = await satori(template, {
    width: 1200,
    height: 630,
    fonts: fontFiles.map((f) => ({
      name: 'Noto Sans',
      data: readFileSync(f),
      weight: f.includes('Bold') ? 700 : 400,
      style: 'normal' as const,
    })),
  });

  return svgToPng(svg);
}

/**
 * Generate OG image for a knowledge/news post
 * Uses raw SVG template for better text handling
 */
export async function generateOgImageForPost(
  post: PostData,
  theme: OgThemeName = 'dark'
): Promise<Buffer> {
  const palette = getOgPalette(theme);
  const cacheKey = md5(`post:${theme}:${post.title}:${post.author || ''}`);
  
  // Check cache
  const cached = getCachedPng(cacheKey);
  if (cached) return cached;

  // Generate SVG directly (no Satori needed for post template)
  const svg = generatePostSvg({
    title: post.title,
    author: post.author,
    hostname: HOSTNAME,
    palette,
  });

  const pngBuffer = svgToPng(svg);
  saveToCache(cacheKey, pngBuffer);
  return pngBuffer;
}

/**
 * Generate OG image for the homepage
 */
export async function generateOgImageForSite(
  theme: OgThemeName = 'dark'
): Promise<Buffer> {
  const palette = getOgPalette(theme);
  const cacheKey = md5(`site:${theme}`);

  const cached = getCachedPng(cacheKey);
  if (cached) return cached;

  const template = siteTemplate({
    hostname: HOSTNAME,
    palette,
  });

  const pngBuffer = await renderTemplate(template, 'OpenCraft Where Craft Meets Open Culture');
  saveToCache(cacheKey, pngBuffer);
  return pngBuffer;
}

/**
 * Generate OG image for a tag page
 */
export async function generateOgImageForTag(
  tagName: string,
  theme: OgThemeName = 'dark'
): Promise<Buffer> {
  const palette = getOgPalette(theme);
  const cacheKey = md5(`tag:${theme}:${tagName}`);

  const cached = getCachedPng(cacheKey);
  if (cached) return cached;

  const template = tagTemplate({
    tagName,
    hostname: HOSTNAME,
    palette,
  });

  const pngBuffer = await renderTemplate(template, `Knowledge articles tagged with ${tagName}`);
  saveToCache(cacheKey, pngBuffer);
  return pngBuffer;
}
