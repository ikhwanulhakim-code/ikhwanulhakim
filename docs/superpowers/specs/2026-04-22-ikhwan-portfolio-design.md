# ikhwanulhakim.dev Portfolio — Design Spec

**Date**: 2026-04-22
**Source**: Claude Design prototype (`project/ikhwan-portfolio.html`)
**Target**: Astro 5.x static site, self-hosted on Proxmox

## Summary

Recreate the Claude Design prototype as a production Astro site — pixel-perfect visual output, SEO-optimized, lightweight (sub-10KB JS), self-hosted on a Proxmox homeserver with Caddy/Nginx reverse proxy.

## Architecture

### Framework & Tooling

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | Astro 5.x (static output) | Zero JS by default, island architecture, built-in SSG, best Lighthouse scores |
| Styling | Scoped CSS in `.astro` components | Prototype has 860 lines of hand-crafted CSS with custom properties, `color-mix()`, complex animations — no utility-class framework needed |
| Fonts | `@fontsource/plus-jakarta-sans` + `@fontsource/jetbrains-mono` (self-hosted) | No external Google Fonts request → faster FCP, privacy-friendly, works offline |
| SEO | `astro-seo` + `@astrojs/sitemap` | Declarative meta/OG/Twitter tags, auto-generated sitemap |
| Analytics | GoatCounter (self-hosted or managed) | Privacy-respecting, lightweight (~3KB), free tier |
| Build | Astro static output → folder of HTML/CSS/JS files | Served directly by Caddy/Nginx on Proxmox |
| Package manager | pnpm | Fast, disk-efficient |

### Deployment

- Static files built by `astro build` → `dist/` directory
- Served via Caddy or Nginx on Proxmox homeserver
- HTTPS via Let's Encrypt or Cloudflare Tunnel
- Domain: `ikhwanulhakim.dev`

### Hydration Strategy

Only 5 scripts need client-side JS (all `client:load`):

1. **NavScripts** — scroll detection (nav blur), theme toggle (dark/light + localStorage)
2. **I18nScripts** — language toggle (ID/EN + localStorage), DOM updates via `data-i18n` attributes
3. **ContactScripts** — multi-step form state machine, step navigation, WhatsApp redirect
4. **WorkScripts** — mousemove spotlight effect on work cards (CSS custom properties `--mx`/`--my`)
5. **ScrollReveal** — IntersectionObserver for `.reveal` → `.in` class toggle

Everything else is pure HTML/CSS — zero JS shipped.

## Component Structure

```
src/
├── layouts/
│   └── Layout.astro              # <html>, <head>, SEO meta via astro-seo, font imports
├── components/
│   ├── Nav.astro                  # Fixed nav: logo, links, lang toggle, theme toggle
│   ├── NavScripts.astro          # client:load — scroll blur, theme persistence
│   ├── Hero.astro                # Full-viewport hero: grid bg, blobs, photo, CTAs, socials
│   ├── Work.astro                # Section wrapper with eyebrow + grid
│   ├── WorkCard.astro            # Single project card (props: title, desc, tags, status, etc.)
│   ├── WorkScripts.astro         # client:load — mousemove spotlight
│   ├── Experience.astro          # Timeline section wrapper
│   ├── TimelineEntry.astro       # Single entry (props: when, company, role, desc, chip)
│   ├── About.astro               # Manifesto + fun fact grid
│   ├── FunCard.astro             # Single fun fact card (props: label, icon, text)
│   ├── Contact.astro             # Multi-step wizard form shell
│   ├── ContactScripts.astro     # client:load — form state, step nav, WhatsApp redirect
│   ├── Footer.astro              # Footer with socials
│   ├── I18nScripts.astro        # client:load — lang toggle, localStorage, DOM updates
│   └── ScrollReveal.astro       # client:load — IntersectionObserver
├── data/
│   └── i18n.ts                   # Typed translations: Record<Lang, Record<string, string>>
├── pages/
│   └── index.astro               # Single page composing all sections
├── assets/
│   └── ikhwan.png                # Profile photo (optimized by Astro)
├── public/
│   ├── favicon.svg               # Lime dot favicon
│   └── og-image.png              # Open Graph share image (1200×630)
└── astro.config.mjs
```

