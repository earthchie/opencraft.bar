# OpenCraft.bar

**Where Craft Meets Open Culture**

OpenCraft is an open brand craft beer bar website built with [Astro](https://astro.build). This is the official OpenCraft website — the founding location and Core Team behind the OpenCraft brand.

## 🍺 Features

- **Tap List** — Current beer rotation with multi-size pricing and card-based layout
- **Knowledge Base** — Beer style guides and educational articles (i18n: EN/TH)
- **News & Events** — Event announcements and community news
- **i18n** — Full English and Thai language support (Thai is default)
- **Dark/Light Theme** — User-selectable theme with smooth transitions
- **OG Image Generation** — Auto-generated Open Graph images for articles and tags
- **Search** — Pagefind-powered full-text search
- **Responsive** — Mobile-first design with glass-morphism nav dropdowns

## 🚀 Tech Stack

| Tool | Purpose |
|---|---|
| [Astro](https://astro.build) v6 | Static site framework |
| [Tailwind CSS](https://tailwindcss.com) v4 | Utility-first styling |
| [Pagefind](https://pagefind.app) | Static search indexing |
| [Satori](https://github.com/vercel/satori) + [Resvg](https://github.com/yisibl/resvg-js) | OG image generation |
| [Astro i18n](https://docs.astro.build/en/guides/internationalization/) | Multi-language routing with prefix |

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── Header.astro
│   ├── Footer.astro
│   ├── TapList.astro
│   ├── NewsSection.astro
│   └── KnowledgeSection.astro
├── content/        # Content collections
│   ├── knowledge/  # Beer knowledge articles (EN + TH)
│   └── news/       # News & events (EN + TH)
├── data/           # Static data (tap list)
├── i18n/           # Translation files
├── layouts/        # Base layout
├── pages/          # Route pages
│   ├── en/         # English locale routes
│   ├── th/         # Thai locale routes
│   ├── about.astro
│   ├── license.astro
│   ├── location.astro
│   ├── services.astro
│   ├── knowledge/
│   ├── news/
│   └── tag/
├── styles/         # Global CSS and themes
└── utils/          # OG image utilities
```

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npx astro dev

# Build for production
npx astro build

# Preview production build
npx astro preview
```

The dev server runs at `http://localhost:4321/`.

## 🌐 Internationalization

- **Default locale:** Thai (`th`)
- **Secondary locale:** English (`en`)
- Both locales use URL prefixes: `/th/...` and `/en/...`
- Root `/` redirects to `/th/`
- Language switcher in the nav toggles between locales while preserving the current page path

## ☁️ Deploy to Cloudflare Pages

### Prerequisites

- A [Cloudflare](https://cloudflare.com) account
- Your project pushed to a GitHub repository

### Steps

1. **Go to Cloudflare Dashboard** → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. **Select your repository** (`earthchie/opencraft.bar`)
3. **Configure your build settings:**

   | Setting | Value |
   |---|---|
   | Framework preset | **Astro** |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | `/` (leave as default) |

5. Click **Save and Deploy**.

Cloudflare will automatically detect the Astro framework and build your site on every push to the main branch.

### Custom Domain (Optional)

1. Go to your Pages project → **Custom domains** → **Set up a custom domain**
2. Enter your domain (e.g., `opencraft.bar`)
3. Follow Cloudflare's DNS instructions

### Notes

- The site is fully static — no server-side rendering needed
- Pagefind search index is built at compile time
- OG images are pre-generated during build
- Thai routes are prefixed with `/th/`

## 📜 License

This project and the OpenCraft brand are open under the [OpenCraft Brand License](https://opencraft.bar/license/).

---

Built with ❤️ and open source.
