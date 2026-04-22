# ikhwanulhakim.dev Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production Astro 5.x portfolio site for Muhammad Ikhwanul Hakim, pixel-perfect recreation of the Claude Design prototype, SEO-optimized and lightweight (<10KB JS), self-hosted on Proxmox.

**Architecture:** Astro 5.x with static output, island architecture for hydration (only 5 interactive scripts), scoped CSS in components (no framework), self-hosted fonts via @fontsource, astro-seo + @astrojs/sitemap for SEO, GoatCounter for analytics.

**Tech Stack:** Astro 5.x, TypeScript, @fontsource, astro-seo, @astrojs/sitemap, GoatCounter, pnpm

---

## File Structure

```
src/
├── layouts/
│   └── Layout.astro              # Base HTML shell, <head>, SEO meta, fonts, JSON-LD
├── components/
│   ├── Nav.astro                  # Fixed nav bar (pure HTML/CSS)
│   ├── NavScripts.astro          # client:load — scroll blur, theme toggle
│   ├── ThemeIcons.astro          # SVG icons for sun/moon
│   ├── Hero.astro                # Full hero section with blobs, grid, photo, CTAs
│   ├── Work.astro                # Work section wrapper
│   ├── WorkCard.astro            # Single project card component
│   ├── WorkScripts.astro         # client:load — spotlight mousemove
│   ├── Experience.astro          # Experience timeline section
│   ├── TimelineEntry.astro       # Single timeline entry
│   ├── About.astro               # About section with manifesto + fun cards
│   ├── FunCard.astro             # Single fun fact card
│   ├── Contact.astro             # Multi-step wizard form
│   ├── ContactScripts.astro     # client:load — form state, WhatsApp redirect
│   ├── Footer.astro              # Footer with socials
│   ├── I18nScripts.astro        # client:load — lang toggle, DOM updates
│   └── ScrollReveal.astro       # client:load — IntersectionObserver
├── data/
│   └── i18n.ts                   # Typed translations Record<Lang, Record<string, string>>
├── pages/
│   ├── index.astro               # Single page composing all sections
│   └── robots.txt.ts             # API route for robots.txt
├── assets/
│   └── ikhwan.png                # Profile photo
├── public/
│   ├── favicon.svg               # Lime dot favicon
│   └── og-image.png              # Open Graph share image (1200×630)
├── astro.config.mjs
└── tsconfig.json
```

---

### Task 1: Project Scaffolding & Dependencies

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `public/favicon.svg`

- [ ] **Step 1: Initialize Astro project**

Run from the project root (but outside the `project/` and `docs/` subdirs — the Astro source lives at the repo root):

```bash
cd /Users/macbookpro/Development/ikhwanulhakim.dev
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

If prompted about existing files, choose to overwrite/merge.

- [ ] **Step 2: Install dependencies**

```bash
pnpm add astro-seo @astrojs/sitemap @fontsource/plus-jakarta-sans @fontsource/jetbrains-mono
```

- [ ] **Step 3: Configure astro.config.mjs**

Replace the generated `astro.config.mjs` with:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ikhwanulhakim.dev',
  output: 'static',
  integrations: [sitemap()],
  compressHTML: true,
});
```

- [ ] **Step 4: Create favicon.svg**

Write to `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#7AC000"/>
</svg>
```

- [ ] **Step 5: Copy profile photo to src/assets**

```bash
cp /Users/macbookpro/Development/ikhwanulhakim.dev/project/assets/ikhwan.png /Users/macbookpro/Development/ikhwanulhakim.dev/src/assets/ikhwan.png
```

- [ ] **Step 6: Verify dev server starts**

```bash
pnpm dev
```

Expected: Astro dev server starts at `localhost:4321` with no errors. Kill it after verifying.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project with dependencies and config"
```

---

### Task 2: Global Styles & Theme Tokens

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create global stylesheet with all CSS custom properties and resets**

Write to `src/styles/global.css` — this contains the theme tokens and base resets extracted from the prototype. All component-specific styles live in each component's scoped `<style>` tag, but the custom properties and shared utilities need to be global:

```css
:root[data-theme="dark"] {
  --bg: #0F0F0F;
  --bg-2: #151515;
  --bg-3: #1C1C1C;
  --card: #1A1A1A;
  --card-hover: #202020;
  --line: #262626;
  --line-2: #333333;
  --text: #F5F5F0;
  --text-soft: #bdbdb7;
  --muted: #8A8A82;
  --lime: #AAFF00;
  --lime-hover: #C0FF3A;
  --lime-ink: #0a0a0a;
  --coral: #FF7A66;
  --sky: #7DD3FC;
  --amber: #FBBF24;
  --violet: #C4B5FD;
  --grid-line: rgba(255,255,255,0.03);
  --grid-line-2: rgba(255,255,255,0.05);
  --noise-opacity: 0.035;
  --nav-bg: rgba(15, 15, 15, 0.78);
  --card-shadow: none;
}
:root[data-theme="light"] {
  --bg: #FAFAFA;
  --bg-2: #FFFFFF;
  --bg-3: #F3F3EE;
  --card: #FFFFFF;
  --card-hover: #FFFFFF;
  --line: #E8E8E2;
  --line-2: #D4D4CE;
  --text: #111111;
  --text-soft: #3a3a36;
  --muted: #6E6E66;
  --lime: #7AC000;
  --lime-hover: #6BAA00;
  --lime-ink: #FFFFFF;
  --coral: #E55A42;
  --sky: #0EA5E9;
  --amber: #D97706;
  --violet: #7C3AED;
  --grid-line: rgba(0,0,0,0.04);
  --grid-line-2: rgba(0,0,0,0.06);
  --noise-opacity: 0.025;
  --nav-bg: rgba(250, 250, 250, 0.8);
  --card-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.08);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  transition: background 320ms ease, color 320ms ease;
}
::selection { background: var(--lime); color: var(--lime-ink); }
.mono { font-family: 'JetBrains Mono', ui-monospace, monospace; letter-spacing: -0.01em; }