### Component Props

**WorkCard.astro**:
- `num: string` — "Project 01 / 04"
- `title: string` — project name
- `desc: string` — description
- `tags: Array<{ label: string; color: string }>` — tag list with color variant
- `status: { label: string; live: boolean }` — status badge
- `revealText: string` — hover reveal text
- `size: 'big' | 'small'` — grid span
- `decoSvg` slot — decorative SVG content injected via Astro `<slot name="deco" />`

**TimelineEntry.astro**:
- `when: string` — date range
- `company: string` — company/label
- `role: string` — job title
- `desc: string` — description
- `chip?: { label: string; variant: 'current' | 'sabbatical' }` — optional chip badge
- `isGap?: boolean` — uses amber accent instead of lime

**FunCard.astro**:
- `label: string` — "Fact · 01"
- `icon: string` — emoji
- `text: string` — description

## SEO

### Meta Tags (via `astro-seo`)

```astro
<SEO
  title="Muhammad Ikhwanul Hakim — Software Engineer & Project Manager"
  titleTemplate="%s | ikhwanulhakim.dev"
  description="Software Engineer & Project Manager based in Indonesia. I take your idea from napkin sketch to production — clean code, real delivery, zero fluff."
  canonical={canonicalURL}
  openGraph={{
    basic: { title, type: "website", image: "/og-image.png", url: canonicalURL },
    optional: { siteName: "ikhwanulhakim.dev", locale: "id_ID", localeAlternate: ["en_US"] },
    image: { width: 1200, height: 630, alt: "Muhammad Ikhwanul Hakim — Software Engineer" }
  }}
  twitter={{
    card: "summary_large_image",
    title, description, image: "/og-image.png"
  }}
  languageAlternates={[
    { href: canonicalURL, hrefLang: "id" },
    { href: canonicalURL, hrefLang: "en" }
  ]}
  extend={{
    meta: [
      { name: "theme-color", content: "#7AC000" },
      { name: "author", content: "Muhammad Ikhwanul Hakim" }
    ],
    link: [
      { rel: "sitemap", href: "/sitemap-index.xml" }
    ]
  }}
/>
```

### Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Muhammad Ikhwanul Hakim",
  "url": "https://ikhwanulhakim.dev",
  "jobTitle": "Software Engineer & Project Manager",
  "address": { "@type": "PostalAddress", "addressCountry": "ID" },
  "sameAs": [
    "https://www.instagram.com/ikhwanulhakim.me/",
    "https://www.linkedin.com/in/ikhwanulhakimm/"
  ]
}
```

### Sitemap & Robots

- `@astrojs/sitemap` generates `sitemap-index.xml` automatically
- `robots.txt` generated via Astro API route or static file:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://ikhwanulhakim.dev/sitemap-index.xml
  ```

## i18n

### Data Structure

```typescript
// src/data/i18n.ts
export type Lang = 'id' | 'en';

export const translations: Record<Lang, Record<string, string>> = {
  id: { /* ~120 keys matching the prototype */ },
  en: { /* ~120 keys matching the prototype */ }
};
```

### Client-Side Mechanism

- HTML elements use `data-i18n`, `data-i18n-html`, `data-i18n-ph` attributes (same as prototype)
- `I18nScripts.astro` reads translations from a `<script type="application/json" id="i18n-data">` tag embedded by the server
- On toggle: updates DOM, persists to `localStorage`, updates `<html lang>`
- Initial load: reads `localStorage` preference, defaults to `id`

### Server-Side Rendering

- The page renders with the default language (`id`) in the HTML
- Client-side JS handles the toggle — no server round-trip needed
- All translations are inlined as JSON in the HTML for instant client access

## Contact Form

