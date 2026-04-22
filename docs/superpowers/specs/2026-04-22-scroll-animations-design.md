# Scroll-Driven Storytelling Animations

## Summary

Add minimal, purposeful scroll-driven animations to the portfolio site using the existing IntersectionObserver system enhanced with CSS reveal variants and a lightweight parallax scroll listener. Zero new dependencies. ~40 lines JS, ~20 lines CSS. Respects `prefers-reduced-motion`.

## Approach

**Pure CSS + IntersectionObserver** (Approach A). Enhance existing ScrollReveal with richer reveal types and add parallax to hero blobs via a single passive scroll listener.

### Why not CSS Scroll-Driven Animations API?
Firefox/Safari don't support `animation-timeline: scroll()`. JS fallback would negate the zero-JS benefit.

## Animation Plan

| Element | Current | Enhancement | Type |
|---|---|---|---|
| Hero blobs | `breathe` keyframe (idle loop) | + parallax on scroll (0.3x speed) | JS scroll listener |
| Work cards (4) | fade-up, all together | Staggered reveal (80ms delay per card) | CSS `.reveal.delay-N` |
| Timeline entries (4) | fade-up, all together | Slide-in-left + stagger (100ms per entry) | CSS `.reveal.slide-left` + `.delay-N` |
| Section titles | fade-up | Fade-up + subtle scale (0.97 → 1) | CSS `.reveal.scale` |
| About fun cards (4) | fade-up, all together | Staggered reveal (80ms delay per card) | CSS `.reveal.delay-N` |

### No changes needed
- Hero text/badge — already animate on load with `reveal in`
- Nav — blur on scroll already works
- Footer — fade-up is fine
- Contact form — stepIn/pop/draw already work
- Stickers — float keyframe already works

## Implementation Details

### 1. New CSS reveal variants (global.css + ScrollReveal.astro)

```css
.reveal.slide-left {
  transform: translateX(-30px);
}
.reveal.slide-left.in {
  transform: translateX(0);
}
.reveal.scale {
  transform: translateY(24px) scale(0.97);
}
.reveal.scale.in {
  transform: translateY(0) scale(1);
}
```

### 2. Stagger delays (ScrollReveal.astro)

Extend delay system to support 5 levels:
```css
.reveal.delay-1 { transition-delay: 80ms; }
.reveal.delay-2 { transition-delay: 160ms; }
.reveal.delay-3 { transition-delay: 240ms; }
.reveal.delay-4 { transition-delay: 320ms; }
.reveal.delay-5 { transition-delay: 400ms; }
```

### 3. Hero parallax (NavScripts.astro or new ScrollScripts.astro)

Single passive scroll listener that translates hero blobs at 0.3x scroll speed:
```js
const blobs = document.querySelectorAll('.hero-blob');
window.addEventListener('scroll', () => {
  const y = window.scrollY * 0.3;
  blobs.forEach(b => b.style.transform = `translateY(${y}px)`);
}, { passive: true });
```

### 4. Reduced motion support

```css
@media (prefers-reduced-motion: reduce) {
  .reveal { transition: none !important; opacity: 1 !important; transform: none !important; }
  .hero-blob { animation: none !important; }
}
```

### 5. Component markup updates

- `Work.astro`: Add `delay-1` through `delay-4` to each WorkCard wrapper
- `Experience.astro`: Add `reveal slide-left delay-1` through `delay-4` to each TimelineEntry wrapper (already has `delayClass` prop)
- `About.astro`: Add `reveal scale` to section title, `delay-1` through `delay-4` to fun cards
- `Hero.astro`: No changes needed (blobs targeted by scroll script via class)

## Files to modify

1. `src/styles/global.css` — reduced motion media query
2. `src/components/ScrollReveal.astro` — new reveal variants + delay-5
3. `src/components/Work.astro` — stagger delays on cards
4. `src/components/Experience.astro` — slide-left on entries
5. `src/components/About.astro` — scale on title, stagger on cards
6. `src/components/Hero.astro` — add `data-parallax` attribute to blobs
7. New: `src/components/ScrollScripts.astro` — parallax scroll listener

## Success criteria

- No new npm dependencies
- Total new JS < 1KB
- All animations respect `prefers-reduced-motion: reduce`
- Lighthouse Performance stays ≥ 95
- Timeline entries visibly slide in from left with stagger
- Work cards stagger in one-by-one
- Hero blobs drift upward as user scrolls down