@keyframes breathe {
  0%, 100% { transform: translate(0,0) scale(1); opacity: 0.85; }
  50% { transform: translate(30px,-20px) scale(1.08); opacity: 1; }
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--lime) 70%, transparent); }
  70% { box-shadow: 0 0 0 10px color-mix(in oklab, var(--lime) 0%, transparent); }
  100% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--lime) 0%, transparent); }
}
@keyframes underline { to { transform: scaleX(1); } }
@keyframes stepIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { from { transform: scale(0.2); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes draw { to { stroke-dashoffset: 0; } }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global CSS with theme tokens and keyframe animations"
```

---

### Task 3: i18n Data Module

**Files:**
- Create: `src/data/i18n.ts`

- [ ] **Step 1: Create typed i18n translations file**

Write to `src/data/i18n.ts` — all ~120 keys for both languages, extracted verbatim from the prototype's `I18N` object (lines 1300-1558 of `ikhwan-portfolio.html`):

```typescript
export type Lang = 'id' | 'en';

export const translations: Record<Lang, Record<string, string>> = {
  id: {
    'nav.work': 'Karya',
    'nav.experience': 'Perjalanan',
    'nav.about': 'Tentang Saya',
    'nav.cta': 'Ngobrol Yuk',
    'hero.badge': '🟢 Buka untuk proyek baru · Indonesia',
    'hero.title': 'Saya bangun software.<br/>Saya <span class="ship">launch</span> produk.',
    'hero.sub': 'Software Engineer & Project Manager. Dari ide di kertas sampai live di production — saya yang urus semuanya. Kode rapi, hasil nyata.',
    'hero.cta1': 'Yuk Ngobrol',
    'hero.cta2': 'Lihat Karya Saya',
    'hero.sticker1': 'Lagi ngoding',
    'hero.sticker2': 'Lagi makan pizza',
    'work.eyebrow': 'Karya Terpilih',
    'work.title': 'Yang sudah saya <em>kirim</em> <br/>(dan beberapa yang masih matang)',
    'work.lede': 'Empat proyek, empat stack, empat peran berbeda. Beberapa sudah live, beberapa masih NDA — intip salah satunya.',
    'status.live': 'Live',
    'status.live2': 'Live',
    'status.confidential': '🔒 Rahasia',
    'status.confidential2': '🔒 Rahasia',
    'work.c1.title': 'Ankrah Studios — Website v3.0',
    'work.c1.desc': 'Redesign total website sebuah creative studio — mulai dari ngorek kebutuhan klien sampai deploy ke production.',
    'work.c1.t1': 'Web Dev',
    'work.c1.t2': 'Project Lead',
    'work.c1.t3': 'Client Relations',
    'work.c1.reveal': 'Pegang semuanya — discovery, desain, build, sampai launch.',
    'work.c2.title': 'CLINICALGo Patient App',
    'work.c2.desc': 'Aplikasi Flutter lintas platform untuk booking janji pasien, rekam riwayat, dan kelola membership klinik.',
    'work.c2.reveal': 'Sudah tayang di App Store dan Play Store.',
    'work.c3.title': 'ERPGo — ERP Multi-modul',
    'work.c3.desc': '7+ modul: Sales, Pengadaan, HR, Keuangan, dan lainnya. Dirancang khusus untuk UKM Indonesia.',
    'work.c3.t2': 'PM',
    'work.c3.t3': 'Multi-modul',
    'work.c3.reveal': 'Koordinasi delivery lintas tim di semua modul.',
    'work.c4.title': 'Kashvo — Aplikasi Keuangan Offline',
    'work.c4.desc': 'PWA keuangan pribadi yang tetap jalan walau tanpa sinyal. Catat pemasukan, pengeluaran, dan anggaran kapan saja.',
    'work.c4.t2': 'Offline-first',
    'work.c4.t3': 'Web App',
    'work.c4.t4': 'Keuangan',
    'work.c4.reveal': 'Service worker, IndexedDB, UI yang nggak pernah loading muter-muter.',
    'exp.eyebrow': 'Perjalanan Karier',
    'exp.title': 'Resume yang <em>apa adanya</em>.',
    'exp.lede': 'Tanpa jargon lebay. Ini yang beneran saya kerjakan dan yang beneran saya pelajari.',
    'exp.chip.current': 'sekarang',
    'exp.chip.sabbatical': 'jeda',
    'exp.e1.when': 'Sep 2025 — Sekarang',
    'exp.e1.role': 'Software Engineer',
    'exp.e1.desc': 'Melamar sebagai PM, berakhir jadi SE karena tim lebih butuh yang bisa ngoding. Adaptasi cepat itu juga skill — dan hasilnya, kodenya jadi lebih bagus.',
    'exp.e2.when': 'Jul — Agu 2025',
    'exp.e2.company': 'Masa Pengangguran Produktif',
    'exp.e2.role': 'Istirahat yang disengaja',
    'exp.e2.desc': 'Belajar bikin pizza dari nol. Pasang homeserver Proxmox. Balik kerja lebih segar, lebih tajam, dan kenyang.',
    'exp.e3.when': 'Des 2024 — Jun 2025',
    'exp.e3.role': 'Project Manager',
    'exp.e3.desc': 'Pegang delivery lintas platform — ERP, sistem pemerintahan, aplikasi klinis, sampai portal admin. Lebih dari 5 produk jalan bersamaan. PRD, sprint, UAT, stakeholder — semua saya yang urus.',
    'exp.e4.when': 'Okt 2023 — Nov 2024',
    'exp.e4.role': 'Programmer — Mobile + QA',
    'exp.e4.desc': 'Dev Flutter untuk iOS & Android, sambil rangkap jadi QA. Soalnya harus ada yang jaga kualitasnya, dan ternyata itu saya.',
    'about.eyebrow': 'Tentang Saya',
    'about.title': 'Builder, PM, <em>tukang pizza</em>.',
    'about.p1': 'Saya software engineer sekaligus project manager yang percaya bahwa <span class="hl">produk bagus lahir dari tim yang solid</span>. Sama betahnya di depan terminal maupun di ruang meeting klien.',
    'about.p2': 'Sudah pernah kirim sistem ERP, aplikasi mobile, platform pemerintahan, sampai SaaS buatan sendiri. Bukan cuma bisa ngoding — saya ngerti seluruh perjalanannya, dari ide mentah sampai live di tangan pengguna.',
    'about.sig': '// masih belajar, terus ngirim',
    'about.fact': 'Fakta · 01',
    'about.fact2': 'Fakta · 02',
    'about.fact3': 'Fakta · 03',
    'about.fact4': 'Fakta · 04',
    'about.f1': 'Bikin pizza dari nol, dan rasanya emang beneran enak. Ada foto buktinya.',
    'about.f2': 'Suka kucing. Tidak perlu alasan lebih lanjut.',
    'about.f3': 'Website ini jalan di laptop Infinix lama lewat Proxmox. Serius. Dan masih hidup sampai sekarang.',
    'about.f4': 'Pernah jadi PM, selalu jadi builder.',
    'contact.eyebrow': 'Hubungi Saya',
    'contact.title': 'Ada proyek yang <em>kepingin</em> dibangun?',
    'contact.lede': 'Ceritain sedikit — 3 pertanyaan singkat, saya janji. Abis itu satu textarea doang.',
    'q1.title': 'Butuh apa nih?',
    'q1.hint': 'Pilih yang paling mendekati — nanti bisa kita sesuaikan.',
    'q1.a1': 'Aplikasi Mobile',
    'q1.a2': 'Web App',
    'q1.a3': 'SaaS / Platform',
    'q1.a4': 'ERP / Enterprise',
    'q1.a5': 'Ada yang lain',
    'q2.title': 'Sudah sampai mana?',
    'q2.hint': 'Nggak ada jawaban yang salah. Beneran.',
    'q2.a1': 'Baru ada ide — tolong bantu scope-nya',
    'q2.a2': 'Sudah ada spek — tinggal dibangun',
    'q2.a3': 'Produk sudah jalan — perlu ditingkatkan',
    'q2.a4': 'Harusnya sudah selesai kemarin',
    'q3.title': 'Kira-kira budgetnya?',
    'q3.hint': 'Perkiraan kasar juga oke. Kita cari yang realistis bareng-bareng.',
    'q3.a1': 'Di bawah 5 juta',
    'q3.a2': '5 – 20 juta',
    'q3.a3': '20 – 50 juta',
    'q3.a4': 'Mending ngobrol dulu',
    'q4.title': 'Hampir selesai — siapa dan apa.',
    'q4.hint': 'Yang penting-penting aja. Nggak perlu panjang-panjang.',
    'q4.l.brief': 'Ceritain proyeknya',
    'q4.ph.brief': 'Mau bikin apa? Untuk siapa? Masalah apa yang mau diselesaikan?',
    'q4.l.name': 'Nama kamu',
    'q4.ph.name': 'misal: Budi Santoso',
    'q4.l.contact': 'WhatsApp atau Email',
    'q4.ph.contact': '+62 atau kamu@email.com',
    'form.back': '← Kembali',
    'form.next': 'Lanjut →',
    'form.send': 'Kirim lewat WhatsApp',
    'success.title': 'Membuka WhatsApp…',
    'success.sub': 'Saya balas paling lama 24 jam. Biasanya jauh lebih cepat dari itu.',
    'fallback.tiny': 'Mau langsung hubungi? Silakan pilih.',
    'footer.line': 'Didesain & dibangun sendiri oleh <b>Ikhwan</b>. Self-hosted di laptop bekas. <span style="color: var(--lime);">Masih nyala.</span>'
  },
  en: {
    'nav.work': 'Work',
    'nav.experience': 'Experience',
    'nav.about': 'About',
    'nav.cta': "Let's Talk",
    'hero.badge': '🟢 Open to new projects · based in Indonesia',
    'hero.title': 'I build software.<br/>I <span class="ship">ship</span> products.',
    'hero.sub': 'Software Engineer & Project Manager. I take your idea from a napkin sketch to production — clean code, real delivery, zero fluff.',
    'hero.cta1': "Let's Work Together",
    'hero.cta2': 'See My Work',
    'hero.sticker1': 'Shipping code',
    'hero.sticker2': 'Eating pizza',
    'work.eyebrow': 'Selected Work',
    'work.title': "Things I've <em>shipped</em> <br/>(and a few I'm still cooking)",
    'work.lede': 'Four projects, four different stacks, four different hats worn. Some are live, some are under NDA — pick one to peek inside.',
    'status.live': 'Live',
    'status.live2': 'Live',
    'status.confidential': '🔒 Confidential',
    'status.confidential2': '🔒 Confidential',
    'work.c1.title': 'Ankrah Studios — Website v3.0',
    'work.c1.desc': "Complete redesign of a creative studio's digital presence — from requirements gathering through production deployment.",
    'work.c1.t1': 'Web Dev',
    'work.c1.t2': 'Project Lead',
    'work.c1.t3': 'Client Relations',
    'work.c1.reveal': 'End-to-end ownership — discovery, design sign-off, build, launch.',
    'work.c2.title': 'CLINICALGo Patient App',
    'work.c2.desc': 'Cross-platform Flutter app for patient appointment booking, history, and clinic memberships.',
    'work.c2.reveal': 'Shipped to production on both stores.',
    'work.c3.title': 'ERPGo — Multi-module ERP',
    'work.c3.desc': '7+ modules: Sales, Procurement, HR, Finance, and more. Built for Indonesian SMEs.',
    'work.c3.t2': 'PM',
    'work.c3.t3': 'Multi-module',
    'work.c3.reveal': 'Led cross-functional delivery across all modules.',
    'work.c4.title': 'Kashvo — Offline-first Finance PWA',
    'work.c4.desc': 'Personal finance PWA with full offline support. Track income, expenses, and budgets — works even without internet.',
    'work.c4.t2': 'Offline-first',
    'work.c4.t3': 'Web App',
    'work.c4.t4': 'Finance',
    'work.c4.reveal': 'Service workers, IndexedDB, and a UI that never spins.',
    'exp.eyebrow': 'Experience',
    'exp.title': 'The <em>honest</em> resume.',
    'exp.lede': "No buzzwords. Here's what I actually did, and what I actually learned.",
    'exp.chip.current': 'current',
    'exp.chip.sabbatical': 'sabbatical',
    'exp.e1.when': 'Sep 2025 — Present',
    'exp.e1.role': 'Software Engineer',
    'exp.e1.desc': 'Applied as PM. Ended up as SE because the team needed builders. Adapting fast is a skill too — and the code is better for it.',
    'exp.e2.when': 'Jul — Aug 2025',
    'exp.e2.company': 'The Productive Unemployment Era',
    'exp.e2.role': 'Self-directed interlude',
    'exp.e2.desc': 'Learned pizza-making from scratch. Set up a Proxmox homeserver. Came back sharper and well-fed.',
    'exp.e3.when': 'Dec 2024 — Jun 2025',
    'exp.e3.role': 'Project Manager',
    'exp.e3.desc': 'Led delivery across ERP, government, clinical, and admin platforms. 5+ concurrent products. PRDs, sprints, UAT, stakeholders — all of it.',
    'exp.e4.when': 'Oct 2023 — Nov 2024',
    'exp.e4.role': 'Programmer — Mobile + QA',
    'exp.e4.desc': 'Flutter dev for iOS & Android. Wore the QA hat too. Because someone had to, and it turns out that someone was me.',
    'about.eyebrow': 'About',
    'about.title': 'Builder, PM, <em>pizzaiolo</em>.',
    'about.p1': "I'm a software engineer and project manager who believes <span class=\"hl\">great products come from great teamwork</span>. Equally comfortable in a terminal and a client meeting.",
    'about.p2': "I've shipped ERP systems, mobile apps, government platforms, and my own SaaS. I'm not just a coder — I understand the whole journey from idea to launch.",
    'about.sig': '// still learning, still shipping',
    'about.fact': 'Fact · 01',
    'about.fact2': 'Fact · 02',
    'about.fact3': 'Fact · 03',
    'about.fact4': 'Fact · 04',
    'about.f1': "I make pizza from scratch. It slaps. There's photo evidence.",
    'about.f2': 'I love cats. No further explanation will be provided.',
    'about.f3': 'This site runs on my old Infinix laptop via Proxmox. Yes, really. It works.',
    'about.f4': 'Once a PM, always a builder.',
    'contact.eyebrow': "Let's Talk",
    'contact.title': 'Got a project in <em>mind</em>?',
    'contact.lede': 'Tell me a little about it — 3 quick questions, I promise. Then one textarea.',
    'q1.title': 'What do you need?',
    'q1.hint': 'Pick the closest one — we can refine later.',
    'q1.a1': 'Mobile App',
    'q1.a2': 'Web App',
    'q1.a3': 'SaaS / Platform',
    'q1.a4': 'ERP / Enterprise',
    'q1.a5': 'Something else',
    'q2.title': 'Where are you at?',
    'q2.hint': 'No wrong answers. Really.',
    'q2.a1': 'Just an idea — help me scope it',
    'q2.a2': 'I have specs — need someone to build',
    'q2.a3': 'Existing product — needs improvement',
    'q2.a4': 'I needed it yesterday',
    'q3.title': 'Budget ballpark?',
    'q3.hint': "Rough is fine. We'll figure out what's realistic together.",
    'q3.a1': 'Under 5 juta',
    'q3.a2': '5 – 20 juta',
    'q3.a3': '20 – 50 juta',
    'q3.a4': "Let's talk about it",
    'q4.title': 'Last bit — who & what.',
    'q4.hint': "The important stuff. No word count anxiety.",
    'q4.l.brief': 'Describe your project briefly',
    'q4.ph.brief': "What are you trying to build? Who's it for? What's the big unlock?",
    'q4.l.name': 'Your name',
    'q4.ph.name': 'e.g. Budi Santoso',
    'q4.l.contact': 'WhatsApp or Email',
    'q4.ph.contact': '+62 or you@email.com',
    'form.back': '← Back',
    'form.next': 'Continue →',
    'form.send': 'Send via WhatsApp',
    'success.title': 'Opening WhatsApp…',
    'success.sub': "I'll get back to you within 24 hours. Usually much sooner.",
    'fallback.tiny': 'Rather just reach out directly? No problem.',
    'footer.line': 'Designed & built by <b>Ikhwan</b>. Self-hosted on a repurposed laptop. <span style="color: var(--lime);">Still running.</span>'
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add src/data/i18n.ts
git commit -m "feat: add i18n translations for ID and EN"
```

---

### Task 4: Layout with SEO, Fonts & Structured Data

**Files:**
- Create: `src/layouts/Layout.astro`

- [ ] **Step 1: Create base layout**

Write to `src/layouts/Layout.astro`:

```astro
---
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@/styles/global.css';
import { SEO } from 'astro-seo';

const { title = 'Muhammad Ikhwanul Hakim — Software Engineer & Project Manager' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<html lang="id" data-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <SEO
    title={title}
    titleTemplate="%s | ikhwanulhakim.dev"
    description="Software Engineer & Project Manager based in Indonesia. I take your idea from a napkin sketch to production — clean code, real delivery, zero fluff."
    canonical={canonicalURL}
    openGraph={{
      basic: {
        title: 'Muhammad Ikhwanul Hakim — Software Engineer & Project Manager',
        type: 'website',
        image: new URL('/og-image.png', Astro.site).toString(),
        url: canonicalURL.toString()
      },
      optional: {
        siteName: 'ikhwanulhakim.dev',
        locale: 'id_ID',
        localeAlternate: ['en_US'],
        description: 'Software Engineer & Project Manager based in Indonesia. Clean code, real delivery, zero fluff.'
      },
      image: {
        width: 1200,
        height: 630,
        alt: 'Muhammad Ikhwanul Hakim — Software Engineer & Project Manager'
      }
    }}
    twitter={{
      card: 'summary_large_image',
      title: 'Muhammad Ikhwanul Hakim — Software Engineer & Project Manager',
      description: 'Software Engineer & Project Manager based in Indonesia. Clean code, real delivery, zero fluff.',
      image: new URL('/og-image.png', Astro.site).toString()
    }}
    languageAlternates={[
      { href: canonicalURL.toString(), hrefLang: 'id' },
      { href: canonicalURL.toString(), hrefLang: 'en' }
    ]}
    extend={{
      meta: [
        { name: 'theme-color', content: '#7AC000' },
        { name: 'author', content: 'Muhammad Ikhwanul Hakim' }
      ],
      link: [
        { rel: 'sitemap', href: '/sitemap-index.xml' }
      ]
    }}
  />
  <script type="application/ld+json" set:html={JSON.stringify({
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
  })} />
  <script data-goatcounter="https://ikhwanulhakim.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</head>
<body>
  <slot />
</body>
</html>
```

Note: The GoatCounter URL `ikhwanulhakim.goatcounter.com` should be updated to the actual GoatCounter account. The user will need to sign up and configure this.

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add base layout with SEO, fonts, JSON-LD, and analytics"
```

---

### Task 5: Nav Component + Scripts

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/NavScripts.astro`
- Create: `src/components/ThemeIcons.astro`

- [ ] **Step 1: Create Nav.astro**

Write to `src/components/Nav.astro` — the static HTML/CSS structure of the fixed nav:

```astro
---
import NavScripts from './NavScripts.astro';
---

<nav class="nav" id="nav">
  <a href="#top" class="nav-logo" aria-label="Home">
    <span class="dot"></span>
    <span>ikhwan<span class="muted-text">.dev</span></span>
  </a>
  <div class="nav-right">
    <a href="#work" class="navlink" data-i18n="nav.work">Karya</a>
    <a href="#experience" class="navlink" data-i18n="nav.experience">Perjalanan</a>
    <a href="#about" class="navlink" data-i18n="nav.about">Tentang Saya</a>
    <a href="#contact" class="cta" data-i18n="nav.cta">Ngobrol Yuk</a>

    <div class="lang-toggle" id="langToggle" role="group" aria-label="Language">
      <span class="slider"></span>
      <button data-lang="id" class="active">ID</button>
      <button data-lang="en">EN</button>
    </div>

    <button class="icon-btn" id="themeToggle" aria-label="Toggle theme" title="Toggle theme">
      <svg id="iconSun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="display:none">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
      <svg id="iconMoon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </button>
  </div>
</nav>

<NavScripts />

<style>
  .nav {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 18px 32px;
    display: flex; align-items: center; justify-content: space-between;
    transition: background 280ms ease, backdrop-filter 280ms ease, border-color 280ms ease, padding 280ms ease;
    border-bottom: 1px solid transparent;
  }
  .nav.scrolled {
    background: var(--nav-bg);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    border-bottom-color: var(--line);
    padding: 12px 32px;
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-weight: 700; letter-spacing: -0.02em; font-size: 16px;
    text-decoration: none; color: var(--text);
  }
  .nav-logo .dot {
    width: 10px; height: 10px; border-radius: 3px;
    background: var(--lime);
    box-shadow: 0 0 16px color-mix(in oklab, var(--lime) 55%, transparent);
    transition: transform 200ms ease;
  }
  .nav-logo:hover .dot { transform: rotate(45deg) scale(1.1); }
  .nav-logo .muted-text { color: var(--muted); }
  .nav-right { display: flex; gap: 6px; align-items: center; }
  .nav-right a.navlink {
    color: var(--text); text-decoration: none;
    font-size: 14px; font-weight: 500;
    padding: 8px 14px; border-radius: 999px;
    transition: background 180ms ease, color 180ms ease;
    white-space: nowrap;
  }
  .nav-right a.navlink:hover { background: color-mix(in oklab, var(--text) 7%, transparent); }
  .nav-right a.cta {
    background: var(--lime); color: var(--lime-ink);
    font-weight: 700; padding: 8px 16px; margin-left: 4px;
    text-decoration: none; border-radius: 999px; font-size: 14px;
    transition: background 180ms ease, transform 180ms ease;
    white-space: nowrap;
  }
  .nav-right a.cta:hover { background: var(--lime-hover); transform: translateY(-1px); }
  .icon-btn {
    width: 36px; height: 36px; border-radius: 999px;
    border: 1px solid var(--line-2); background: transparent;
    color: var(--text); cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    transition: background 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease;
    padding: 0; font: inherit;
  }
  .icon-btn:hover { border-color: var(--text); background: color-mix(in oklab, var(--text) 6%, transparent); transform: translateY(-1px); }
  .icon-btn svg { width: 16px; height: 16px; }
  .lang-toggle {
    display: inline-flex;
    border: 1px solid var(--line-2); border-radius: 999px;
    padding: 3px; margin-left: 6px;
    font-family: 'JetBrains Mono', monospace;
    position: relative;
  }
  .lang-toggle button {
    background: transparent; border: 0; cursor: pointer;
    padding: 5px 11px; font-size: 11px; font-weight: 500;
    color: var(--muted); border-radius: 999px;
    letter-spacing: 0.04em; transition: color 200ms ease;
    font-family: inherit; position: relative; z-index: 2;
  }
  .lang-toggle button.active { color: var(--lime-ink); }
  .lang-toggle .slider {
    position: absolute; top: 3px; left: 3px; bottom: 3px;
    width: calc(50% - 3px); background: var(--lime);
    border-radius: 999px;
    transition: transform 260ms cubic-bezier(.2,.8,.3,1);
    z-index: 1;
  }
  .lang-toggle.is-en .slider { transform: translateX(100%); }
  @media (max-width: 820px) {
    .nav { padding: 14px 16px; }
    .nav.scrolled { padding: 10px 16px; }
    .nav-right a.navlink { display: none; }
    .nav-right a.cta { display: none; }
  }
</style>
```

- [ ] **Step 2: Create NavScripts.astro**

Write to `src/components/NavScripts.astro` — client-side script for nav scroll behavior and theme toggle:

```astro
<script>
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 30) nav?.classList.add('scrolled');
    else nav?.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const iconSun = document.getElementById('iconSun') as SVGSVGElement;
  const iconMoon = document.getElementById('iconMoon') as SVGSVGElement;

  function applyTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (iconMoon && iconSun) {
      iconMoon.style.display = theme === 'light' ? 'block' : 'none';
      iconSun.style.display = theme === 'dark' ? 'block' : 'none';
    }
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    applyTheme(cur === 'light' ? 'dark' : 'light');
  });
</script>
```

- [ ] **Step 3: Verify nav renders in dev server**

```bash
pnpm dev
```

Open `localhost:4321`, check that nav bar appears at top with logo, links, and theme toggle. Scroll to verify blur effect. Toggle theme.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro src/components/NavScripts.astro
git commit -m "feat: add Nav component with scroll blur and theme toggle"
```

---

### Task 6: I18n Scripts (Client-Side Language Toggle)

**Files:**
- Create: `src/components/I18nScripts.astro`

- [ ] **Step 1: Create I18nScripts.astro**

Write to `src/components/I18nScripts.astro` — this reads translations from a JSON script tag embedded in the page and handles the ID/EN toggle:

```astro
---
import { translations } from '@/data/i18n';
---

<script define:vars={{ translations }} type="application/json" id="i18n-data">
</script>

<script>
  const dataEl = document.getElementById('i18n-data');
  if (!dataEl) throw new Error('i18n data not found');
  const I18N = JSON.parse(dataEl.textContent || '{}');

  let currentLang: string = localStorage.getItem('lang') || 'id';

  function applyLang(lang: string) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    const dict = I18N[lang];
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = (el as HTMLElement).dataset.i18n;
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = (el as HTMLElement).dataset.i18nHtml;
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = (el as HTMLElement).dataset.i18nPh;
      if (dict[key] != null) el.setAttribute('placeholder', dict[key]);
    });

    const tog = document.getElementById('langToggle');
    tog?.classList.toggle('is-en', lang === 'en');
    tog?.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

    updateSubmitLabel();
  }

  document.getElementById('langToggle')?.addEventListener('click', (e: Event) => {
    const btn = (e.target as Element).closest('button[data-lang]');
    if (!btn) return;
    applyLang((btn as HTMLElement).dataset.lang!);
  });

  function t(key: string): string { return I18N[currentLang]?.[key] || key; }

  function updateSubmitLabel() {
    const btnNextLabel = document.getElementById('btnNextLabel');
    const stepNumEl = document.getElementById('stepNum');
    if (!btnNextLabel || !stepNumEl) return;
    const step = parseInt(stepNumEl.textContent || '1');
    if (step >= 4) btnNextLabel.textContent = t('form.send');
    else btnNextLabel.textContent = t('form.next');
  }

  applyLang(currentLang);
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/I18nScripts.astro
git commit -m "feat: add i18n client-side language toggle scripts"
```

---

### Task 7: Hero Section

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Create Hero.astro**

Write to `src/components/Hero.astro` — the full hero section with grid bg, blobs, photo, CTAs, socials. This is the largest component. The scoped `<style>` contains all hero-specific CSS extracted from the prototype:

```astro
---
import { Image } from 'astro:assets';
import ikhwanImg from '@/assets/ikhwan.png';
---

<section class="hero" id="top">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="hero-noise" aria-hidden="true"></div>
  <div class="hero-blob" aria-hidden="true"></div>
  <div class="hero-blob two" aria-hidden="true"></div>

  <div class="hero-inner">
    <div class="hero-copy">
      <div class="badge reveal in">
        <span class="pulse"></span>
        <span data-i18n="hero.badge">🟢 Buka untuk proyek baru · Indonesia</span>
      </div>
      <h1 class="hero-title reveal delay-1 in" data-i18n-html="hero.title">
        Saya bangun software.<br/>Saya <span class="ship">launch</span> produk.
      </h1>
      <p class="hero-sub reveal delay-2 in" data-i18n="hero.sub">
        Software Engineer & Project Manager. Dari ide di kertas sampai live di production — saya yang urus semuanya. Kode rapi, hasil nyata.
      </p>
      <div class="hero-ctas reveal delay-3 in">
        <a href="#contact" class="btn btn-primary">
          <span data-i18n="hero.cta1">Yuk Ngobrol</span>
          <span class="arrow">→</span>
        </a>
        <a href="#work" class="btn btn-ghost" data-i18n="hero.cta2">Lihat Karya Saya</a>
      </div>
      <div class="socials reveal delay-4 in">
        <a href="https://www.instagram.com/ikhwanulhakim.me/" target="_blank" rel="noopener" aria-label="Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
        </a>
        <a href="https://www.linkedin.com/in/ikhwanulhakimm/" target="_blank" rel="noopener" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.78 0h4.37v1.92h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 7v7.46h-4.56V15.2c0-1.7-.03-3.9-2.38-3.9-2.38 0-2.74 1.86-2.74 3.78V22H8V8z"/></svg>
        </a>
        <a href="https://wa.me/6289691964368" target="_blank" rel="noopener" aria-label="WhatsApp">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5-1.3c1.5.8 3.2 1.3 5 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C3.9 14.9 3.5 13.5 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5S16.7 20 12 20z"/></svg>
        </a>
      </div>
    </div>

    <div class="hero-photo-col">
      <div class="photo-frame">
        <div class="photo-circle">
          <Image class="portrait" src={ikhwanImg} alt="Muhammad Ikhwanul Hakim" />
        </div>
        <div class="sticker s1">
          <span class="emoji">💻</span>
          <span data-i18n="hero.sticker1">Lagi ngoding</span>
        </div>
        <div class="sticker s2">
          <span class="emoji">🍕</span>
          <span data-i18n="hero.sticker2">Lagi makan pizza</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative; min-height: 100vh;
    display: flex; align-items: center;
    padding: 120px 32px 80px; overflow: hidden;
    background: var(--bg);
  }
  .hero-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(var(--grid-line) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
    background-size: 48px 48px; background-position: -1px -1px;
    mask-image: radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.9), transparent 72%);
    -webkit-mask-image: radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.9), transparent 72%);
    pointer-events: none;
  }
  .hero-noise {
    position: absolute; inset: 0;
    opacity: var(--noise-opacity); pointer-events: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  }
  .hero-blob {
    position: absolute; width: 620px; height: 620px;
    top: 10%; right: -120px;
    background: radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--lime) 22%, transparent), transparent 60%);
    filter: blur(40px); animation: breathe 9s ease-in-out infinite; pointer-events: none;
  }
  .hero-blob.two {
    width: 420px; height: 420px; top: auto; bottom: -80px; left: -80px; right: auto;
    background: radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--coral) 16%, transparent), transparent 60%);
    animation-duration: 11s; animation-delay: -3s;
  }
  .hero-inner {
    position: relative; z-index: 2; max-width: 1200px; width: 100%; margin: 0 auto;
    display: grid; grid-template-columns: 1.3fr 1fr; gap: 60px; align-items: center;
  }
  @media (max-width: 900px) {
    .hero-inner { grid-template-columns: 1fr; gap: 40px; }
    .hero-photo-col { order: -1; }
  }
  .badge {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 7px 14px 7px 12px; border: 1px solid var(--line-2);
    border-radius: 999px; background: color-mix(in oklab, var(--bg-2) 60%, transparent);
    backdrop-filter: blur(8px); font-size: 13px; font-weight: 500;
    margin-bottom: 28px; color: var(--text); white-space: nowrap; max-width: 100%;
  }
  .badge > span:last-child { overflow: hidden; text-overflow: ellipsis; }
  .badge .pulse {
    width: 8px; height: 8px; border-radius: 50%; background: var(--lime);
    box-shadow: 0 0 0 0 color-mix(in oklab, var(--lime) 70%, transparent);
    animation: pulse 2s ease-out infinite;
  }
  h1.hero-title {
    font-size: clamp(40px, 6.5vw, 92px); line-height: 0.95;
    font-weight: 800; letter-spacing: -0.045em;
    margin: 0 0 24px; max-width: 14ch; text-wrap: balance; color: var(--text);
  }
  .hero-title .ship {
    color: var(--lime); display: inline-block; position: relative;
  }
  .hero-title .ship::after {
    content: ""; position: absolute; left: 0; right: 0; bottom: -6px;
    height: 3px; background: var(--lime);
    transform: scaleX(0.3); transform-origin: left;
    animation: underline 3s ease-in-out 0.6s infinite alternate;
  }
  .hero-sub {
    font-size: clamp(16px, 1.4vw, 19px); color: var(--text-soft);
    max-width: 55ch; margin: 0 0 36px; line-height: 1.55; text-wrap: pretty;
  }
  .hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 40px; }
  .btn {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 15px 22px; border-radius: 14px;
    font-weight: 700; font-size: 15px; text-decoration: none;
    cursor: pointer; border: 1px solid transparent;
    transition: transform 180ms cubic-bezier(.2,.7,.3,1), background 180ms ease, color 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
    font-family: inherit;
  }
  .btn-primary { background: var(--lime); color: var(--lime-ink); }
  .btn-primary:hover {
    transform: translateY(-2px); background: var(--lime-hover);
    box-shadow: 0 12px 28px -10px color-mix(in oklab, var(--lime) 50%, transparent);
  }
  .btn-ghost { background: transparent; color: var(--text); border-color: var(--line-2); }
  .btn-ghost:hover {
    transform: translateY(-2px); border-color: var(--text);
    background: color-mix(in oklab, var(--text) 4%, transparent);
  }
  .btn .arrow { transition: transform 200ms ease; }
  .btn:hover .arrow { transform: translateX(3px); }
  .socials { display: flex; gap: 10px; }
  .socials a {
    width: 42px; height: 42px;
    display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid var(--line-2); border-radius: 12px;
    color: var(--muted); text-decoration: none;
    transition: color 180ms ease, border-color 180ms ease, transform 180ms ease, background 180ms ease;
    background: transparent;
  }
  .socials a:hover {
    color: var(--lime); border-color: var(--lime); transform: translateY(-2px);
    background: color-mix(in oklab, var(--lime) 6%, transparent);
  }
  .socials svg { width: 18px; height: 18px; }
  .hero-photo-col {
    position: relative; display: flex; justify-content: center; align-items: center;
  }
  .photo-frame {
    position: relative; width: 100%; max-width: 380px; aspect-ratio: 1 / 1;
  }
  .photo-frame::before {
    content: ""; position: absolute; inset: -16px; border-radius: 50%;
    border: 1px dashed var(--line-2); animation: spin 40s linear infinite;
  }
  .photo-circle {
    position: relative; width: 100%; height: 100%; border-radius: 50%; overflow: hidden;
    background: radial-gradient(circle at 30% 25%, color-mix(in oklab, var(--lime) 28%, var(--bg-3)) 0%, var(--bg-3) 60%), var(--bg-3);
    border: 2px solid var(--lime);
    box-shadow: 0 0 0 6px color-mix(in oklab, var(--lime) 10%, transparent), 0 24px 60px -20px color-mix(in oklab, var(--lime) 40%, transparent);
  }
  .photo-circle :global(img.portrait) {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
  }
  .sticker {
    position: absolute; padding: 8px 14px; border-radius: 12px;
    background: var(--card); border: 1px solid var(--line);
    box-shadow: var(--card-shadow); font-size: 13px; font-weight: 600;
    display: inline-flex; align-items: center; gap: 8px;
    animation: float 6s ease-in-out infinite;
  }
  .sticker .emoji { font-size: 16px; }
  .sticker.s1 { top: 8%; right: -10px; animation-delay: -1s; }
  .sticker.s2 { bottom: 14%; left: -20px; animation-delay: -3s; }
  @media (max-width: 900px) {
    .photo-frame { max-width: 260px; }
    .sticker { font-size: 11px; padding: 6px 10px; }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: add Hero section with blobs, grid bg, photo, CTAs, socials"
```

---

### Task 8: Work Section (Cards + Spotlight)

**Files:**
- Create: `src/components/Work.astro`
- Create: `src/components/WorkCard.astro`
- Create: `src/components/WorkScripts.astro`

- [ ] **Step 1: Create WorkCard.astro**

Write to `src/components/WorkCard.astro`:

```astro
---
interface Props {
  num: string;
  title: string;
  desc: string;
  tags: Array<{ label: string; color: string }>;
  status: { label: string; live: boolean };
  revealText: string;
  size: 'big' | 'small';
}

const { num, title, desc, tags, status, revealText, size } = Astro.props;
---

<article class:list={['work-card', 'reveal', size]}>
  <div class="work-deco">
    <slot name="deco" />
  </div>
  <span class:list={['status', { live: status.live }]} data-i18n={status.live ? 'status.live' : undefined}>
    {status.label}
  </span>
  <div>
    <div class="work-num">{num}</div>
    <h3 class="work-title">{title}</h3>
    <p class="work-desc">{desc}</p>
    <div class="tags">
      {tags.map(tag => <span class:list={['tag', tag.color]}>{tag.label}</span>)}
    </div>
  </div>
  <div class="work-reveal">
    <span>{revealText}</span>
    <span class="arrow">→</span>
  </div>
</article>

<style>
  .work-card {
    position: relative; border: 1px solid var(--line); border-radius: 24px;
    padding: 32px; background: var(--card); box-shadow: var(--card-shadow);
    min-height: 340px; display: flex; flex-direction: column; justify-content: space-between;
    overflow: hidden; cursor: pointer;
    transition: transform 280ms cubic-bezier(.2,.7,.3,1), border-color 280ms ease, background 280ms ease, box-shadow 280ms ease;
  }
  .work-card.big { grid-column: span 4; min-height: 420px; }
  .work-card.small { grid-column: span 2; min-height: 420px; }
  @media (max-width: 960px) {
    .work-card, .work-card.big, .work-card.small { grid-column: span 6; min-height: 320px; }
  }
  .work-card::before {
    content: ""; position: absolute; inset: 0;
    background: radial-gradient(500px 300px at var(--mx, 50%) var(--my, 0%), color-mix(in oklab, var(--lime) 10%, transparent), transparent 60%);
    opacity: 0; transition: opacity 280ms ease; pointer-events: none;
  }
  .work-card:hover {
    transform: translateY(-4px); border-color: var(--lime); background: var(--card-hover);
    box-shadow: 0 20px 50px -20px color-mix(in oklab, var(--lime) 25%, transparent), var(--card-shadow);
  }
  .work-card:hover::before { opacity: 1; }
  .work-deco { position: absolute; top: 0; right: 0; width: 180px; height: 180px; pointer-events: none; opacity: 0.9; }
  .status {
    position: absolute; top: 28px; right: 28px;
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    padding: 5px 10px; border-radius: 999px;
    border: 1px solid var(--line-2); background: var(--bg-2);
    display: inline-flex; align-items: center; gap: 6px; z-index: 2; color: var(--muted);
  }
  .status.live { color: var(--lime); border-color: color-mix(in oklab, var(--lime) 35%, transparent); }
  .status.live::before {
    content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--lime);
    box-shadow: 0 0 8px color-mix(in oklab, var(--lime) 70%, transparent);
  }
  .work-num {
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: var(--muted); margin-bottom: auto;
  }
  .work-title {
    font-size: clamp(22px, 2.6vw, 30px); font-weight: 700;
    letter-spacing: -0.02em; margin: 16px 0 10px; line-height: 1.1;
  }
  .work-desc { color: var(--text-soft); font-size: 15px; line-height: 1.5; margin: 0 0 18px; max-width: 44ch; }
  .work-reveal {
    max-height: 0; opacity: 0; overflow: hidden;
    transition: max-height 320ms ease, opacity 280ms ease, margin 280ms ease;
    font-size: 14px; color: var(--text); display: flex; align-items: center; gap: 8px;
  }
  .work-reveal .arrow { color: var(--lime); transition: transform 200ms ease; }
  .work-card:hover .work-reveal { max-height: 40px; opacity: 1; margin-top: 6px; }
  .work-card:hover .work-reveal .arrow { transform: translateX(4px); }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
  .tag {
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    padding: 4px 9px; border-radius: 6px;
    background: color-mix(in oklab, var(--text) 4%, transparent);
    border: 1px solid var(--line); color: var(--text-soft);
  }
  .tag.lime { color: var(--lime); border-color: color-mix(in oklab, var(--lime) 25%, transparent); background: color-mix(in oklab, var(--lime) 8%, transparent); }
  .tag.coral { color: var(--coral); border-color: color-mix(in oklab, var(--coral) 25%, transparent); background: color-mix(in oklab, var(--coral) 8%, transparent); }
  .tag.sky { color: var(--sky); border-color: color-mix(in oklab, var(--sky) 25%, transparent); background: color-mix(in oklab, var(--sky) 8%, transparent); }
  .tag.amber { color: var(--amber); border-color: color-mix(in oklab, var(--amber) 25%, transparent); background: color-mix(in oklab, var(--amber) 8%, transparent); }
  .tag.violet { color: var(--violet); border-color: color-mix(in oklab, var(--violet) 25%, transparent); background: color-mix(in oklab, var(--violet) 8%, transparent); }
</style>
```

- [ ] **Step 2: Create WorkScripts.astro**

Write to `src/components/WorkScripts.astro`:

```astro
<script>
  document.querySelectorAll('.work-card').forEach((card) => {
    card.addEventListener('mousemove', (e: Event) => {
      const r = (card as HTMLElement).getBoundingClientRect();
      const me = e as MouseEvent;
      (card as HTMLElement).style.setProperty('--mx', `${me.clientX - r.left}px`);
      (card as HTMLElement).style.setProperty('--my', `${me.clientY - r.top}px`);
    });
  });
</script>
```

- [ ] **Step 3: Create Work.astro**

Write to `src/components/Work.astro` — the section wrapper with all 4 project cards and their decorative SVGs (extracted from prototype):

```astro
---
import WorkCard from './WorkCard.astro';
import WorkScripts from './WorkScripts.astro';
---

<section class="block" id="work">
  <div class="eyebrow reveal" data-i18n="work.eyebrow">Karya Terpilih</div>
  <h2 class="section-title reveal delay-1" data-i18n-html="work.title">Yang sudah saya <em>kirim</em> <br/>(dan beberapa yang masih matang)</h2>
  <p class="section-lede reveal delay-2" data-i18n="work.lede">Empat proyek, empat stack, empat peran berbeda. Beberapa sudah live, beberapa masih NDA — intip salah satunya.</p>

  <div class="work-grid">
    <WorkCard
      num="Project 01 / 04"
      title="Ankrah Studios — Website v3.0"
      desc="Complete redesign of a creative studio's digital presence — from requirements gathering through production deployment."
      tags={[{ label: 'Web Dev', color: 'lime' }, { label: 'Project Lead', color: '' }, { label: 'Client Relations', color: '' }]}
      status={{ label: 'Live', live: true }}
      revealText="End-to-end ownership — discovery, design sign-off, build, launch."
      size="big"
    >
      <slot name="deco" slot="deco">
        <svg viewBox="0 0 180 180" width="100%" height="100%" aria-hidden="true">
          <defs>
            <pattern id="gridA" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M14 0H0v14" fill="none" stroke="color-mix(in oklab, var(--lime) 40%, transparent)" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="180" height="180" fill="url(#gridA)"/>
          <circle cx="140" cy="44" r="26" fill="none" stroke="var(--lime)" stroke-opacity="0.5" stroke-width="1.5"/>
          <circle cx="140" cy="44" r="10" fill="var(--lime)" fill-opacity="0.25"/>
        </svg>
      </slot>
    </WorkCard>

    <WorkCard
      num="Project 02 / 04"
      title="CLINICALGo Patient App"
      desc="Cross-platform Flutter app for patient appointment booking, history, and clinic memberships."
      tags={[{ label: 'Flutter', color: 'sky' }, { label: 'iOS', color: '' }, { label: 'Android', color: '' }, { label: 'REST API', color: '' }]}
      status={{ label: '🔒 Confidential', live: false }}
      revealText="Shipped to production on both stores."
      size="small"
    >
      <slot name="deco" slot="deco">
        <svg viewBox="0 0 180 180" width="100%" height="100%" aria-hidden="true">
          <rect x="110" y="20" width="50" height="90" rx="8" fill="none" stroke="var(--sky)" stroke-opacity="0.55" stroke-width="1.5"/>
          <rect x="116" y="28" width="38" height="62" rx="2" fill="var(--sky)" fill-opacity="0.1"/>
          <circle cx="135" cy="100" r="3" fill="var(--sky)" fill-opacity="0.6"/>
        </svg>
      </slot>
    </WorkCard>

    <WorkCard
      num="Project 03 / 04"
      title="ERPGo — Multi-module ERP"
      desc="7+ modules: Sales, Procurement, HR, Finance, and more. Built for Indonesian SMEs."
      tags={[{ label: 'ERP', color: 'coral' }, { label: 'PM', color: '' }, { label: 'Multi-module', color: '' }]}
      status={{ label: '🔒 Confidential', live: false }}
      revealText="Led cross-functional delivery across all modules."
      size="small"
    >
      <slot name="deco" slot="deco">
        <svg viewBox="0 0 180 180" width="100%" height="100%" aria-hidden="true">
          <g fill="none" stroke="var(--coral)" stroke-opacity="0.5" stroke-width="1.5">
            <rect x="110" y="20" width="20" height="20" rx="3"/>
            <rect x="135" y="20" width="20" height="20" rx="3"/>
            <rect x="110" y="45" width="20" height="20" rx="3"/>
            <rect x="135" y="45" width="20" height="20" rx="3"/>
            <rect x="110" y="70" width="20" height="20" rx="3"/>
            <rect x="135" y="70" width="20" height="20" rx="3"/>
          </g>
          <rect x="110" y="20" width="20" height="20" rx="3" fill="var(--coral)" fill-opacity="0.22"/>
        </svg>
      </slot>
    </WorkCard>

    <WorkCard
      num="Project 04 / 04"
      title="Kashvo — Offline-first Finance PWA"
      desc="Personal finance PWA with full offline support. Track income, expenses, and budgets — works even without internet."
      tags={[{ label: 'PWA', color: 'lime' }, { label: 'Offline-first', color: '' }, { label: 'Web App', color: '' }, { label: 'Finance', color: '' }]}
      status={{ label: 'Live', live: true }}
      revealText="Service workers, IndexedDB, and a UI that never spins."
      size="big"
    >
      <slot name="deco" slot="deco">
        <svg viewBox="0 0 180 180" width="100%" height="100%" aria-hidden="true">
          <g fill="none" stroke="var(--lime)" stroke-opacity="0.5" stroke-width="1.5">
            <rect x="100" y="30" width="70" height="44" rx="8"/>
            <path d="M100 50 H170" stroke-dasharray="3 3" />
            <circle cx="158" cy="62" r="6" fill="var(--lime)" fill-opacity="0.3"/>
          </g>
          <text x="108" y="46" fill="var(--lime)" fill-opacity="0.7" font-family="JetBrains Mono, monospace" font-size="9">KASHVO</text>
          <g fill="var(--lime)" fill-opacity="0.35">
            <rect x="100" y="90" width="10" height="20" rx="2"/>
            <rect x="114" y="82" width="10" height="28" rx="2"/>
            <rect x="128" y="96" width="10" height="14" rx="2"/>
            <rect x="142" y="76" width="10" height="34" rx="2"/>
            <rect x="156" y="88" width="10" height="22" rx="2"/>
          </g>
        </svg>
      </slot>
    </WorkCard>
  </div>
</section>

<WorkScripts />

<style>
  section.block {
    padding: 140px 32px; position: relative;
    max-width: 1200px; margin: 0 auto;
  }
  @media (max-width: 720px) { section.block { padding: 90px 20px; } }
  .eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em;
    margin-bottom: 24px; white-space: nowrap;
  }
  .eyebrow::before { content: ""; width: 24px; height: 1px; background: var(--lime); }
  h2.section-title {
    font-size: clamp(34px, 5vw, 60px); line-height: 1.02;
    font-weight: 800; letter-spacing: -0.035em;
    margin: 0 0 18px; max-width: 22ch; text-wrap: balance;
  }
  h2.section-title em { font-style: normal; color: var(--lime); }
  .section-lede { color: var(--muted); font-size: 17px; max-width: 60ch; margin: 0 0 64px; }
  .work-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Work.astro src/components/WorkCard.astro src/components/WorkScripts.astro
git commit -m "feat: add Work section with project cards and spotlight effect"
```

---

### Task 9: Experience Timeline Section

**Files:**
- Create: `src/components/Experience.astro`
- Create: `src/components/TimelineEntry.astro`

- [ ] **Step 1: Create TimelineEntry.astro**

Write to `src/components/TimelineEntry.astro`:

```astro
---
interface Props {
  when: string;
  company: string;
  role: string;
  desc: string;
  chip?: { label: string; variant: 'current' | 'sabbatical' };
  isGap?: boolean;
  delayClass?: string;
}

const { when, company, role, desc, chip, isGap, delayClass } = Astro.props;
---

<div class:list={['entry', 'reveal', { gap: isGap }, delayClass]}>
  <div class="when">
    <span>{when}</span>
    <span>·</span>
    <span class="company">{company}</span>
  </div>
  <h3>
    {role}
    {chip && <span class:list={['chip', { 'gap-chip': chip.variant === 'sabbatical' }]}>{chip.label}</span>}
  </h3>
  <p>{desc}</p>
</div>

<style>
  .entry { position: relative; padding: 24px 0 40px 24px; }
  .entry::before {
    content: ""; position: absolute; left: -34px; top: 32px;
    width: 12px; height: 12px; border-radius: 50%;
    background: var(--bg); border: 2px solid var(--lime);
    transition: transform 200ms ease, background 200ms ease;
  }
  .entry:hover::before { transform: scale(1.3); background: var(--lime); }
  .entry.gap::before { border-color: var(--amber); }
  .when {
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: var(--muted); margin-bottom: 8px;
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  }
  .when .company { color: var(--text); font-weight: 500; }
  h3 {
    font-size: 24px; font-weight: 700; letter-spacing: -0.02em;
    margin: 0 0 10px; color: var(--text);
  }
  h3 .chip {
    font-size: 11px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    padding: 3px 8px; border-radius: 6px;
    background: color-mix(in oklab, var(--lime) 12%, transparent);
    color: var(--lime); margin-left: 8px; vertical-align: middle;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  h3 .gap-chip { background: color-mix(in oklab, var(--amber) 15%, transparent); color: var(--amber); }
  p { color: var(--text-soft); margin: 0; max-width: 64ch; font-size: 16px; }
</style>
```

- [ ] **Step 2: Create Experience.astro**

Write to `src/components/Experience.astro`:

```astro
---
import TimelineEntry from './TimelineEntry.astro';
---

<section class="block" id="experience">
  <div class="eyebrow reveal" data-i18n="exp.eyebrow">Perjalanan Karier</div>
  <h2 class="section-title reveal delay-1" data-i18n-html="exp.title">Resume yang <em>apa adanya</em>.</h2>
  <p class="section-lede reveal delay-2" data-i18n="exp.lede">Tanpa jargon lebay. Ini yang beneran saya kerjakan dan yang beneran saya pelajari.</p>

  <div class="timeline">
    <TimelineEntry
      when="Sep 2025 — Present"
      company="PT. Instrumeta Teknologi Nusantara"
      role="Software Engineer"
      desc="Applied as PM. Ended up as SE because the team needed builders. Adapting fast is a skill too — and the code is better for it."
      chip={{ label: 'current', variant: 'current' }}
    />
    <TimelineEntry
      when="Jul — Aug 2025"
      company="The Productive Unemployment Era"
      role="Self-directed interlude"
      desc="Learned pizza-making from scratch. Set up a Proxmox homeserver. Came back sharper and well-fed."
      chip={{ label: 'sabbatical', variant: 'sabbatical' }}
      isGap={true}
      delayClass="delay-1"
    />
    <TimelineEntry
      when="Dec 2024 — Jun 2025"
      company="PT. Ruang Algo Multimatics"
      role="Project Manager"
      desc="Led delivery across ERP, government, clinical, and admin platforms. 5+ concurrent products. PRDs, sprints, UAT, stakeholders — all of it."
      delayClass="delay-2"
    />
    <TimelineEntry
      when="Oct 2023 — Nov 2024"
      company="PT. Ruang Algo Multimatics"
      role="Programmer — Mobile + QA"
      desc="Flutter dev for iOS & Android. Wore the QA hat too. Because someone had to, and it turns out that someone was me."
      delayClass="delay-3"
    />
  </div>
</section>

<style>
  section.block {
    padding: 140px 32px; position: relative;
    max-width: 1200px; margin: 0 auto;
  }
  @media (max-width: 720px) { section.block { padding: 90px 20px; } }
  .eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em;
    margin-bottom: 24px; white-space: nowrap;
  }
  .eyebrow::before { content: ""; width: 24px; height: 1px; background: var(--lime); }
  h2.section-title {
    font-size: clamp(34px, 5vw, 60px); line-height: 1.02;
    font-weight: 800; letter-spacing: -0.035em;
    margin: 0 0 18px; max-width: 22ch; text-wrap: balance;
  }
  h2.section-title em { font-style: normal; color: var(--lime); }
  .section-lede { color: var(--muted); font-size: 17px; max-width: 60ch; margin: 0 0 64px; }
  .timeline {
    position: relative; padding-left: 28px;
    border-left: 1px dashed var(--line-2); margin-top: 40px;
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Experience.astro src/components/TimelineEntry.astro
git commit -m "feat: add Experience timeline section"
```

---

### Task 10: About Section (Manifesto + Fun Cards)

**Files:**
- Create: `src/components/About.astro`
- Create: `src/components/FunCard.astro`

- [ ] **Step 1: Create FunCard.astro**

Write to `src/components/FunCard.astro`:

```astro
---
interface Props {
  label: string;
  icon: string;
  text: string;
}
const { label, icon, text } = Astro.props;
---

<div class="fun-card">
  <span class="tiny">{label}</span>
  <div class="fun-icon">{icon}</div>
  <p>{text}</p>
</div>

<style>
  .fun-card {
    position: relative; padding: 24px; border-radius: 18px;
    border: 1px solid var(--line); background: var(--card);
    box-shadow: var(--card-shadow);
    transition: transform 220ms ease, border-color 220ms ease, background 220ms ease;
  }
  .fun-card:hover { transform: translateY(-3px) rotate(-0.6deg); border-color: var(--lime); }
  .fun-card:nth-child(2):hover { transform: translateY(-3px) rotate(0.6deg); }
  .fun-icon { font-size: 28px; margin-bottom: 12px; display: inline-block; transition: transform 220ms ease; }
  .fun-card:hover .fun-icon { transform: scale(1.15) rotate(-6deg); }
  .fun-card p { margin: 0; font-size: 14px; line-height: 1.5; color: var(--text-soft); }
  .fun-card .tiny {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em;
    margin-bottom: 10px; display: block;
  }
</style>
```

- [ ] **Step 2: Create About.astro**

Write to `src/components/About.astro`:

```astro
---
import FunCard from './FunCard.astro';
---

<section class="block" id="about">
  <div class="eyebrow reveal" data-i18n="about.eyebrow">Tentang Saya</div>
  <h2 class="section-title reveal delay-1" data-i18n-html="about.title">Builder, PM, <em>tukang pizza</em>.</h2>

  <div class="about-grid">
    <div class="manifesto reveal delay-2">
      <p data-i18n-html="about.p1">Saya software engineer sekaligus project manager yang percaya bahwa <span class="hl">produk bagus lahir dari tim yang solid</span>. Sama betahnya di depan terminal maupun di ruang meeting klien.</p>
      <p data-i18n="about.p2">Sudah pernah kirim sistem ERP, aplikasi mobile, platform pemerintahan, sampai SaaS buatan sendiri. Bukan cuma bisa ngoding — saya ngerti seluruh perjalanannya, dari ide mentah sampai live di tangan pengguna.</p>
      <p class="sig" data-i18n="about.sig">// masih belajar, terus ngirim</p>
    </div>

    <div class="fun-grid reveal delay-3">
      <FunCard label="Fakta · 01" icon="🍕" text="Bikin pizza dari nol, dan rasanya emang beneran enak. Ada foto buktinya." />
      <FunCard label="Fakta · 02" icon="🐱" text="Suka kucing. Tidak perlu alasan lebih lanjut." />
      <FunCard label="Fakta · 03" icon="🖥️" text="Website ini jalan di laptop Infinix lama lewat Proxmox. Serius. Dan masih hidup sampai sekarang." />
      <FunCard label="Fakta · 04" icon="⚡" text="Pernah jadi PM, selalu jadi builder." />
    </div>
  </div>
</section>

<style>
  section.block {
    padding: 140px 32px; position: relative;
    max-width: 1200px; margin: 0 auto;
  }
  @media (max-width: 720px) { section.block { padding: 90px 20px; } }
  .eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em;
    margin-bottom: 24px; white-space: nowrap;
  }
  .eyebrow::before { content: ""; width: 24px; height: 1px; background: var(--lime); }
  h2.section-title {
    font-size: clamp(34px, 5vw, 60px); line-height: 1.02;
    font-weight: 800; letter-spacing: -0.035em;
    margin: 0 0 18px; max-width: 22ch; text-wrap: balance;
  }
  h2.section-title em { font-style: normal; color: var(--lime); }
  .about-grid {
    display: grid; grid-template-columns: 1.15fr 1fr;
    gap: 64px; align-items: start;
  }
  @media (max-width: 900px) { .about-grid { grid-template-columns: 1fr; gap: 40px; } }
  .manifesto p {
    font-size: clamp(18px, 1.7vw, 22px); line-height: 1.55;
    color: var(--text); margin: 0 0 20px; text-wrap: pretty;
  }
  .manifesto p :global(.hl) {
    background: linear-gradient(transparent 60%, color-mix(in oklab, var(--lime) 30%, transparent) 60%);
    padding: 0 2px;
  }
  .manifesto .sig {
    margin-top: 28px; font-family: 'JetBrains Mono', monospace;
    font-size: 13px; color: var(--muted);
  }
  .fun-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/About.astro src/components/FunCard.astro
git commit -m "feat: add About section with manifesto and fun cards"
```

---

### Task 11: Contact Section (Multi-Step Form)

**Files:**
- Create: `src/components/Contact.astro`
- Create: `src/components/ContactScripts.astro`

- [ ] **Step 1: Create Contact.astro**

Write to `src/components/Contact.astro` — the full multi-step wizard form HTML/CSS. This is the second largest component:

```astro
---
import ContactScripts from './ContactScripts.astro';
---

<section class="block contact" id="contact">
  <div class="eyebrow reveal" data-i18n="contact.eyebrow">Hubungi Saya</div>
  <h2 class="section-title reveal delay-1" data-i18n-html="contact.title">Ada proyek yang <em>kepingin</em> dibangun?</h2>
  <p class="section-lede reveal delay-2" data-i18n="contact.lede">Ceritain sedikit — 3 pertanyaan singkat, saya janji. Abis itu satu textarea doang.</p>

  <div class="form-shell reveal delay-3" id="formShell">
    <div class="progress-wrap" id="progressWrap">
      <div class="progress-steps" id="progressSteps">
        <div class="pip"></div>
        <div class="pip"></div>
        <div class="pip"></div>
        <div class="pip"></div>
      </div>
      <div class="progress-label"><b id="stepNum">01</b> / 04</div>
    </div>

    <div class="step active" data-step="1">
      <h3 data-i18n="q1.title">Butuh apa nih?</h3>
      <p class="hint" data-i18n="q1.hint">Pilih yang paling mendekati — nanti bisa kita sesuaikan.</p>
      <div class="pills" data-field="type">
        <button class="pill" data-value="Mobile App"><span data-i18n="q1.a1">Aplikasi Mobile</span><span class="marker"></span></button>
        <button class="pill" data-value="Web App"><span data-i18n="q1.a2">Web App</span><span class="marker"></span></button>
        <button class="pill" data-value="SaaS / Platform"><span data-i18n="q1.a3">SaaS / Platform</span><span class="marker"></span></button>
        <button class="pill" data-value="ERP / Enterprise"><span data-i18n="q1.a4">ERP / Enterprise</span><span class="marker"></span></button>
        <button class="pill" data-value="Something else"><span data-i18n="q1.a5">Ada yang lain</span><span class="marker"></span></button>
      </div>
    </div>

    <div class="step" data-step="2">
      <h3 data-i18n="q2.title">Sudah sampai mana?</h3>
      <p class="hint" data-i18n="q2.hint">Nggak ada jawaban yang salah. Beneran.</p>
      <div class="pills" data-field="stage">
        <button class="pill" data-value="Just an idea"><span data-i18n="q2.a1">Baru ada ide — tolong bantu scope-nya</span><span class="marker"></span></button>
        <button class="pill" data-value="Have specs"><span data-i18n="q2.a2">Sudah ada spek — tinggal dibangun</span><span class="marker"></span></button>
        <button class="pill" data-value="Existing product"><span data-i18n="q2.a3">Produk sudah jalan — perlu ditingkatkan</span><span class="marker"></span></button>
        <button class="pill" data-value="Yesterday"><span data-i18n="q2.a4">Harusnya sudah selesai kemarin</span><span class="marker"></span></button>
      </div>
    </div>

    <div class="step" data-step="3">
      <h3 data-i18n="q3.title">Kira-kira budgetnya?</h3>
      <p class="hint" data-i18n="q3.hint">Perkiraan kasar juga oke. Kita cari yang realistis bareng-bareng.</p>
      <div class="pills" data-field="budget">
        <button class="pill" data-value="<5jt"><span data-i18n="q3.a1">Di bawah 5 juta</span><span class="marker"></span></button>
        <button class="pill" data-value="5-20jt"><span data-i18n="q3.a2">5 – 20 juta</span><span class="marker"></span></button>
        <button class="pill" data-value="20-50jt"><span data-i18n="q3.a3">20 – 50 juta</span><span class="marker"></span></button>
        <button class="pill" data-value="Let's talk"><span data-i18n="q3.a4">Mending ngobrol dulu</span><span class="marker"></span></button>
      </div>
    </div>

    <div class="step" data-step="4">
      <h3 data-i18n="q4.title">Hampir selesai — siapa dan apa.</h3>
      <p class="hint" data-i18n="q4.hint">Yang penting-penting aja. Nggak perlu panjang-panjang.</p>
      <div class="field">
        <label for="brief" data-i18n="q4.l.brief">Ceritain proyeknya</label>
        <textarea id="brief" data-i18n-ph="q4.ph.brief" placeholder="Mau bikin apa? Untuk siapa? Masalah apa yang mau diselesaikan?"></textarea>
      </div>
      <div class="field-grid">
        <div class="field">
          <label for="name" data-i18n="q4.l.name">Nama kamu</label>
          <input id="name" type="text" data-i18n-ph="q4.ph.name" placeholder="misal: Budi Santoso" />
        </div>
        <div class="field">
          <label for="contact-info" data-i18n="q4.l.contact">WhatsApp atau Email</label>
          <input id="contact-info" type="text" data-i18n-ph="q4.ph.contact" placeholder="+62 atau kamu@email.com" />
        </div>
      </div>
    </div>

    <div class="step" data-step="5">
      <div class="success">
        <div class="check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h3 data-i18n="success.title">Membuka WhatsApp…</h3>
        <p data-i18n="success.sub">Saya balas paling lama 24 jam. Biasanya jauh lebih cepat dari itu.</p>
      </div>
    </div>

    <div class="step-nav" id="stepNav">
      <button class="btn-back" id="btnBack" style="visibility: hidden;" data-i18n="form.back">← Kembali</button>
      <button class="btn-submit" id="btnNext" disabled>
        <span id="btnNextLabel" data-i18n="form.next">Lanjut →</span>
      </button>
    </div>
  </div>

  <div class="fallback reveal delay-4">
    <div class="tiny" data-i18n="fallback.tiny">Mau langsung hubungi? Silakan pilih.</div>
    <div class="row">
      <a href="https://wa.me/6289691964368" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5-1.3c1.5.8 3.2 1.3 5 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
        WhatsApp
      </a>
      <a href="https://www.linkedin.com/in/ikhwanulhakimm/" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.78 0h4.37v1.92h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 7v7.46h-4.56V15.2c0-1.7-.03-3.9-2.38-3.9-2.38 0-2.74 1.86-2.74 3.78V22H8V8z"/></svg>
        LinkedIn
      </a>
      <a href="https://www.instagram.com/ikhwanulhakim.me/" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
        Instagram
      </a>
    </div>
  </div>
</section>

<ContactScripts />

<style>
  section.block {
    padding: 140px 32px; position: relative;
    max-width: 1200px; margin: 0 auto;
  }
  @media (max-width: 720px) { section.block { padding: 90px 20px; } }
  .eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em;
    margin-bottom: 24px; white-space: nowrap;
  }
  .eyebrow::before { content: ""; width: 24px; height: 1px; background: var(--lime); }
  h2.section-title {
    font-size: clamp(34px, 5vw, 60px); line-height: 1.02;
    font-weight: 800; letter-spacing: -0.035em;
    margin: 0 0 18px; max-width: 22ch; text-wrap: balance;
  }
  h2.section-title em { font-style: normal; color: var(--lime); }
  .section-lede { color: var(--muted); font-size: 17px; max-width: 60ch; margin: 0 0 64px; }
  .form-shell {
    margin-top: 56px; background: var(--card); border: 1px solid var(--line);
    border-radius: 28px; padding: 40px; position: relative; overflow: hidden;
    box-shadow: var(--card-shadow);
  }
  @media (max-width: 720px) { .form-shell { padding: 28px 22px; border-radius: 22px; } }
  .progress-wrap { display: flex; align-items: center; gap: 14px; margin-bottom: 36px; }
  .progress-steps { display: flex; gap: 6px; flex: 1; }
  .progress-steps .pip { flex: 1; height: 4px; border-radius: 2px; background: var(--line); overflow: hidden; position: relative; }
  .progress-steps .pip::after {
    content: ""; position: absolute; inset: 0; background: var(--lime);
    transform: scaleX(0); transform-origin: left;
    transition: transform 450ms cubic-bezier(.2,.7,.3,1);
  }
  .progress-steps .pip.done::after { transform: scaleX(1); }
  .progress-steps .pip.active::after { transform: scaleX(0.6); }
  .progress-label { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--muted); }
  .progress-label b { color: var(--lime); font-weight: 500; }
  .step { display: none; animation: stepIn 360ms cubic-bezier(.2,.7,.3,1); }
  .step.active { display: block; }
  .step h3 {
    font-size: clamp(26px, 3vw, 36px); font-weight: 700;
    letter-spacing: -0.025em; margin: 0 0 8px; line-height: 1.1; color: var(--text);
  }
  .step .hint { color: var(--muted); font-size: 14px; margin: 0 0 28px; }
  .pills { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  @media (max-width: 600px) { .pills { grid-template-columns: 1fr; } }
  .pill {
    text-align: left; padding: 18px 20px; border-radius: 14px;
    background: var(--bg-3); border: 1px solid var(--line);
    color: var(--text); font: inherit; font-size: 15px; font-weight: 500;
    cursor: pointer; display: flex; align-items: center; justify-content: space-between;
    transition: background 180ms ease, border-color 180ms ease, transform 160ms ease, color 180ms ease;
  }
  .pill:hover { border-color: var(--lime); background: color-mix(in oklab, var(--lime) 5%, var(--bg-3)); transform: translateY(-2px); }
  .pill.selected { border-color: var(--lime); background: color-mix(in oklab, var(--lime) 12%, var(--bg-3)); color: var(--lime); }
  .pill .marker {
    width: 18px; height: 18px; border-radius: 50%;
    border: 1.5px solid var(--line-2);
    display: inline-flex; align-items: center; justify-content: center;
    transition: border-color 180ms ease, background 180ms ease;
    flex-shrink: 0; margin-left: 10px;
  }
  .pill.selected .marker { border-color: var(--lime); background: var(--lime); }
  .pill.selected .marker::after { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--lime-ink); }
  .field { margin-bottom: 14px; }
  .field label {
    display: block; font-family: 'JetBrains Mono', monospace;
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--muted); margin-bottom: 8px;
  }
  .field input, .field textarea {
    width: 100%; background: var(--bg-3); border: 1px solid var(--line);
    color: var(--text); padding: 14px 16px; border-radius: 12px;
    font: inherit; font-size: 15px;
    transition: border-color 180ms ease, background 180ms ease;
    resize: vertical; font-family: inherit;
  }
  .field textarea { min-height: 120px; line-height: 1.5; }
  .field input:focus, .field textarea:focus {
    outline: none; border-color: var(--lime);
    background: color-mix(in oklab, var(--lime) 3%, var(--bg-3));
  }
  .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 600px) { .field-grid { grid-template-columns: 1fr; } }
  .step-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 28px; gap: 12px; }
  .btn-back {
    background: transparent; border: 1px solid var(--line-2);
    color: var(--muted); padding: 12px 18px; border-radius: 12px;
    cursor: pointer; font: inherit; font-weight: 500; font-size: 14px;
    transition: color 180ms ease, border-color 180ms ease;
  }
  .btn-back:hover { color: var(--text); border-color: var(--text); }
  .btn-submit {
    background: var(--lime); color: var(--lime-ink);
    border: 0; padding: 16px 26px; border-radius: 14px;
    cursor: pointer; font: inherit; font-weight: 700; font-size: 15px;
    transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  }
  .btn-submit:hover { transform: translateY(-2px); background: var(--lime-hover); box-shadow: 0 12px 28px -10px color-mix(in oklab, var(--lime) 50%, transparent); }
  .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
  .success { text-align: center; padding: 40px 20px; }
  .success .check {
    width: 84px; height: 84px; border-radius: 50%;
    background: color-mix(in oklab, var(--lime) 12%, transparent);
    border: 2px solid var(--lime);
    display: inline-flex; align-items: center; justify-content: center;
    margin-bottom: 24px; animation: pop 480ms cubic-bezier(.2,.9,.3,1.4);
  }
  .success .check svg { width: 40px; height: 40px; color: var(--lime); }
  .success .check svg path { stroke-dasharray: 40; stroke-dashoffset: 40; animation: draw 600ms 200ms cubic-bezier(.2,.7,.3,1) forwards; }
  .success h3 { font-size: 28px; margin: 0 0 10px; letter-spacing: -0.02em; }
  .success p { color: var(--muted); margin: 0; }
  .fallback { margin-top: 40px; text-align: center; }
  .fallback .tiny { color: var(--muted); font-size: 14px; margin-bottom: 14px; }
  .fallback .row { display: inline-flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .fallback a {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 16px; border-radius: 999px;
    border: 1px solid var(--line-2); color: var(--text);
    text-decoration: none; font-size: 14px; background: var(--card);
    transition: border-color 180ms ease, background 180ms ease, color 180ms ease;
  }
  .fallback a:hover { border-color: var(--lime); color: var(--lime); background: color-mix(in oklab, var(--lime) 6%, var(--card)); }
  .fallback a svg { width: 14px; height: 14px; }
</style>
```

- [ ] **Step 2: Create ContactScripts.astro**

Write to `src/components/ContactScripts.astro`:

```astro
<script>
  const state = { step: 1, type: '', stage: '', budget: '', brief: '', name: '', contact: '' };
  const totalSteps = 4;
  const steps = document.querySelectorAll<HTMLElement>('.step');
  const pips = document.querySelectorAll<HTMLElement>('.progress-steps .pip');
  const btnBack = document.getElementById('btnBack') as HTMLButtonElement;
  const btnNext = document.getElementById('btnNext') as HTMLButtonElement;
  const btnNextLabel = document.getElementById('btnNextLabel') as HTMLElement;
  const stepNum = document.getElementById('stepNum') as HTMLElement;
  const stepNav = document.getElementById('stepNav') as HTMLElement;
  const progressWrap = document.getElementById('progressWrap') as HTMLElement;

  const dataEl = document.getElementById('i18n-data');
  const I18N = dataEl ? JSON.parse(dataEl.textContent || '{}') : {};
  let currentLang: string = localStorage.getItem('lang') || 'id';

  function t(key: string): string { return I18N[currentLang]?.[key] || key; }

  function updateSubmitLabel() {
    if (!btnNextLabel) return;
    if (state.step === totalSteps) btnNextLabel.textContent = t('form.send');
    else if (state.step <= totalSteps) btnNextLabel.textContent = t('form.next');
  }

  function canAdvance(): boolean {
    if (state.step === 1) return !!state.type;
    if (state.step === 2) return !!state.stage;
    if (state.step === 3) return !!state.budget;
    if (state.step === 4) return state.brief.trim().length > 0 && state.name.trim().length > 0 && state.contact.trim().length > 0;
    return false;
  }

  function render() {
    steps.forEach(s => s.classList.remove('active'));
    const cur = document.querySelector<HTMLElement>(`.step[data-step="${state.step}"]`);
    if (cur) cur.classList.add('active');

    pips.forEach((pip, i) => {
      pip.classList.remove('active', 'done');
      if (i + 1 < state.step) pip.classList.add('done');
      else if (i + 1 === state.step) pip.classList.add('active');
    });

    stepNum.textContent = String(Math.min(state.step, totalSteps)).padStart(2, '0');
    btnBack.style.visibility = state.step > 1 && state.step <= totalSteps ? 'visible' : 'hidden';

    if (state.step > totalSteps) {
      stepNav.style.display = 'none';
      progressWrap.style.display = 'none';
    } else {
      stepNav.style.display = 'flex';
      progressWrap.style.display = 'flex';
    }

    updateSubmitLabel();
    btnNext.disabled = !canAdvance();
  }

  document.querySelectorAll('.pills').forEach(group => {
    const field = (group as HTMLElement).dataset.field!;
    group.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        group.querySelectorAll('.pill').forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        (state as any)[field] = (pill as HTMLElement).dataset.value;
        btnNext.disabled = !canAdvance();
        setTimeout(() => {
          if (state.step < totalSteps) { state.step++; render(); }
        }, 280);
      });
    });
  });

  const briefEl = document.getElementById('brief') as HTMLTextAreaElement;
  const nameEl = document.getElementById('name') as HTMLInputElement;
  const contactEl = document.getElementById('contact-info') as HTMLInputElement;
  [briefEl, nameEl, contactEl].forEach(el => {
    el?.addEventListener('input', () => {
      state.brief = briefEl?.value || '';
      state.name = nameEl?.value || '';
      state.contact = contactEl?.value || '';
      btnNext.disabled = !canAdvance();
    });
  });

  btnBack.addEventListener('click', () => { if (state.step > 1) { state.step--; render(); } });

  btnNext.addEventListener('click', () => {
    if (!canAdvance()) return;
    if (state.step < totalSteps) {
      state.step++; render();
    } else {
      const labels = currentLang === 'id'
        ? { greet: 'Halo Ikhwan! 👋', t1: 'Tipe proyek', t2: 'Tahap', t3: 'Budget', t4: 'Deskripsi', t5: 'Nama', t6: 'Kontak' }
        : { greet: 'Hey Ikhwan! 👋', t1: 'Project type', t2: 'Stage', t3: 'Budget', t4: 'Description', t5: 'Name', t6: 'Contact' };

      const msg = [
        labels.greet, '',
        `*${labels.t1}:* ${state.type}`,
        `*${labels.t2}:* ${state.stage}`,
        `*${labels.t3}:* ${state.budget}`, '',
        `*${labels.t4}:*`, state.brief, '',
        `*${labels.t5}:* ${state.name}`,
        `*${labels.t6}:* ${state.contact}`
      ].join('\n');

      const url = `https://wa.me/6289691964368?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener');

      state.step = totalSteps + 1;
      render();
    }
  });

  render();