### State Machine

```
Step 1 (type) → Step 2 (stage) → Step 3 (budget) → Step 4 (details) → WhatsApp redirect → Success
```

### Behavior

- Steps 1-3: Pill/button selection (single choice per step). Auto-advances after 280ms delay on selection.
- Step 4: Textarea + two text inputs. "Continue" button enabled only when all 3 fields have content.
- Final submit: Constructs WhatsApp message with form data, opens `wa.me/6289691964368?text=...` in new tab.
- After redirect: Shows success state (step 5), hides nav buttons and progress bar.
- Back button: Returns to previous step, preserves state.

### WhatsApp Message Format

```
Halo Ikhwan! 👋

*Tipe proyek:* Web App
*Tahap:* Sudah ada spek — tinggal dibangun
*Budget:* 5 – 20 juta

*Deskripsi:*
[brief text]

*Nama:* [name]
*Kontak:* [contact]
```

Language of labels matches current `lang` setting.

## Animations & Interactions

All animations are carried over from the prototype:

| Animation | Type | Trigger |
|-----------|------|---------|
| Scroll reveal | JS (IntersectionObserver) | Element enters viewport |
| Nav blur + shrink | JS (scroll listener) | `scrollY > 30` |
| Hero blob breathing | CSS `@keyframes breathe` | Continuous (9s/11s) |
| Photo frame border spin | CSS `@keyframes spin` | Continuous (40s) |
| Sticker float | CSS `@keyframes float` | Continuous (6s) |
| Badge pulse | CSS `@keyframes pulse` | Continuous (2s) |
| Work card spotlight | JS (mousemove) + CSS custom props | Hover |
| Work card hover reveal | CSS `max-height` transition | Hover |
| Work card lift | CSS `transform: translateY(-4px)` | Hover |
| Fun card tilt | CSS `transform: rotate(-0.6deg)` | Hover |
| Form step slide-in | CSS `@keyframes stepIn` | Step change |
| Success check pop | CSS `@keyframes pop` + `draw` | Form submit |
| Theme transition | CSS `transition: 320ms ease` | Toggle |
| Underline sweep | CSS `@keyframes underline` | Continuous (3s) |

## Theme System

Two themes via `data-theme` attribute on `<html>`:

- **Light**: `--bg: #FAFAFA`, `--lime: #7AC000`, card shadows present
- **Dark**: `--bg: #0F0F0F`, `--lime: #AAFF00`, no card shadows

All 15+ CSS custom properties swap via the attribute. Theme persisted in `localStorage`. Default: light.

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 100 |
| Lighthouse SEO | 100 |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 100 |
| First Contentful Paint | < 1s |
| Largest Contentful Paint | < 1.5s |
| Total JS shipped | < 10KB |
| Total CSS | < 12KB |
| Image (profile photo) | WebP/AVIF via Astro image optimization |

## File Weight Budget

| Resource | Budget |
|----------|--------|
| HTML | < 20KB |
| CSS (total) | < 12KB |
| JS (total, hydrated) | < 10KB |
| Profile image | < 100KB (optimized) |
| OG image | < 200KB |
| Fonts (2 families, 4 weights) | ~60KB (self-hosted, cached) |

## Out of Scope

- Blog or CMS integration
- CMS-driven content (all content is hardcoded in components/i18n data)
- Server-side API or database
- Email-based form submission
- Internationalized routing (`/en/`, `/id/` paths) — single page with client-side toggle
- PWA/service worker (future consideration)
- Image gallery for portfolio projects

## Dependencies

```json
{
  "dependencies": {
    "astro": "^5.x",
    "@astrojs/sitemap": "latest",
    "astro-seo": "latest",
    "@fontsource/plus-jakarta-sans": "latest",
    "@fontsource/jetbrains-mono": "latest"
  },
  "devDependencies": {
    "typescript": "^5.x"
  }
}
```

No CSS framework. No UI component library. No runtime framework (React, Vue, etc.).
