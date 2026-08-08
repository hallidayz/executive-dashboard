# Halliday Brand Guide

Official design system for the Executive Chief of Staff Dashboard.

This package is the **source of truth**. The React app consumes the same HEX values via CSS custom properties in `src/index.css` and runtime branding in `src/services/brandingService.ts`.

## Package layout

```
halliday-brand-guide/
├── SKILL.md                 ← Agent skill (design / brand / color work)
├── README.md
├── references/
│   ├── corporate-colors.md  ← Corporate palette + WCAG
│   ├── tartan-colors.md     ← Heritage tartan lineages (reference only)
│   └── design-rules.md      ← Usage rules + compliance checklist
└── scripts/
    ├── generate-css.cjs      ← Emit CSS variable block
    ├── generate-json.cjs     ← Emit JSON token config
    └── validate-colors.cjs   ← WCAG + brand rule checks
```

## Corporate palette (app UI)

| Name | HEX | Use |
|------|-----|-----|
| Executive Navy | `#02295B` | Headers, navigation, primary text |
| Vibrant Gold | `#FDA700` | High-impact CTAs only (~10%) |
| Warm Off-White | `#D6D6D6` | Main backgrounds (~60%) |
| Charcoal Slate | `#333F3F` | Body copy |
| Cool Silver | `#B0B5B3` | Borders, dividers, muted captions |
| Muted Slate Fill | `#D8D8D6` | Card / secondary surfaces |

Gold CTA labels use navy `#02295B` for contrast.

## Semantic status (separate from brand)

| Role | Token | Typical Tailwind |
|------|-------|------------------|
| Critical | `--status-critical` | rose / red |
| Warning | `--status-warning` | amber |
| Success | `--status-success` | emerald |

Brand personalization must never retarget these families.

## How the app wires defaults

1. `INITIAL_SETTINGS.brandPreset = 'executive'` (Halliday Corporate) in `src/services/mockData.ts`
2. `BRAND_PRESETS[0]` / `HALLIDAY_PALETTE` in `src/services/brandingService.ts`
3. Light theme canvas + navy sidebar in `src/index.css`
4. Legacy indigo localStorage migrates via `storageService.ts`

## Cursor skill

Project skill: `.cursor/skills/halliday-brand-guide/SKILL.md` → points here so agents auto-apply these rules on design work.

## Related PDF

`halliday_brand_guides.pdf` in the repo root is the printed/visual companion. Prefer this folder for machine-readable tokens and rules.

## Scripts

```bash
node halliday-brand-guide/scripts/generate-css.cjs
node halliday-brand-guide/scripts/generate-json.cjs
node halliday-brand-guide/scripts/validate-colors.cjs
```