</script>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Contact.astro src/components/ContactScripts.astro
git commit -m "feat: add Contact section with multi-step wizard form"
```

---

### Task 12: Footer + ScrollReveal

**Files:**
- Create: `src/components/Footer.astro`
- Create: `src/components/ScrollReveal.astro`

- [ ] **Step 1: Create Footer.astro**

Write to `src/components/Footer.astro`:

```astro
---
---

<footer>
  <div class="line1" data-i18n-html="footer.line">
    Didesain & dibangun sendiri oleh <b>Ikhwan</b>. Self-hosted di laptop bekas. <span style="color: var(--lime);">Masih nyala.</span>
  </div>
  <div class="socials">
    <a href="https://www.instagram.com/ikhwanulhakim.me/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
    <a href="https://www.linkedin.com/in/ikhwanulhakimm/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.78 0h4.37v1.92h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 7v7.46h-4.56V15.2c0-1.7-.03-3.9-2.38-3.9-2.38 0-2.74 1.86-2.74 3.78V22H8V8z"/></svg></a>
    <a href="https://wa.me/6289691964368" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5-1.3c1.5.8 3.2 1.3 5 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg></a>
  </div>
</footer>

<style>
  footer {
    padding: 48px 32px 36px; border-top: 1px solid var(--line);
    text-align: center; color: var(--muted); font-size: 13px;
  }
  footer .line1 { margin-bottom: 18px; line-height: 1.7; }
  footer .line1 :global(b) { color: var(--text); font-weight: 600; }
  footer .socials { justify-content: center; display: flex; }
  footer .socials a {
    width: 42px; height: 42px;
    display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid var(--line-2); border-radius: 12px;
    color: var(--muted); text-decoration: none;
    transition: color 180ms ease, border-color 180ms ease, transform 180ms ease, background 180ms ease;
    background: transparent;
  }
  footer .socials a:hover {
    color: var(--lime); border-color: var(--lime); transform: translateY(-2px);
    background: color-mix(in oklab, var(--lime) 6%, transparent);
  }
  footer .socials svg { width: 18px; height: 18px; }
