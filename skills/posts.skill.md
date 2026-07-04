# Blog Posts System — Knowledge Base

> This document is a comprehensive reference for the blog posts listing, pagination, search, tagging, and content collection system in this Astro project. It is designed as a knowledge transfer document for building a similar system in another Astro project.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Dependencies](#2-dependencies)
3. [Configuration](#3-configuration)
4. [Content Collections & Schema](#4-content-collections--schema)
5. [Content Filtering Pipeline](#5-content-filtering-pipeline)
6. [Sorting & Ordering](#6-sorting--ordering)
7. [Path & Slug Generation](#7-path--slug-generation)
8. [Content Entry Utilities](#8-content-entry-utilities)
9. [Posts Listing Pages](#9-posts-listing-pages)
10. [Homepage (Featured + Recent)](#10-homepage-featured--recent)
11. [Post Detail Page](#11-post-detail-page)
12. [Pagination](#12-pagination)
13. [Post Card Component](#13-post-card-component)
14. [Tag System](#14-tag-system)
15. [Tag-Filtered Post Listing](#15-tag-filtered-post-listing)
16. [Archives Page](#16-archives-page)
17. [Search System (Pagefind)](#17-search-system-pagefind)
18. [Search Modal (Keyboard Shortcut)](#18-search-modal-keyboard-shortcut)
19. [Breadcrumb Navigation](#19-breadcrumb-navigation)
20. [Reading Time Calculation](#20-reading-time-calculation)
21. [Layouts & Wrappers](#21-layouts--wrappers)
22. [Adding a New Post](#22-adding-a-new-post)
23. [Adding a New Content Collection](#23-adding-a-new-content-collection)
24. [Troubleshooting](#24-troubleshooting)
25. [File Reference](#25-file-reference)

---

## 1. Architecture Overview

The system uses **Astro Static Site Generation (SSG)** with **client-side search**:

```
Content Files (Markdown/MDX)
  ↓
Astro Content Collections (glob loader)
  ↓
Filter Pipeline (draft check, schedule check)
  ↓
Sorting (newest first, modDatetime priority)
  ↓
Route Generation (getStaticPaths + paginate)
  ↓
Pages rendered at build time
  ↓
Pagefind indexes the built HTML for client-side search
```

### Page Map

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/pages/index.astro` | Homepage: featured + recent posts |
| `/posts/` | `src/pages/posts/[...page].astro` | Paginated post listing |
| `/posts/{slug}/` | `src/pages/posts/[...slug]/index.astro` | Individual post detail |
| `/posts/{slug}.png` | `src/pages/posts/[...slug]/index.png.ts` | Dynamic OG image endpoint |
| `/tags/` | `src/pages/tags/index.astro` | All tags with post counts |
| `/tags/{tag}/` | `src/pages/tags/[tag]/[...page].astro` | Tag-filtered post listing |
| `/tags/{tag}/og.png` | `src/pages/tags/[tag]/og.png.ts` | Tag OG image endpoint |
| `/archives/` | `src/pages/archives/index.astro` | All posts grouped by year/month |
| `/search/` | `src/pages/search.astro` | Full-text search (Pagefind) |

### Data Flow

```
getCollection("blog")          getCollection("galleries")
        ↓                               ↓
        └────────── merge ──────────────┘
                       ↓
              getSortedPosts()
              (filter + sort)
                       ↓
           ┌───────────┼───────────┐
           ↓           ↓           ↓
      index.astro   [...page]   [tag]/[...page]
      (featured +   (paginate)  (paginate by tag)
       recent)
```

---

## 2. Dependencies

| Package | Purpose |
|---------|---------|
| `astro` | Static site generation framework |
| `pagefind` | Static search index generator (build-time) |
| `@pagefind/default-ui` | Pre-built search UI components |
| `dayjs` + `dayjs/plugin/utc` + `dayjs/plugin/timezone` | Date/time handling with timezone support |
| `lodash.kebabcase` | Kebab-case slugification (preserves non-Latin chars) |
| `slugify` | Latin slugification (better acronym/number handling) |

---

## 3. Configuration

**File:** `src/config.ts`

Key post-related settings:

```typescript
export const SITE = {
  postPerIndex: 6,          // Posts shown on homepage (recent section)
  postPerPage: 12,          // Posts per paginated page
  scheduledPostMargin: 15 * 60 * 1000,  // 15-minute buffer for scheduled posts
  showArchives: true,       // Enable /archives/ page
  showGalleries: true,      // Enable gallery collection
  showGalleriesInIndex: true, // Merge galleries into general post lists
  showBackButton: true,     // Show back button in post detail
  showTagsInCards: true,    // Show tag pills on post cards
  showCoverImages: true,    // Show OG images as cover images in cards
  indexPostsGrid: true,     // Grid layout for featured/recent on homepage
  dynamicOgImage: true,     // Enable dynamic OG image generation
  timezone: "Asia/Bangkok", // Default timezone for scheduling
  editPost: {
    enabled: false,         // Show "Edit this post" link
    text: "Edit this post",
    url: "",                // URL to edit (e.g., GitHub edit URL)
  },
};
```

---

## 4. Content Collections & Schema

**File:** `src/content.config.ts`

### Blog Collection

**Source:** `src/data/blog/**/*.{md,mdx}` (files starting with `_` are excluded)

```typescript
blog: defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/blog" }),
  schema: ({ image }) => z.object({
    author: z.string().default(SITE.author),
    pubDatetime: z.date(),
    modDatetime: z.date().optional().nullable(),
    title: z.string(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).default(["others"]),
    ogImage: image().or(z.string()).optional(),
    description: z.string(),
    canonicalURL: z.string().optional(),
    hideEditPost: z.boolean().optional(),
    timezone: z.string().optional(),
  }),
});
```

### Galleries Collection

**Source:** `src/data/galleries/*/index.{md,mdx}` (folder-based)

```typescript
galleries: defineCollection({
  loader: glob({ pattern: "**/index.{md,mdx}", base: "./src/data/galleries" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDatetime: z.date(),
    draft: z.boolean().optional(),
    coverImage: image().optional(),
    tags: z.array(z.string()).default([]),
  }),
});
```

### Unified ContentEntry Type

```typescript
export type ContentEntry =
  | CollectionEntry<"blog">
  | CollectionEntry<"galleries">;
```

Both collections are merged into a single array for listing pages, filtered and sorted uniformly.

### Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | ✅ | Post title |
| `description` | `string` | ✅ | Short description (shown in cards) |
| `pubDatetime` | `Date` | ✅ | Publication date |
| `modDatetime` | `Date` | ❌ | Last modification date (used for sorting if present) |
| `tags` | `string[]` | ❌ | Tags (defaults to `["others"]`) |
| `draft` | `boolean` | ❌ | If `true`, post is hidden in production |
| `featured` | `boolean` | ❌ | If `true`, shown prominently on homepage |
| `ogImage` | `image \| string` | ❌ | Custom OG image (Astro asset or URL) |
| `author` | `string` | ❌ | Author name (defaults to `SITE.author`) |
| `canonicalURL` | `string` | ❌ | Custom canonical URL |
| `hideEditPost` | `boolean` | ❌ | Hide "Edit this post" link |
| `timezone` | `string` | ❌ | Post-specific timezone (overrides SITE default) |

---

## 5. Content Filtering Pipeline

**File:** `src/utils/postFilter.ts`

### postFilter()

Determines whether a post should be visible:

```typescript
const postFilter = ({ data }: ContentEntry) => {
  // 1. Never show drafts
  if (data.draft) return false;

  // 2. Check publication schedule (with margin)
  const postTimezone = "timezone" in data ? data.timezone : undefined;
  const pubDatetime = dayjs(data.pubDatetime).tz(postTimezone || SITE.timezone);

  const isPublishTimePassed =
    dayjs().tz(SITE.timezone).valueOf() >
    pubDatetime.valueOf() - SITE.scheduledPostMargin;

  // 3. In DEV mode, show all (including future); in production, check schedule
  return import.meta.env.DEV || isPublishTimePassed;
};
```

### Schedule Margin

The `scheduledPostMargin` (default: 15 minutes) provides a buffer so posts scheduled for a specific time appear slightly before their exact publish time. This is useful for CMS workflows where you want posts to go live at a round time.

### DEV vs Production

- **DEV mode**: All non-draft posts are shown (including future-scheduled ones)
- **Production**: Only posts whose publish time (minus margin) has passed

---

## 6. Sorting & Ordering

**File:** `src/utils/getSortedPosts.ts`

```typescript
const getSortedPosts = (posts: ContentEntry[]) =>
  posts
    .filter(postFilter)                          // Apply filter
    .map(post => ({
      post,
      publishedMs: getEntryPublishedMs(post)     // Get sort timestamp
    }))
    .sort((a, b) => b.publishedMs - a.publishedMs) // Newest first
    .map(({ post }) => post);
```

### Sort Priority

Posts are sorted by `modDatetime` if available, otherwise by `pubDatetime`:

```typescript
// From contentEntry.ts
export const getEntryPublishedMs = (entry: ContentEntry) => {
  const modDatetime = "modDatetime" in entry.data ? entry.data.modDatetime : null;
  return new Date(modDatetime ?? entry.data.pubDatetime).getTime();
};
```

This means edited posts "bubble up" to reflect their latest modification time.

---

## 7. Path & Slug Generation

**File:** `src/utils/getPath.ts`

### Blog Post Paths

Blog post URLs are derived from the file path structure:

```
src/data/blog/hello-world.md           → /posts/hello-world
src/data/blog/category/post-title.md   → /posts/category/post-title
src/data/blog/_drafts/post.md          → (excluded, underscore prefix)
```

The `getPath()` function:
1. Strips the base `BLOG_PATH` prefix
2. Splits into segments
3. Filters out empty strings and underscore-prefixed directories
4. Removes the filename (last segment)
5. Slugifies each remaining segment
6. Joins with `/posts/` base

```typescript
getPath(id, filePath, includeBase = true)
// includeBase=true  → "/posts/category/slug"
// includeBase=false → "category/slug" (for route params)
```

### Slug Hybrid Approach

**File:** `src/utils/slugify.ts`

```typescript
// Latin text: "E2E Testing" → "e2e-testing"
// Non-Latin text: "你好世界" → "你好世界" (preserved)
```

Uses `slugify` (npm) for Latin text (better acronym/number handling) and `lodash.kebabcase` for non-Latin text (preserves characters).

### Gallery Paths

Gallery posts use a different routing pattern:

```typescript
// From contentEntry.ts
export const getEntryPath = (entry) =>
  isGalleryEntry(entry)
    ? `/galleries/${getGallerySlug(entry.id)}`
    : getPath(entry.id, entry.filePath);
```

---

## 8. Content Entry Utilities

**File:** `src/utils/contentEntry.ts`

### Key Functions

| Function | Purpose |
|----------|---------|
| `getEntryPath(entry)` | Returns the URL path for any content entry (blog or gallery) |
| `getGallerySlug(id)` | Strips `/index.md` suffix from gallery IDs |
| `getEntryPublishedMs(entry)` | Returns millisecond timestamp for sorting |
| `isGalleryEntry(entry)` | Type guard for gallery entries |

### Type System

```typescript
export type ContentEntry =
  | CollectionEntry<"blog">
  | CollectionEntry<"galleries">;
```

This unified type allows all listing components and utilities to work with both collections interchangeably.

---

## 9. Posts Listing Pages

### `/posts/` — Paginated Post Listing

**File:** `src/pages/posts/[...page].astro`

**getStaticPaths**: Collects all non-draft blog posts and galleries (if enabled), sorts them, and paginates:

```typescript
export const getStaticPaths = (async ({ paginate }) => {
  const [blogPosts, galleryPosts] = await Promise.all([
    getCollection("blog", ({ data }) => !data.draft),
    SITE.showGalleries && SITE.showGalleriesInIndex
      ? getCollection("galleries", ({ data }) => !data.draft)
      : Promise.resolve([]),
  ]);
  return paginate(getSortedPosts([...blogPosts, ...galleryPosts]), {
    pageSize: SITE.postPerPage,
  });
});
```

**Template structure:**
1. Hero section with post count + page indicator
2. Search toolbar (Pagefind inline search widget)
3. Post grid (3 columns on desktop, 2 on tablet, 1 on mobile)
4. Pagination component

### Pagefind Integration on Posts Page

The posts page embeds a Pagefind search widget directly:

```html
<div id="posts-pagefind" class="premium-search"></div>
```

This is initialized via a `<script>` tag that lazily loads `@pagefind/default-ui`.

---

## 10. Homepage (Featured + Recent)

**File:** `src/pages/index.astro`

### Post Splitting

```typescript
const sortedPosts = getSortedPosts(posts);
const featuredPosts = sortedPosts.filter(({ data }) => "featured" in data && data.featured);
const recentPosts = sortedPosts.filter(({ data }) => !("featured" in data && data.featured));
```

### Layout

```
┌──────────────────────────────────────┐
│  Hero Section                        │
│  ├── Terminal prompt badge           │
│  ├── Site title                      │
│  ├── Intro audio (optional)          │
│  ├── Description                     │
│  ├── Author + social links           │
│                                      │
│  Featured Section (if any)           │
│  ├── "Featured" heading with star    │
│  └── 2-column grid of featured cards │
│                                      │
│  Recent Posts Section                │
│  ├── "Recent Posts" heading          │
│  └── Grid of recent cards            │
│  └── "Explore all posts" CTA button  │
└──────────────────────────────────────┘
```

- **Featured posts**: Shown in a 2-column grid with special amber/gold styling
- **Recent posts**: Limited to `SITE.postPerIndex` (default: 6), with link to `/posts/`
- **Galleries**: Merged into both sections if `showGalleriesInIndex` is enabled

---

## 11. Post Detail Page

**File:** `src/pages/posts/[...slug]/index.astro` + `src/layouts/PostDetails.astro`

### Route Generation

```typescript
export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: getPath(post.id, post.filePath, false) },
    props: { post },
  }));
}
```

### PostDetails Layout

The post detail page includes:

```
┌──────────────────────────────────────┐
│  Header + Breadcrumb (with back)     │
│                                      │
│  Post Header                         │
│  ├── Title (with view transition)    │
│  ├── Tags as badges                  │
│  ├── Author, Date, Modified Date     │
│  ├── "Edit this post" link (optional)│
│                                      │
│  Post Content (Markdown/MDX)         │
│  └── data-pagefind-body (indexed)    │
│                                      │
│  Prev/Next Post Navigation           │
│  ├── Previous post card              │
│  └── Next post card                  │
│                                      │
│  Footer                              │
└──────────────────────────────────────┘
```

### Prev/Next Navigation

Posts are ordered using the same `getSortedPosts()` function. The current post's index determines prev/next:

```typescript
const allPosts = posts.map(({ data: { title }, id, filePath }) => ({ id, title, filePath }));
const currentPostIndex = allPosts.findIndex(a => a.id === post.id);
const prevPost = currentIndex !== 0 ? allPosts[currentIndex - 1] : null;
const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
```

### Search Indexing

The `<main>` element has `data-pagefind-body`, which tells Pagefind to index the post content:

```html
<main id="main-content" data-pagefind-body>
```

---

## 12. Pagination

**File:** `src/components/Pagination.astro`

### Behavior

- Only renders when `page.lastPage > 1`
- Shows previous/next arrow buttons
- Displays "Page X / Y" counter
- Buttons are disabled (with `opacity-50`) when at first/last page

### Page Data Object

Astro's `paginate()` returns a `Page<T>` object:

```typescript
interface Page<T> {
  data: T[];           // Items for this page
  currentPage: number; // 1-indexed
  lastPage: number;
  total: number;
  size: number;        // Items per page
  url: {
    current: string;
    prev: string | undefined;
    next: string | undefined;
  };
}
```

### URL Pattern

- Page 1: `/posts/` (or `/posts`)
- Page 2: `/posts/2/`
- Page 3: `/posts/3/`

---

## 13. Post Card Component

**File:** `src/components/Card.astro`

The card renders a post in listing views with:

### Visual Elements

```
┌──────────────────────────────────────┐
│  ┌──────────────────────────────┐    │
│  │  Cover Image (if available)  │    │  ← OG image or gallery cover
│  │  loading="lazy"              │    │
│  └──────────────────────────────┘    │
│                                      │
│  Post Title                          │  ← Clickable heading (h2 or h3)
│  📅 Date  📖 3 min read              │  ← Datetime + reading time
│  Description text (2 lines max)      │  ← Clamped paragraph
│  [#tag1] [#tag2] [#tag3] [#tag4]    │  ← Up to 4 tag pills
└──────────────────────────────────────┘
```

### Props

```typescript
type Props = {
  variant?: "h2" | "h3";     // Heading level
  featured?: boolean;         // Featured styling
} & (CollectionEntry<"blog"> | CollectionEntry<"galleries">);
```

### Cover Image Resolution

```
Is it a gallery?
├── YES → Use coverImage from frontmatter, or first folder image
└── NO (blog post)
    ├── Has ogImage in frontmatter? → Use it (string URL or Astro asset)
    └── SITE.dynamicOgImage enabled? → Use /og-images/{defaultTheme}/{slug}.png
```

### Card Variants

| Variant | Border Color | Hover Effect |
|---------|-------------|--------------|
| Regular post | `border-border/25` | Accent glow |
| Featured post | `border-amber-500/30` | Amber glow + shadow |
| Gallery | `border-purple-500/20` | Purple glow |
| Featured gallery | `border-purple-500/40` | Purple glow + shadow |

### Cursor Glow Effect

Each card has a `card-glow-effect` div that follows the mouse cursor within the card, creating a subtle radial highlight on hover.

---

## 14. Tag System

### Tag Collection

**File:** `src/utils/getUniqueTags.ts`

Collects all unique tags across all posts:

```typescript
const getUniqueTags = (posts: ContentEntry[]) => {
  const tagMap = new Map<string, string>();  // slug → original name

  for (const post of posts) {
    if (!postFilter(post)) continue;  // Skip filtered posts
    for (const tagName of post.data.tags) {
      const tag = slugifyStr(tagName);
      if (!tagMap.has(tag)) tagMap.set(tag, tagName);
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, tagName]) => ({ tag, tagName }))
    .sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag));
};
```

Returns `{ tag, tagName }[]` where:
- `tag` is the slugified version (used in URLs)
- `tagName` is the original display name

### Tag Filtering

**File:** `src/utils/getPostsByTag.ts`

```typescript
const getPostsByTag = (posts: ContentEntry[], tag: string) =>
  getSortedPosts(
    posts.filter(post => slugifyAll(post.data.tags).includes(tag))
  );
```

Filters posts by matching slugified tags, then sorts the result.

### Tag Index Page

**File:** `src/pages/tags/index.astro`

Displays all tags with post counts and visual intensity:

```typescript
const tagsWithCount = tags.map(({ tag, tagName }) => ({
  tag,
  tagName,
  count: getPostsByTag(posts, tag).length,
}));

const maxCount = Math.max(...tagsWithCount.map(t => t.count));
// Used for visual intensity scaling
```

Each tag card shows the tag name and post count, with visual intensity proportional to the count.

---

## 15. Tag-Filtered Post Listing

**File:** `src/pages/tags/[tag]/[...page].astro`

### Route Generation

Generates paginated routes for every unique tag:

```typescript
export async function getStaticPaths({ paginate }) {
  const posts = [...blogPosts, ...galleryPosts];
  const tags = getUniqueTags(posts);

  return tags.flatMap(({ tag, tagName }) => {
    const tagPosts = getPostsByTag(posts, tag);
    return paginate(tagPosts, {
      params: { tag },          // URL: /tags/{tag}/
      props: { tagName },       // Display name passed as prop
      pageSize: SITE.postPerPage,
    });
  });
}
```

### URL Pattern

- `/tags/javascript/` — Page 1 of JavaScript posts
- `/tags/javascript/2/` — Page 2

### Page Structure

Uses the `Main` layout with a transition name for the tag:

```astro
<Main
  pageTitle={[`Tag:`, `${tagName}`]}
  titleTransition={tag}
  pageDesc={`All the articles with the tag "${tagName}".`}
>
```

---

## 16. Archives Page

**File:** `src/pages/archives/index.astro`

### Grouping

Posts are grouped hierarchically: **Year → Month → Posts**

```typescript
const yearGroups = Object.entries(
  getPostsByGroupCondition(posts, post => post.data.pubDatetime.getFullYear())
).sort(([a], [b]) => Number(b) - Number(a));  // Newest year first

// Within each year:
const monthGroups = Object.entries(
  getPostsByGroupCondition(yearPosts, post => post.data.pubDatetime.getMonth())
);
```

**File:** `src/utils/getPostsByGroupCondition.ts`

A generic grouping utility:

```typescript
const getPostsByGroupCondition = (posts, groupFunction) => {
  const result = {};
  for (const item of posts) {
    const key = groupFunction(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
  }
  return result;
};
```

### Page Structure

```
┌──────────────────────────────────────┐
│  Hero: "Archive" + post count        │
│                                      │
│  Timeline                            │
│  ├── 2026                            │
│  │   ├── June                        │
│  │   │   ├── Post Title — Date       │
│  │   │   └── Post Title — Date       │
│  │   └── May                         │
│  │       └── Post Title — Date       │
│  ├── 2025                            │
│  │   └── ...                         │
│  └── ...                             │
└──────────────────────────────────────┘
```

### Config Guard

If `SITE.showArchives` is `false`, the page redirects to 404:

```typescript
if (!SITE.showArchives) {
  return Astro.redirect("/404");
}
```

---

## 17. Search System (Pagefind)

### Overview

[Pagefind](https://pagefind.app/) is a fully static search library. It runs at **build time** to create a search index, and at **runtime** entirely in the browser (no server required).

### Build Process

```bash
# From package.json build script:
astro check && astro build && pagefind --site dist && \
  node -e "require('fs').cpSync('dist/pagefind', 'public/pagefind', {recursive: true})"
```

1. `astro build` — Generates static HTML in `dist/`
2. `pagefind --site dist` — Scans HTML, builds search index
3. Copy `dist/pagefind/` → `public/pagefind/` — Makes index available at `/pagefind/`

### Pagefind Output (`public/pagefind/`)

| File | Purpose |
|------|---------|
| `pagefind.js` | Main search engine (loaded on demand) |
| `pagefind-ui.js` | Default UI component |
| `pagefind-ui.css` | Default UI styles |
| `pagefind-entry.json` | Index metadata |
| `wasm.en.pagefind` | WASM search binary |
| `fragment/`, `index/` | Sharded index data |

### What Gets Indexed

Pagefind indexes any HTML element with `data-pagefind-body`:

```html
<main data-pagefind-body>
  <!-- All content here is indexed -->
</main>
```

In this project, the post detail page's `<main>` has this attribute, so full post content (title, body, tags, description) is indexed.

### Pagefind Configuration Options

```javascript
const search = new PagefindUI({
  element: "#pagefind-search",
  showImages: false,       // Don't show images in results
  showSubResults: true,    // Show sub-results (sections within a page)
  processTerm: function (term) {
    // Sync search term to URL params
    params.set("q", term);
    history.replaceState(history.state, "", "?" + params.toString());
    return term;
  },
});
```

### Search Term in URL

The search term is synced to the URL query parameter `?q=`:
- User searches "typescript" → URL becomes `/search/?q=typescript`
- On page load, the `q` param can pre-fill the search box
- Back button restores the previous search

### DEV Mode Warning

In development, Pagefind won't have an index (it's built at build time). The search page shows a warning:

```
DEV mode Warning! You need to build the project at least once to see search results.
```

---

## 18. Search Modal (Keyboard Shortcut)

**File:** `src/components/SearchModal.astro`

A floating modal search overlay (distinct from the `/search/` page):

### Features

- Opens with `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) keyboard shortcut
- Closes with `Esc` or clicking backdrop
- Aurora orbs + cursor glow visual effects
- Sparkle decorations
- Keyboard navigation hints displayed

### Visual Structure

```
┌──────────────────────────────────────┐
│  ┌────────────────────────────────┐  │
│  │  🔍 Search                     │  │
│  │  ┌──────────────────────────┐  │  │
│  │  │  Search input            │  │  │
│  │  └──────────────────────────┘  │  │
│  │                                │  │
│  │  Search results                │  │
│  │  └── (Pagefind UI)            │  │
│  │                                │  │
│  │  ⌘K to open  Esc to close    │  │
│  └────────────────────────────────┘  │
│                                      │
│  (backdrop — click to close)         │
└──────────────────────────────────────┘
```

### Lazy Loading

The Pagefind UI is lazily loaded via `requestIdleCallback` to avoid blocking initial page render:

```javascript
const onIdle = window.requestIdleCallback || (cb => setTimeout(cb, 1));
onIdle(async () => {
  const { PagefindUI } = await import("@pagefind/default-ui");
  const search = new PagefindUI({ ... });
});
```

### Cleanup

Uses `AbortController` to clean up event listeners on page navigation (for View Transitions):

```javascript
document.addEventListener("astro:page-load", () => {
  if (searchCleanup) searchCleanup.abort();
  searchCleanup = new AbortController();
  // ... setup
});
```

---

## 19. Breadcrumb Navigation

**File:** `src/components/Breadcrumb.astro` + `src/utils/breadcrumbs.ts`

### Behavior

- Parses the current URL pathname into segments
- Converts slug segments to readable labels (e.g., `my-post` → `My post`)
- Compacts numeric segments (pagination pages like `/posts/2/` → `#2`)
- Supports a back button (`cd ..` style) in post detail views

### Breadcrumb Items

```typescript
type BreadcrumbItem = {
  label: string;    // Display label
  href: string | null;  // null = current page (not clickable)
};
```

### Example Output

| URL | Breadcrumb |
|-----|-----------|
| `/` | `~` (home only) |
| `/posts/` | `~ / Posts` |
| `/posts/hello-world/` | `~ / Posts / Hello world` |
| `/tags/javascript/` | `~ / Tags / JavaScript` |
| `/posts/2/` | `~ / Posts / #2` (compact numeric) |

---

## 20. Reading Time Calculation

**File:** `src/utils/readingTime.ts`

```typescript
function getReadingTime(body: string, wordsPerMinute = 200): string
```

### Process

1. Strip frontmatter (`---...---`)
2. Strip fenced code blocks (```` ```...``` ````)
3. Strip inline code (`` `code` ``)
4. Strip images (`![alt](url)`)
5. Convert links to plain text (`[text](url)` → `text`)
6. Strip heading markers (`#`, `##`, etc.)
7. Strip formatting (`**bold**`, `*italic*`, `~~strike~~`)
8. Strip list markers, blockquotes, table pipes
9. Collapse whitespace
10. Count words and compute: `Math.ceil(wordCount / 200)`

### Output

- `< 1 min read` (for very short posts)
- `3 min read` (for typical posts)

---

## 21. Layouts & Wrappers

### Layout Hierarchy

```
Layout.astro          — Base: <html>, <head>, SEO, meta tags, theme
├── Header.astro      — Site header with navigation
├── Breadcrumb.astro  — Breadcrumb navigation
├── <slot />          — Page content
└── Footer.astro      — Site footer
```

### Main Layout

**File:** `src/layouts/Main.astro`

A wrapper for listing pages (tags, archives):

```astro
<Breadcrumb />
<main id="main-content" class="app-layout">
  <h1>{pageTitle}</h1>
  <p>{pageDesc}</p>
  <slot />  <!-- Card list goes here -->
</main>
```

Supports two title modes:
- **String title**: `<h1>{title}</h1>`
- **Array title with transition**: `<h1>{title[0]}<span transition:name>{title[1]}</span></h1>`

### PostDetails Layout

**File:** `src/layouts/PostDetails.astro`

Wraps individual posts with:
- Post header (title, tags, metadata)
- Content (with `data-pagefind-body`)
- Prev/next navigation
- OG image resolution

---

## 22. Adding a New Post

### Step-by-step

1. Create a new `.md` or `.mdx` file in `src/data/blog/`:

```markdown
---
title: "My New Post"
description: "A brief description of the post."
pubDatetime: 2026-06-22T10:00:00+07:00
tags: ["tutorial", "javascript"]
draft: false
---

Your content here...

## Section 1

...
```

2. Run `pnpm build` to generate the search index
3. The post will appear on `/posts/`, `/archives/`, and relevant tag pages

### Optional Frontmatter

```markdown
---
modDatetime: 2026-06-23T15:00:00+07:00  # Shows "modified" date
featured: true                            # Appears in featured section
author: "Guest Author"                    # Override default author
ogImage: "./custom-cover.png"             # Custom OG image
canonicalURL: "https://other-site.com/post"  # Custom canonical
hideEditPost: true                        # Hide edit link
timezone: "Asia/Tokyo"                    # Post-specific timezone
---
```

### Organizing in Subdirectories

Posts can be organized in subdirectories:

```
src/data/blog/
├── hello-world.md              → /posts/hello-world
├── tutorial/
│   ├── getting-started.md      → /posts/tutorial/getting-started
│   └── advanced.md             → /posts/tutorial/advanced
└── _drafts/                    → (excluded from production)
    └── upcoming.md
```

Underscore-prefixed directories are excluded from URL generation and production builds.

---

## 23. Adding a New Content Collection

To add a new content type (e.g., "tutorials"):

### 1. Define the Schema

In `src/content.config.ts`:

```typescript
const tutorials = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/tutorials" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDatetime: z.date(),
    modDatetime: z.date().optional().nullable(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).default([]),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    // ... other fields
  }),
});

export const collections = { blog, galleries, tutorials };
```

### 2. Update ContentEntry Type

In `src/utils/contentEntry.ts`:

```typescript
export type ContentEntry =
  | CollectionEntry<"blog">
  | CollectionEntry<"galleries">
  | CollectionEntry<"tutorials">;
```

### 3. Update Entry Path Function

```typescript
export const getEntryPath = (entry) => {
  if (entry.collection === "galleries") return `/galleries/${getGallerySlug(entry.id)}`;
  if (entry.collection === "tutorials") return `/tutorials/${getPath(entry.id, entry.filePath, false)}`;
  return getPath(entry.id, entry.filePath);
};
```

### 4. Create the Route

```typescript
// src/pages/tutorials/[...page].astro
export const getStaticPaths = (async ({ paginate }) => {
  const tutorials = await getCollection("tutorials", ({ data }) => !data.draft);
  return paginate(getSortedPosts(tutorials), { pageSize: SITE.postPerPage });
});
```

### 5. Update Homepage (if desired)

Add the new collection to the `getCollection()` calls in `src/pages/index.astro`.

---

## 24. Troubleshooting

### Post not appearing in the list

- Check `draft: false` in frontmatter (or `draft` omitted — defaults to not-draft)
- Check `pubDatetime` — in production, future posts are hidden until their publish time (minus `scheduledPostMargin`)
- Check the file is not in an `_` prefixed directory
- Ensure the file extension is `.md` or `.mdx`

### Tags not showing

- Check `tags` array is defined in frontmatter (defaults to `["others"]`)
- Tags are slugified for URLs — ensure tag pages are generated

### Search not working

- Run `pnpm build` — Pagefind only indexes built HTML
- Check `public/pagefind/` exists after build
- In DEV mode, search shows a warning (expected behavior)
- Ensure `data-pagefind-body` is on the indexed element

### Pagination not working

- Check `SITE.postPerPage` is set (default: 12)
- Ensure posts pass the filter (not drafts, publish time passed)
- Pagination only shows when there are more posts than `postPerPage`

### Reading time showing incorrectly

- The function strips markdown syntax before counting
- Code blocks are excluded from word count
- Images and formatting markers are stripped

### Cover images not showing in cards

- Check `SITE.showCoverImages` is `true`
- For blog posts: ensure `ogImage` is set in frontmatter, or `SITE.dynamicOgImage` is `true`
- For galleries: ensure `coverImage` is set or gallery has images
- Run `pnpm build` to generate dynamic OG images

### Archives page shows 404

- Check `SITE.showArchives` is `true` in config
- If `false`, the page redirects to 404

### Tag pages have wrong content

- Tags are matched by slugified version — ensure URL uses the slug
- Tag matching is case-insensitive via slugification

---

## 25. File Reference

| File | Purpose |
|------|---------|
| **Content & Schema** | |
| `src/content.config.ts` | Collection schemas (blog, galleries) |
| `src/data/blog/` | Blog post source files (`.md`/`.mdx`) |
| `src/data/galleries/` | Gallery source folders |
| **Pages** | |
| `src/pages/index.astro` | Homepage (featured + recent) |
| `src/pages/posts/[...page].astro` | Paginated post listing |
| `src/pages/posts/[...slug]/index.astro` | Individual post detail |
| `src/pages/tags/index.astro` | Tag index with counts |
| `src/pages/tags/[tag]/[...page].astro` | Tag-filtered post listing |
| `src/pages/archives/index.astro` | Archives (year/month grouping) |
| `src/pages/search.astro` | Dedicated search page |
| **Components** | |
| `src/components/Card.astro` | Post card (listing view) |
| `src/components/Pagination.astro` | Page navigation |
| `src/components/Tag.astro` | Tag label component |
| `src/components/Datetime.astro` | Date/time display |
| `src/components/Breadcrumb.astro` | Breadcrumb navigation |
| `src/components/SearchModal.astro` | Floating search overlay (⌘K) |
| **Layouts** | |
| `src/layouts/Layout.astro` | Base layout (SEO, meta, theme) |
| `src/layouts/Main.astro` | Listing page wrapper |
| `src/layouts/PostDetails.astro` | Post detail wrapper |
| **Utilities** | |
| `src/utils/getSortedPosts.ts` | Filter + sort pipeline |
| `src/utils/postFilter.ts` | Draft + schedule filtering |
| `src/utils/getUniqueTags.ts` | Collect unique tags |
| `src/utils/getPostsByTag.ts` | Filter posts by tag |
| `src/utils/getPostsByGroupCondition.ts` | Generic grouping utility |
| `src/utils/contentEntry.ts` | Unified content entry type + helpers |
| `src/utils/getPath.ts` | Blog post URL generation |
| `src/utils/slugify.ts` | Hybrid slugification (Latin + non-Latin) |
| `src/utils/readingTime.ts` | Reading time calculation |
| `src/utils/breadcrumbs.ts` | Breadcrumb item generation |
| **Configuration** | |
| `src/config.ts` | Site settings (pagination, features) |
| `src/constants.ts` | Social links, icons |
| **Search** | |
| `public/pagefind/` | Pagefind index (generated at build) |
| `package.json` | Build script includes Pagefind |
