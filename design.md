# Design — Freak Out!

Locked design system for Freak Out! (Less thinking, More doing). Future Hallmark runs read this file first; pages and components defer to it.

## System
- Genre · playful (post-Linear soft school, warm tactile, calm & focus)
- Macrostructure · Workbench (tactile task hub, cloud pet room, smart calendar, quiet analytics)
- Theme · Linen & Sage (warm paper base, gentle sage and earth accents, deep warm charcoal ink)
- Axes · warm-linen / soft-roman-serif / sage-earth

## Tokens (canonical)
```css
:root {
  /* Hallmark Warm Linen Palette */
  --color-paper:       #F9F7F2; /* oklch(97.5% 0.012 85) */
  --color-paper-2:     #EFE9DE; /* oklch(93.5% 0.020 85) */
  --color-paper-3:     #E5DEC9; /* oklch(89.5% 0.025 85) */
  --color-ink:         #2C2C24; /* oklch(27.0% 0.015 95) */
  --color-ink-2:       #5C5B50; /* oklch(47.0% 0.018 95) */
  --color-ink-3:       #8A887A; /* oklch(63.0% 0.015 95) */
  --color-rule:        #E2DACB; /* oklch(88.5% 0.018 85) */
  --color-rule-subtle: #ECE5D8; /* oklch(91.5% 0.012 85) */

  /* Sage / Focus Accent */
  --color-accent:      #6C7764; /* oklch(52.0% 0.040 135) */
  --color-accent-light:#EBF0E8; /* oklch(94.5% 0.015 135) */
  --color-accent-ink:  #F9F7F2;

  /* Earth / Energy Accent */
  --color-earth:       #9E745E; /* oklch(56.0% 0.065 55) */
  --color-earth-light: #F6EFEA; /* oklch(95.0% 0.015 55) */

  /* Focus Ring */
  --color-focus:       #6C7764;

  /* Typography */
  --font-display: 'Playfair Display', 'Mitr', Georgia, serif;
  --font-body:    'Prompt', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono:    ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Spacing Scale (4-pt Tailwind) */
  --space-3xs: 2px;
  --space-2xs: 4px;
  --space-xs:  8px;
  --space-sm:  12px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;
  --space-2xl: 48px;

  /* Motion */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 180ms;
  --dur-base: 240ms;
  --dur-slow: 360ms;

  /* Radii */
  --radius-card:  20px;
  --radius-pill:  9999px;
  --radius-input: 12px;
}
```

## CTA Voice & 8-State Discipline
- **Primary CTA (`.btn-primary`):** Warm sage fill (`--color-accent`), text `--color-accent-ink`, radius 9999px pill, upright text (never italic).
- **Secondary CTA (`.btn-secondary`):** Paper-2 fill with subtle rule border (`--color-rule`), hover lift `-1px`.
- **Destructive/Emergency (`.btn-panic`):** Soft rose-coral tint with gentle pulsing outline for Panic Calm Mode.
- All interactive elements must support: `default`, `hover`, `:focus-visible`, `:active`, `disabled`, `loading`, `error`, `success`.

## Anti-AI-Slop Rules
1. **No italic headings:** Display & headings are always roman (`font-style: normal`). No `<em>` inside headings.
2. **No radial neon mesh gradients:** Only tactile warm linen surfaces and clean subtle tinted cards.
3. **No re-drawn UI chrome:** No fake browser windows or fake traffic lights. Real interface elements only.
4. **Mobile responsiveness non-negotiable:** Render verified at 320px, 375px, 414px, and 768px. Root `overflow-x: clip`.

## Exports
Source of truth in `src/index.css`. Tailwind v4 imports naturally and provides utilities.