</style>
```

- [ ] **Step 2: Create ScrollReveal.astro**

Write to `src/components/ScrollReveal.astro`:

```astro
<script>
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => {
    if (!el.classList.contains('in')) io.observe(el);
  });
</script>

<style>
  .reveal {
    opacity: 0; transform: translateY(24px);
    transition: opacity 700ms cubic-bezier(.2,.7,.3,1), transform 700ms cubic-bezier(.2,.7,.3,1);
  }
  .reveal.in { opacity: 1; transform: translateY(0); }
  .reveal.delay-1 { transition-delay: 80ms; }
  .reveal.delay-2 { transition-delay: 160ms; }
  .reveal.delay-3 { transition-delay: 240ms; }
  .reveal.delay-4 { transition-delay: 320ms; }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro src/components/ScrollReveal.astro
git commit -m "feat: add Footer and ScrollReveal components"
```

---

### Task 13: Index Page + Robots.txt Route

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/robots.txt.ts`

- [ ] **Step 1: Create index.astro**

Write to `src/pages/index.astro`:

```astro
---
import Layout from '@/layouts/Layout.astro';
import Nav from '@/components/Nav.astro';
import I18nScripts from '@/components/I18nScripts.astro';
import Hero from '@/components/Hero.astro';
import Work from '@/components/Work.astro';
import Experience from '@/components/Experience.astro';
import About from '@/components/About.astro';
import Contact from '@/components/Contact.astro';
import Footer from '@/components/Footer.astro';
import ScrollReveal from '@/components/ScrollReveal.astro';
---

<Layout>
  <Nav />
  <I18nScripts />
  <Hero />
  <Work />
  <Experience />
  <About />
  <Contact />
  <Footer />
  <ScrollReveal />
</Layout>
```

