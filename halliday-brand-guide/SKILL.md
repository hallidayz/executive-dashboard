---
name: halliday-brand-guide
description: >-
  Halliday corporate design system (Navy/Gold/Canvas). Use when designing UI,
  choosing colors, editing branding, themes, CTAs, navigation chrome, Settings
  personalization, CSS tokens, or any visual refresh of the executive dashboard.
---

# Halliday Brand Guide

Canonical source for this app lives in `halliday-brand-guide/`. App tokens in
`src/index.css` and `src/services/brandingService.ts` must mirror this package.

## 60 / 30 / 10 roles

| Color | HEX | Role |
|-------|-----|------|
| Navy | `#02295B` | Headers, navigation, primary text |
| Gold | `#FDA700` | High-impact CTAs only (~10% of design) |
| Off-White | `#D6D6D6` | Main backgrounds (~60% of design) |
| Charcoal | `#333F3F` | Body copy, readable text |
| Silver | `#B0B5B3` | Subtle borders, dividers |
| Muted | `#D8D8D6` | Card fills, secondary surfaces |

**CTA on gold:** label text must be `#02295B`.

## Status colors (locked)

Never remap brand personalization onto these:

- Critical / error → rose/red (`--status-critical`)
- Warning → amber (`--status-warning`) — **not** brand gold
- Success / all-clear → emerald (`--status-success`)

Brand gold is for CTAs via `.brand-button`, never for severity.

## Implementation map

- Tokens: `src/index.css` (`--color-primary-*`, `--brand-*`, `--status-*`)
- Runtime: `applyBranding()` in `src/services/brandingService.ts`
- Default preset id: `executive` (label **Halliday Corporate**)
- Prefer classes: `.brand-button`, `.brand-text`, `.brand-secondary-fill`, `.status-*`
- Do **not** invent indigo/purple identity chrome; do not use `bg-amber-*` for primary CTAs

## References

- [corporate-colors.md](references/corporate-colors.md)
- [tartan-colors.md](references/tartan-colors.md) (heritage reference only — not app chrome)
- [design-rules.md](references/design-rules.md)

## Scripts

```bash
node halliday-brand-guide/scripts/generate-css.cjs
node halliday-brand-guide/scripts/generate-json.cjs
node halliday-brand-guide/scripts/validate-colors.cjs
```
