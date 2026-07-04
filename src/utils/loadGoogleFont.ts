// Google Font Loader for Satori OG Image Generation
// Loads Noto Sans (400, 700) and conditionally Noto Sans Thai for Thai text

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface FontData {
  name: string;
  data: ArrayBuffer;
  weight: number;
  style: 'normal' | 'italic';
}

const FONTS_DIR = join(process.cwd(), 'src', 'assets', 'fonts');
const CACHE_DIR = join(process.cwd(), '.font-cache');

// Check if text contains Thai characters
function hasThaiChars(text: string): boolean {
  return /[\u0E00-\u0E7F]/.test(text);
}

// Ensure cache directory exists
function ensureCacheDir(): void {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

// Convert WOFF2 to TTF using wawoff2
async function woff2ToTtf(woff2Buffer: ArrayBuffer): Promise<ArrayBuffer> {
  try {
    const wawoff2 = await import('wawoff2');
    const input = new Uint8Array(woff2Buffer);
    const output = await wawoff2.decompress(input);
    console.log(`WOFF2 conversion successful: ${input.length} -> ${output.length} bytes`);
    return output.buffer;
  } catch (e) {
    console.error('WOFF2 conversion failed:', e);
    throw new Error(`WOFF2 conversion failed: ${e}`);
  }
}

// Fetch font from Google Fonts API
async function fetchGoogleFont(
  family: string,
  weight: number,
  _text?: string
): Promise<ArrayBuffer> {
  const familyParam = `${family}:wght@${weight}`;
  
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(familyParam)}&display=swap`;

  console.log(`Fetching font CSS from: ${url}`);
  
  // Fetch CSS to get font URL
  const cssResponse = await fetch(url);

  if (!cssResponse.ok) {
    throw new Error(`Failed to fetch font CSS: ${cssResponse.status}`);
  }

  const css = await cssResponse.text();
  console.log(`CSS response length: ${css.length}`);

  // Extract font URL from @font-face CSS
  const fontUrlMatch = css.match(/url\((https:\/\/[^)]+)\)/);
  
  if (!fontUrlMatch) {
    console.error('CSS content:', css);
    throw new Error(`Could not extract font URL from CSS for ${family}`);
  }

  const fontUrl = fontUrlMatch[1];
  console.log(`Found font URL: ${fontUrl.substring(0, 100)}...`);

  const fontResponse = await fetch(fontUrl);
  if (!fontResponse.ok) {
    throw new Error(`Failed to fetch font file: ${fontResponse.status}`);
  }

  const buffer = await fontResponse.arrayBuffer();
  console.log(`Font downloaded: ${buffer.byteLength} bytes`);
  
  // Check if WOFF2 and convert to TTF
  const header = new Uint8Array(buffer.slice(0, 4));
  const headerStr = String.fromCharCode(header[0], header[1], header[2], header[3]);
  
  if (headerStr === 'wOF2') {
    console.log(`Font is WOFF2, converting to TTF...`);
    const ttfBuffer = await woff2ToTtf(buffer);
    console.log(`Converted to TTF: ${ttfBuffer.byteLength} bytes`);
    return ttfBuffer;
  }
  
  if (headerStr === 'wOFF') {
    console.log(`Font is WOFF (not WOFF2), trying to use as-is...`);
    // WOFF is not TTF, but we can try to use it
    return buffer;
  }
  
  // Already TTF
  return buffer;
}

// Try to load font from local file, fallback to Google Fonts API
async function loadFont(
  family: string,
  filename: string,
  weight: number,
  _text?: string
): Promise<FontData> {
  const localPath = join(FONTS_DIR, filename);
  const cachePath = join(CACHE_DIR, `${family.replace(/\s+/g, '-')}-${weight}.ttf`);

  // Try local first
  if (existsSync(localPath)) {
    const buffer = readFileSync(localPath);
    return {
      name: family,
      data: buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
      weight,
      style: 'normal',
    };
  }

  // Try cache
  if (existsSync(cachePath)) {
    console.log(`Loading cached font: ${family} ${weight}`);
    const buffer = readFileSync(cachePath);
    return {
      name: family,
      data: buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
      weight,
      style: 'normal',
    };
  }

  // Fallback to Google Fonts API (always fetch full font, not subset)
  console.log(`Fetching font from Google Fonts API: ${family} ${weight}`);
  const data = await fetchGoogleFont(family, weight);
  
  // Cache the result
  ensureCacheDir();
  writeFileSync(cachePath, Buffer.from(data));
  
  return {
    name: family,
    data,
    weight,
    style: 'normal',
  };
}

// Load all required fonts for OG image generation
export async function loadGoogleFont(
  text: string = ''
): Promise<FontData[]> {
  const fonts: FontData[] = [];

  // Load Noto Sans 400 and 700 (primary font for OG images)
  fonts.push(await loadFont('Noto Sans', 'NotoSans-Regular.ttf', 400, text));
  fonts.push(await loadFont('Noto Sans', 'NotoSans-Bold.ttf', 700, text));

  // Conditionally load Noto Sans Thai if Thai characters detected
  if (hasThaiChars(text)) {
    fonts.push(
      await loadFont('Noto Sans Thai', 'NotoSansThai-Regular.ttf', 400, text)
    );
    fonts.push(
      await loadFont('Noto Sans Thai', 'NotoSansThai-Bold.ttf', 700, text)
    );
  }

  return fonts;
}

export { hasThaiChars };