- [ ] **Step 2: Create robots.txt.ts**

Write to `src/pages/robots.txt.ts`:

```typescript
import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: { 'Content-Type': 'text/plain' }
  });
};
```

- [ ] **Step 3: Verify full site builds and runs**

```bash
pnpm build
```

Expected: Build completes successfully, generates `dist/` with static files. Then:

```bash
pnpm preview
```

Open and verify all sections render correctly.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/pages/robots.txt.ts
git commit -m "feat: add index page composing all sections and robots.txt route"
```

---

### Task 14: Lighthouse Audit & Optimization

**Files:**
- Modify: various components as needed

- [ ] **Step 1: Run Lighthouse audit on built site**

```bash
pnpm build && pnpm preview
```

Then in a separate terminal, run Lighthouse:

```bash
npx lighthouse http://localhost:4321 --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless"
```

- [ ] **Step 2: Check each metric against targets**

| Metric | Target | Fix if below |
|--------|--------|-------------|
| Performance | 100 | Optimize images, reduce CSS/JS |
| SEO | 100 | Add missing meta tags, structured data |
| Accessibility | 100 | Add missing aria labels, alt text, contrast |
| Best Practices | 100 | Fix HTTPS, console errors, deprecated APIs |

- [ ] **Step 3: Fix any issues found**

Address each Lighthouse recommendation. Common fixes:
- Add `width` and `height` to images for CLS prevention
- Ensure all interactive elements have focus styles
- Add `aria-label` to icon-only links
- Verify `meta viewport` is present

- [ ] **Step 4: Re-run Lighthouse and verify all scores ≥ 95**

```bash
npx lighthouse http://localhost:4321 --output=json --output-path=./lighthouse-report-final.json --chrome-flags="--headless"
```

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: Lighthouse optimization pass"
```

---

### Task 15: OG Image & Final Polish

**Files:**
- Add: `public/og-image.png`
- Modify: `src/layouts/Layout.astro` (if GoatCounter URL needs update)

- [ ] **Step 1: Create or obtain OG image**

The OG image should be 1200x630px, featuring the lime accent color and the name "Muhammad Ikhwanul Hakim" with title "Software Engineer & Project Manager". Place at `public/og-image.png`.

If no design tool is available, create a simple SVG-based placeholder and convert:

```bash
# The user should provide this asset or create it with a design tool
# For now, ensure the file exists as a placeholder
```

- [ ] **Step 2: Update GoatCounter URL**

In `src/layouts/Layout.astro`, update the GoatCounter script `data-goatcounter` attribute to the actual account URL once signed up.

- [ ] **Step 3: Final build verification**

```bash
pnpm build
```

Verify:
- `dist/` contains `index.html`, `sitemap-index.xml`, `robots.txt`
- CSS and JS files are present and minified
- Profile image is optimized (WebP/AVIF)
- Total JS weight < 10KB
- Total CSS weight < 12KB

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: add OG image and final polish"
```
