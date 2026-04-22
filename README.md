<div align="center">

# Muhammad Ikhwanul Hakim

**Software Engineer & Project Manager**

[![Live Site](https://img.shields.io/website?url=https%3A%2F%2Fikhwanulhakim.vercel.app&label=ikhwanulhakim.vercel.app&style=flat-square&color=7AC000)](https://ikhwanulhakim.vercel.app)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-98%2F100%2F81%2F100-7AC000?style=flat-square)](https://ikhwanulhakim.vercel.app)
[![Astro](https://img.shields.io/badge/Astro-6.x-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)

[🌐 Live Site](https://ikhwanulhakim.vercel.app) · [💬 WhatsApp](https://wa.me/6289691964368) · [💼 LinkedIn](https://www.linkedin.com/in/ikhwanulhakimm/) · [📷 Instagram](https://www.instagram.com/ikhwanulhakimm/)

</div>

---

My personal portfolio and landing page — designed and built from scratch, deployed on Vercel. Clean code, real delivery, zero fluff.

## ✦ Highlights

- **Zero framework JS** — Astro ships zero client-side JavaScript by default; interactive components are sprinkled in with `<script>` islands
- **Bilingual** — English & Indonesian, switched client-side with a single toggle
- **Dark & Light themes** — persisted to `localStorage`, CSS custom properties throughout
- **Multi-step contact form** — 4-step wizard that composes a WhatsApp message via `wa.me` redirect
- **SEO-first** — JSON-LD Person schema, Open Graph, Twitter cards, sitemap, canonical URLs
- **Lighthouse 98/100/100/100** — Performance, Accessibility, Best Practices, SEO (with HTTPS)
- **Deployed on Vercel** — edge-optimized, HTTPS by default, zero-config

## ✦ Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | [Astro](https://astro.build) 6.x (static output) |
| Styling | Scoped CSS + CSS custom properties |
| Fonts | [Plus Jakarta Sans](https://fontsource.org/fonts/plus-jakarta-sans) & [JetBrains Mono](https://fontsource.org/fonts/jetbrains-mono) via Fontsource |
| SEO | [astro-seo](https://github.com/codiumne/orlando-astro-seo), JSON-LD, OG/Twitter meta |
| Analytics | [GoatCounter](https://goatcounter.com) (privacy-respecting, no cookies) |
| Build | pnpm |
| Hosting | [Vercel](https://vercel.com) (Astro adapter, edge-optimized) |

## ✦ Project Structure

```
src/
├── assets/          # Profile image (optimized by Astro)
├── components/      # 15 Astro island components
│   ├── Nav.astro          # Fixed navbar + theme + lang toggle
│   ├── Hero.astro         # Full-viewport hero with blobs & photo
│   ├── Work.astro         # Project cards with spotlight effect
│   ├── WorkCard.astro     # Individual project card
│   ├── Experience.astro   # Timeline section
│   ├── TimelineEntry.astro
│   ├── About.astro        # Manifesto + fun fact cards
│   ├── FunCard.astro
│   ├── Contact.astro      # Multi-step wizard form
│   ├── Footer.astro
│   ├── ScrollReveal.astro # IntersectionObserver animations
│   └── *Scripts.astro     # Client-side island scripts
├── data/
│   └── i18n.ts            # 117 translation keys × 2 languages
├── layouts/
│   └── Layout.astro       # Base layout with SEO, fonts, JSON-LD, analytics
├── pages/
│   ├── index.astro        # Single-page composition
│   └── robots.txt.ts      # API route for robots.txt
└── styles/
    └── global.css         # Theme tokens, base resets, keyframe animations
```

## ✦ Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## ✦ Deployment

This site is built as static HTML and deployed to a Proxmox homeserver. To deploy:

1. Run `pnpm build` to generate the `dist/` directory
2. Copy `dist/` contents to your web server root
3. Configure reverse proxy (Caddy/Nginx) with HTTPS
4. Set proper cache headers for static assets

> The HTTPS and cache headers are handled at the reverse proxy level, which is why Lighthouse's Best Practices score shows 81 locally — it jumps to ~100 behind a proper HTTPS proxy.

## ✦ License

This is a personal portfolio. The code is available for reference and inspiration, but the design, content, and branding are mine. Please don't copy it verbatim — build your own thing. That's the whole point.

<div align="center">

---

*Built with ☕ and 🍕 by [Ikhwan](https://ikhwanulhakim.dev)*

</div>
