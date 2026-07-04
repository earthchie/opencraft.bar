# OG Image Generation — Knowledge Base

> This document is a comprehensive reference for the Open Graph (OG) image generation system in this Astro project. It covers the architecture, theme-aware rendering, caching, font handling, templates, endpoint structure, meta tag injection, and cover image display.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Dependencies & Stack](#2-dependencies--stack)
3. [Configuration](#3-configuration)
4. [Theme System (og-theme.ts)](#4-theme-system-og-themets)
5. [Font Loading (loadGoogleFont.ts)](#5-font-loading-loadgooglefontts)
6. [OG Image Generation Core (generateOgImages.ts)](#6-og-image-generation-core-generateogimagests)
7. [OG Image Templates](#7-og-image-templates)
8. [API Endpoints (Route Handlers)](#8-api-endpoints-route-handlers)
9. [Caching Mechanism](#9-caching-mechanism)
10. [Meta Tag Injection (Layout.astro)](#10-meta-tag-injection-layoutastro)
11. [Theme-Aware Client-Side Swapping](#11-theme-aware-client-side-swapping)
12. [OG Image Resolution in PostDetails.astro](#12-og-image-resolution-in-postdetailsastro)
13. [Cover Image Display in Card.astro](#13-cover-image-display-in-cardastro)
14. [OG Image Priority / Fallback Chain](#14-og-image-priority--fallback-chain)
15. [Content Schema (ogImage field)](#15-content-schema-ogimage-field)
16. [Adding a New Theme](#16-adding-a-new-theme)
17. [Adding a New OG Template](#17-adding-a-new-og-template)
18. [Troubleshooting](#18-troubleshooting)

---

## 1. Architecture Overview

The system generates PNG images dynamically at build time (SSG) from SVG, using a pipeline of:

```
Template (SVG string or Satori JSX) 
  → Theme Palette (color substitution) 
  → Font Embedding (Thai + custom fonts) 
  → Resvg (SVG → PNG) 
  → MD5 Hash Cache (.og-cache/) 
  → PNG served via Astro API Route
```

Three types of OG images are generated:

| Type | Purpose | Template | Endpoint |
|------|---------|----------|----------|
| **Post** | Blog article cover + social share | `post-svg.js` (raw SVG) | `/posts/{slug}.png` |
| **Site** | Homepage social share | `site.js` (Satori JSX) | `/og.png` |
| **Tag** | Tag listing page social share | `tag.js` (Satori JSX) | `/tags/{tag}/og.png` |

Additionally, theme-aware post OG images are pre-rendered at:
- `/og-images/{defaultTheme}/{slug}.png` (e.g., dark theme)
- `/og-images/{lightTheme}/{slug}.png` (e.g., light theme)

### Rendering Engines

Two rendering engines are used:

- **Satori** (`satori` package): Converts JSX/Hypertext-like objects to SVG. Used for `site.js`, `tag.js`, and `post.js`. Requires font loading via `loadGoogleFonts()`.
- **Raw SVG string**: The `post-svg.js` template returns a hand-crafted SVG string. Rendered by Resvg directly. Better for complex Thai text shaping (combining marks, zero-width characters).

Both paths use **Resvg** (`@resvg/resvg-js`) for the final SVG → PNG conversion with embedded font rendering.

---

## 2. Dependencies & Stack

| Package | Version | Purpose |
|---------|---------|---------|
| `satori` | `^0.26.0` | JSX → SVG conversion (used by site/tag templates) |
| `@resvg/resvg-js` | `^2.6.2` | SVG → PNG conversion with font rendering |
| `sharp` | `^0.34.5` | Astro's image processing (not directly used by OG system) |

**Font files** (in `src/assets/fonts/`):
- `{primary-font}.ttf` — Primary text font (e.g., for headings/titles in OG images)
- `{secondary-font}.ttf` — Secondary/fallback font (e.g., serif variant, conditionally loaded)
- `{display-font}.ttf` — Custom display font for hero/logo text (optional)

---

## 3. Configuration

In `src/config.ts`:

```typescript
export const SITE = {
  ogImage: "",           // Empty string = use dynamic /og.png endpoint
  dynamicOgImage: true,  // Enable dynamic OG generation (false = disable entirely)
  showCoverImages: true, // Show OG images as cover images in post cards
  // ...
};
```

**Key behaviors:**
- `ogImage: ""` → Layout defaults to `/og.png` (dynamic endpoint)
- `ogImage: "custom.png"` → Layout uses `/custom.png` (static file in `public/`)
- `dynamicOgImage: false` → All dynamic OG endpoints return 404; no pre-rendering happens
- `showCoverImages: false` → Card component never shows cover images

---

## 4. Theme System (og-theme.ts)

**File:** `src/utils/og-theme.ts`

### OgPalette Interface

```typescript
interface OgPalette {
  bg: string;           // Background color
  accent: string;       // Primary gradient color (accents, separators, hashtags)
  accentLight: string;  // Lighter accent variant for gradient mid-stops
  text: string;         // Main text color
  textMuted: string;    // Secondary/muted text color
  pillBg: string;       // Badge/pill background (RGBA)
  pillBorder: string;   // Badge/pill border (RGBA)
}
```

### Theme Palette Design Guidelines

Each theme provides a full palette of 7 colors. When designing themes:

- **Light themes**: Use white/light backgrounds with darker accent and text colors. Pill backgrounds/borders should be low-opacity versions of the accent.
- **Dark themes**: Use near-black backgrounds with vibrant accent colors. Text should be light, muted text should be medium-gray. Pill backgrounds use white with low opacity.
- Ensure sufficient contrast between `text` and `bg` for readability.
- `accent` and `accentLight` should form a visually pleasing gradient pair.
- `pillBg` and `pillBorder` are always RGBA with low opacity for subtle badge styling.

### API

```typescript
// Get palette for a theme (falls back to default if invalid/missing)
getOgPalette(theme?: string | null): OgPalette

// Array of valid theme name strings
VALID_OG_THEMES: string[]
```

Define a `DEFAULT_THEME` constant for the fallback theme name used when no theme is specified.

---

## 5. Font Loading (loadGoogleFont.ts)

**File:** `src/utils/loadGoogleFont.ts`

Loads font files from `src/assets/fonts/` and returns them in the format expected by Satori.

### Fonts Loaded

| Font | File | Weights | Condition |
|------|------|---------|-----------|
| Primary text font | `{primary-font}.ttf` | 400, 700 | Always loaded |
| Secondary text font | `{secondary-font}.ttf` | 400, 700 | Conditionally loaded (see below) |
| Display/hero font | `{display-font}.ttf` | 400 | Always loaded (optional) |

Font files are stored in `src/assets/fonts/`. The secondary font is typically a serif or fallback variant loaded only when specific character sets (e.g., Thai, CJK) are detected in the text.

### Script/Language Detection

The font loader accepts a `text` parameter containing all strings that will be rendered. It uses regex to detect specific character ranges (e.g., Thai `U+0E00–U+0E7F`, CJK ranges, etc.) and conditionally loads the secondary font only when needed. This avoids embedding unnecessary font data.

```typescript
// Example: detect a specific script range
const hasTargetScript = /[\u0E00-\u0E7F]/.test(text);
if (hasTargetScript) {
  fonts.push(/* secondary font entries */);
}
```

### Usage Pattern

```typescript
const fonts = await loadGoogleFonts(post.data.title + post.data.author + SITE.title);
// Pass to Satori options:
satori(jsx, { width: 1200, height: 630, embedFont: true, fonts });
```

---

## 6. OG Image Generation Core (generateOgImages.ts)

**File:** `src/utils/generateOgImages.ts`

### Three Generator Functions

```typescript
generateOgImageForPost(post: CollectionEntry<"blog">, theme?: string): Promise<Buffer>
generateOgImageForSite(theme?: string): Promise<Buffer>
generateOgImageForTag(tagName: string, theme?: string): Promise<Buffer>
```

### Pipeline (shared by all three)

1. **Generate SVG** — Call the appropriate template function with theme palette
2. **Build cache key** — Format: `{theme}_{id}` or just `{id}` (no theme)
3. **Check cache** — Look for matching `.og-cache/{safe_key}.png` + `.og-cache/{safe_key}.hash`
4. **Cache hit?** — Return cached PNG buffer immediately
5. **Cache miss** — Convert SVG → PNG via Resvg, write to cache, return buffer

### Cache Key Sanitization

```typescript
const safe = key.replace(/[^a-zA-Z0-9_-]/g, "_");
```

Special characters in theme names, post IDs, or tag names are replaced with underscores.

---

## 7. OG Image Templates

All templates produce a **1200×630** SVG (OG standard dimensions).

### 7a. Post Template (`post-svg.js`) — Raw SVG

**Used by:** `generateOgImageForPost()`
**Rendering:** Resvg directly (no Satori)

**Layout:**
```
┌──────────────────────────────────────┐
│  ┌──────────────┐                    │  ← Pill badge: hostname
│  │ hostname.com │                    │
│  └──────────────┘                    │
│                                      │
│  Title Line 1                        │
│  Title Line 2                        │  ← Up to 3 lines, gradient text
│  Title Line 3...                     │
│                                      │
│                                      │
│  ━━━━ Author Name                    │  ← Separator + author
└──────────────────────────────────────┘
```

**Non-Latin script text handling (e.g., Thai):**
- Combining marks (zero-width characters in scripts like Thai) are excluded from visual length measurement
- Certain characters that cause overlap with adjacent glyphs may need additional spacing
- Title is word-wrapped at spaces, with configurable max chars per line and max lines
- Excess text is truncated with `…`

**Visual effects:**
- Two radial gradients (top-left and bottom-right) using accent color
- Linear gradient on title text (accentLight → accent → text color)
- Rounded pill badge for hostname

### 7b. Post Template (`post.js`) — Satori JSX

**Alternative Satori-based post template** (currently not the primary path for `generateOgImageForPost`, which uses `post-svg.js`).

**Layout:**
```
┌──────────────────────────────────────┐
│  ┌──────────────┐                    │  ← Pill: hostname
│  │ hostname.com │                    │
│                                      │
│                                      │
│  Post Title (gradient text, 84px)    │  ← Satori handles line clamp
│                                      │
│                                      │
│  ━━━━ Written by Author Name        │  ← Footer
└──────────────────────────────────────┘
```

Uses CSS `lineClamp: 3` via Satori's `-webkit-box` support.

### 7c. Site Template (`site.js`) — Satori JSX

**Used by:** `generateOgImageForSite()`

**Layout:**
```
┌──────────────────────────────────────┐
│                                      │
│         Site Title Text              │  ← Hero text (display font, large size)
│                                      │
│            ━━━━━━━                   │  ← Separator
│                                      │
│   Site description text from         │  ← Site description
│   SITE.desc configuration            │
│                                      │
│                                      │
│         ┌──────────────┐             │
│         │  hostname    │             │  ← Pill: hostname
│         └──────────────┘             │
└──────────────────────────────────────┘
```

**Key details:**
- Hero text uses a custom display/hero font (if available)
- Gradient text effect via `backgroundImage` + `backgroundClip: "text"`
- Centered layout with `justifyContent: "center"`
- Site description from `SITE.desc`

### 7d. Tag Template (`tag.js`) — Satori JSX

**Used by:** `generateOgImageForTag()`

**Layout:**
```
┌──────────────────────────────────────┐
│                                      │
│          # TagName                   │  ← "#" faded + tag name gradient
│                                      │
│            ━━━━━━━                   │  ← Separator
│                                      │
│  All articles tagged on {SITE.title} │  ← Subtitle
│                                      │
│                                      │
│         ┌──────────────┐             │
│         │   hostname   │             │  ← Pill: hostname
│         └──────────────┘             │
└──────────────────────────────────────┘
```

**Key details:**
- `#` character is rendered at large size (80px), reduced opacity
- Tag name uses the primary text font at large size (96px), gradient text effect
- Subtitle is static: `"All articles tagged on {SITE.title}"`

---

## 8. API Endpoints (Route Handlers)

### Homepage OG

| Property | Value |
|----------|-------|
| **File** | `src/pages/og.png.ts` |
| **Route** | `GET /og.png` |
| **Generator** | `generateOgImageForSite()` |
| **Cache-Control** | `public, max-age=86400` (1 day) |
| **Conditions** | Always generated (no filter) |

### Post OG (default theme)

| Property | Value |
|----------|-------|
| **File** | `src/pages/posts/[...slug]/index.png.ts` |
| **Route** | `GET /posts/{slug}.png` |
| **Generator** | `generateOgImageForPost(post)` |
| **Cache-Control** | `public, max-age=31536000, immutable` (1 year) |
| **Conditions** | `dynamicOgImage: true` AND post has no custom `ogImage` AND not draft |

### Post OG (theme-aware, pre-rendered)

| Property | Value |
|----------|-------|
| **File** | `src/pages/og-images/[theme]/[slug].png.ts` |
| **Routes** | `GET /og-images/{defaultTheme}/{slug}.png`, `GET /og-images/{lightTheme}/{slug}.png` |
| **Generator** | `generateOgImageForPost(post, theme)` |
| **Cache-Control** | `public, max-age=31536000, immutable` (1 year) |
| **Conditions** | Same as above; pre-rendered for a subset of themes (typically one dark + one light) |

> **Note:** Only a limited number of themes are pre-rendered to avoid excessive build output. The client-side script swaps URLs to match the user's active theme from this pre-rendered set.

### Tag OG

| Property | Value |
|----------|-------|
| **File** | `src/pages/tags/[tag]/og.png.ts` |
| **Route** | `GET /tags/{tag}/og.png` |
| **Generator** | `generateOgImageForTag(tagName)` |
| **Cache-Control** | `public, max-age=31536000, immutable` (1 year) |
| **Conditions** | All non-draft tags from blog + gallery posts |

---

## 9. Caching Mechanism

### Cache Location

```
.og-cache/
├── {safe_key}.png     ← Rendered PNG image
└── {safe_key}.hash    ← MD5 hex digest of the SVG content
```

The `.og-cache/` directory is at the project root.

### How It Works

1. **SVG is generated** from template + theme palette + content
2. **MD5 hash** is computed from the SVG string
3. **Cache lookup**: Check if `.hash` file exists and matches current hash
4. **Cache hit**: Return existing `.png` file (skip rendering)
5. **Cache miss**: Render SVG → PNG via Resvg, write both `.png` and `.hash`

### Cache Invalidation

- **Automatic**: If any input changes (title, author, theme, description, etc.), the SVG output changes → MD5 hash changes → cache misses → re-renders
- **Manual**: Delete the `.og-cache/` directory to force full re-render
- **No TTL**: Cache entries don't expire; they're content-addressed via hash

### Cache Key Examples

| Image | Cache Key | Files |
|-------|-----------|-------|
| Post "my-post" (no theme) | `my-post` | `.og-cache/my-post.png` + `.og-cache/my-post.hash` |
| Post "my-post" (with theme) | `{theme}_my-post` | `.og-cache/{theme}_my-post.png` + `.og-cache/{theme}_my-post.hash` |
| Homepage (no theme) | `_site` | `.og-cache/_site.png` + `.og-cache/_site.hash` |
| Tag "javascript" | `tag_javascript` | `.og-cache/tag_javascript.png` + `.og-cache/tag_javascript.hash` |

### HTTP Cache Headers

| Endpoint | Cache-Control | Rationale |
|----------|---------------|-----------|
| `/og.png` | `max-age=86400` (1 day) | Homepage may change more often |
| `/posts/{slug}.png` | `max-age=31536000, immutable` | Post content is immutable after publish |
| `/og-images/{theme}/{slug}.png` | `max-age=31536000, immutable` | Same as above |
| `/tags/{tag}/og.png` | `max-age=31536000, immutable` | Tags don't change |

---

## 10. Meta Tag Injection (Layout.astro)

**File:** `src/layouts/Layout.astro`

### Default OG Image Resolution

```typescript
const ogImage = ogImage ?? (SITE.ogImage ? `/${SITE.ogImage}` : "/og.png");
const socialImageURL = new URL(ogImage, Astro.url);
```

Priority:
1. Explicit `ogImage` prop passed to Layout
2. `SITE.ogImage` config (if non-empty)
3. Fallback to `/og.png`

### Meta Tags Set

```html
<!-- OpenGraph -->
<meta property="og:site_name" content={SITE.title} />
<meta property="og:type" content={isArticle ? "article" : "website"} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:image" content={socialImageURL} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={socialImageURL} />

<!-- Article-specific (only for blog posts) -->
<meta property="article:published_time" content={pubDatetime} />
<meta property="article:modified_time" content={modDatetime} />
```

### Structured Data (JSON-LD)

For blog posts, a `BlogPosting` schema is injected:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "...",
  "description": "...",
  "image": "og image URL",
  "url": "canonical URL",
  "datePublished": "...",
  "dateModified": "...",
  "author": [{ "@type": "Person", "name": "..." }]
}
```

---

## 11. Theme-Aware Client-Side Swapping

**File:** `src/layouts/Layout.astro` (inline `<script>`)

### Mechanism

An inline script runs on page load to swap the OG image URL to match the user's current theme preference:

```javascript
const swapThemeInPath = (src) => 
  src.replace(/\/og-images\/(themeA|themeB)\//g, `/og-images/${themeValue}/`);

const ogMeta = document.querySelector('meta[property="og:image"]');
const twMeta = document.querySelector('meta[property="twitter:image"]');

if (ogMeta) ogMeta.setAttribute("content", swapThemeInPath(ogMeta.getAttribute("content")));
if (twMeta) twMeta.setAttribute("content", swapThemeInPath(twMeta.getAttribute("content")));
```

> **Note:** The regex `(themeA|themeB)` must list all pre-rendered theme names. Update this when adding new pre-rendered themes.

### How It Works

1. Server renders HTML with default theme OG URL: `/og-images/{defaultTheme}/{slug}.png`
2. On client load, the script reads the current theme from `getPreferTheme()`
3. If the current theme matches a pre-rendered variant, the URL is swapped accordingly
4. Both `og:image` and `twitter:image` meta tags are updated

### Limitations

- Only themes in the pre-rendered set (defined in `getStaticPaths`) have matching PNG files
- If a user's theme is not in the pre-rendered set, the URL swap won't match an existing file
- Social media crawlers execute JS **after** the server-rendered HTML, so they get the default theme URL
- This client-side swap is mainly for browser preview consistency, not for social media crawlers

---

## 12. OG Image Resolution in PostDetails.astro

**File:** `src/layouts/PostDetails.astro`

### Resolution Order

```typescript
let ogImageUrl: string | undefined;

// 1. Remote URL string
if (typeof initOgImage === "string") {
  ogImageUrl = initOgImage;
} 
// 2. Local Astro image asset
else if (initOgImage?.src) {
  ogImageUrl = initOgImage.src;
}

// 3. Dynamic OG if enabled and no custom image
if (!ogImageUrl && SITE.dynamicOgImage) {
  ogImageUrl = `/og-images/${DEFAULT_THEME}/${getPath(post.id, post.filePath, false).replace(/^\//, "")}.png`;
}

// 4. Resolve to absolute URL (or undefined → falls back to SITE default in Layout)
const ogImage = ogImageUrl
  ? new URL(ogImageUrl, Astro.url.origin).href
  : undefined;
```

**Note:** The `PostDetails` layout defaults to the default theme URL. The client-side script in `Layout.astro` then swaps it if the user's active theme is a pre-rendered variant.

---

## 13. Cover Image Display in Card.astro

**File:** `src/components/Card.astro`

### Cover Image Resolution

```typescript
let coverSrc: string | undefined;

// Galleries: use gallery's own cover image
if (coverImage) {
  coverSrc = coverImage.src;
}

// Blog posts:
if ("ogImage" in data && data.ogImage) {
  // Custom ogImage from frontmatter (string or Astro asset)
  coverSrc = typeof data.ogImage === "string" 
    ? data.ogImage 
    : (data.ogImage as { src: string }).src;
} else if (SITE.dynamicOgImage) {
  // Dynamic OG image as cover (use default theme)
  coverSrc = `/og-images/${DEFAULT_THEME}/${slug}.png`;
}
```

### Cover Image HTML

```html
<img
  src={coverSrc}
  alt={`Cover for ${title}`}
  loading="lazy"
  decoding="async"
  data-og-cover={/* "true" if dynamic OG && no custom ogImage */}
  onerror="this.style.display='none'"
/>
```

**Key attributes:**
- `loading="lazy"` — Defer loading until near viewport
- `data-og-cover` — Marker for CSS/JS to identify dynamic OG covers
- `onerror` — Hides the image if it fails to load (graceful degradation)

---

## 14. OG Image Priority / Fallback Chain

```
Post has custom ogImage in frontmatter?
├── YES → string? Use as-is (remote URL)
│         Astro asset? Use .src
├── NO  → SITE.dynamicOgImage enabled?
│         ├── YES → Use /og-images/{defaultTheme}/{slug}.png (PostDetails)
│         │         → Client swaps to /og-images/{currentTheme}/{slug}.png
│         └── NO  → undefined → Layout uses SITE.ogImage or "/og.png"
│
Site-level fallback:
Layout receives no ogImage?
├── SITE.ogImage is non-empty? → Use /{SITE.ogImage}
└── Otherwise → Use /og.png (dynamic homepage OG)
```

---

## 15. Content Schema (ogImage field)

**File:** `src/content.config.ts`

```typescript
ogImage: image().or(z.string()).optional()
```

**Accepted values in post frontmatter:**

| Value | Type | Example |
|-------|------|---------|
| Omitted | `undefined` | (no field) → dynamic OG |
| Remote URL | `string` | `ogImage: "https://example.com/cover.png"` |
| Local asset | `image()` (Astro import) | `ogImage: "@/assets/images/cover.png"` |

**Example frontmatter:**
```yaml
---
title: "My Post"
ogImage: "https://example.com/custom-cover.png"  # Custom OG image
---
```

---

## 16. Adding a New Theme

1. Open `src/utils/og-theme.ts`

2. Add a new entry to the `palettes` record:

```typescript
"my-theme": {
  bg: "#...",        // Background
  accent: "#...",    // Primary accent
  accentLight: "#...", // Lighter accent
  text: "#...",      // Main text
  textMuted: "#...", // Secondary text
  pillBg: "rgba(...,0.1)",   // Pill background
  pillBorder: "rgba(...,0.2)", // Pill border
},
```

3. If you want the theme pre-rendered for client-side swapping, add it to the `themes` array in `src/pages/og-images/[theme]/[slug].png.ts`:

```typescript
const themes = ["themeA", "themeB", "my-theme"];
```

4. Update the regex in `Layout.astro`'s `swapThemeInPath` to include the new theme:

```javascript
const swapThemeInPath = (src) => 
  src.replace(/\/og-images\/(themeA|themeB|my-theme)\//g, `/og-images/${themeValue}/`);
```

5. If the theme should be the default, change `DEFAULT_THEME` in `og-theme.ts`.

---

## 17. Adding a New OG Template

### Step-by-step

1. Create a new template file in `src/utils/og-templates/`:

```javascript
import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";
import { getOgPalette } from "@/utils/og-theme";

export default async (param, theme) => {
  const p = getOgPalette(theme);
  return satori(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          // ... layout styles using p.bg, p.accent, p.text, etc.
        },
        children: [ /* ... */ ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: await loadGoogleFonts(/* all visible text */),
    }
  );
};
```

2. Add a generator function in `src/utils/generateOgImages.ts`:

```typescript
import myTemplate from "./og-templates/my-template";

export async function generateOgImageForMyType(param: string, theme?: string) {
  const svg = await myTemplate(param, theme);
  const key = theme ? `${theme}_mytype_${param}` : `mytype_${param}`;
  ensureCacheDir();
  const cached = getCached(key, svg);
  if (cached) return cached;
  const png = svgBufferToPngBuffer(svg);
  setCache(key, svg, Buffer.from(png));
  return png;
}
```

3. Create an API route in `src/pages/`:

```typescript
import type { APIRoute } from "astro";
import { generateOgImageForMyType } from "@/utils/generateOgImages";

export const GET: APIRoute = async ({ params }) => {
  const buffer = await generateOgImageForMyType(params.param as string);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
```

### Raw SVG Template (alternative)

For complex text rendering (e.g., Thai combining marks), use a raw SVG string template instead of Satori. Return an SVG string and use `svgBufferToPngBuffer()` directly. See `post-svg.js` for the pattern.

---

## 18. Troubleshooting

### OG image not updating after content change

- The MD5 cache may still hold the old version
- **Fix:** Delete `.og-cache/` directory and rebuild

### Text rendering incorrectly (non-Latin scripts)

- Ensure the font files exist in `src/assets/fonts/`
- The raw SVG template (e.g., `post-svg.js`) handles complex text shaping — prefer it over Satori for scripts with combining marks
- Check that `loadGoogleFonts()` is called with all visible text for script detection

### OG image shows wrong theme on social media

- Social crawlers don't execute client-side JavaScript
- They get the server-rendered HTML, which defaults to the default theme URL
- This is by design — social previews always use the default theme

### 404 on OG image endpoints

- Check `SITE.dynamicOgImage` is `true` in `src/config.ts`
- Ensure the post is not a draft and has no custom `ogImage` in frontmatter
- Verify the post slug is correct

### Cover images not showing in post cards

- Check `SITE.showCoverImages` is `true` in `src/config.ts`
- Ensure `SITE.dynamicOgImage` is `true` (needed for dynamic cover fallback)
- Run `pnpm build` to generate the OG images (they're generated at build time)

### Cache directory issues

- The `.og-cache/` directory is created automatically
- Ensure the build process has write permissions to the project root
- Add `.og-cache/` to `.gitignore` (it's a build artifact)

---

## File Reference

| File | Purpose |
|------|---------|
| `src/utils/generateOgImages.ts` | Core generation + caching logic |
| `src/utils/og-theme.ts` | Theme palette definitions |
| `src/utils/loadGoogleFont.ts` | Font loading for Satori |
| `src/utils/og-templates/post-svg.js` | Post OG template (raw SVG) |
| `src/utils/og-templates/post.js` | Post OG template (Satori JSX) |
| `src/utils/og-templates/site.js` | Homepage OG template (Satori JSX) |
| `src/utils/og-templates/tag.js` | Tag OG template (Satori JSX) |
| `src/pages/og.png.ts` | Homepage OG endpoint |
| `src/pages/posts/[...slug]/index.png.ts` | Post OG endpoint (default) |
| `src/pages/og-images/[theme]/[slug].png.ts` | Theme-aware post OG endpoint |
| `src/pages/tags/[tag]/og.png.ts` | Tag OG endpoint |
| `src/layouts/Layout.astro` | Meta tag injection + client-side theme swap |
| `src/layouts/PostDetails.astro` | OG image resolution for posts |
| `src/components/Card.astro` | Cover image display in post cards |
| `src/config.ts` | `ogImage`, `dynamicOgImage`, `showCoverImages` settings |
| `src/content.config.ts` | `ogImage` field schema definition |
| `.og-cache/` | Runtime cache directory (PNG + hash files) |
