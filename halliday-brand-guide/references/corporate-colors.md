# Corporate Colors

Primary and secondary Halliday corporate palette for digital product UI.

## Primary palette

| Color | HEX | RGB | Primary use |
|-------|-----|-----|-------------|
| Executive Navy | `#02295B` | `2, 41, 91` | Core brand: headlines, navbars, dark anchors, primary text on canvas |
| Vibrant Gold | `#FDA700` | `253, 167, 0` | Visual accent: CTAs, key icons, badges (~10% of UI) |
| Warm Off-White | `#D6D6D6` | `214, 214, 214` | Main canvas (~60% of UI) |

## Secondary palette

| Color | HEX | RGB | Primary use |
|-------|-----|-----|-------------|
| Charcoal Slate | `#333F3F` | `51, 63, 63` | Body typography (softer than pure black) |
| Cool Silver | `#B0B5B3` | `176, 181, 179` | Captions, borders, dividers, placeholders |
| Muted Slate Fill | `#D8D8D6` | `216, 216, 214` | Nested cards, alt section fills over canvas |

## CSS tokens

```css
:root {
  --color-primary-navy: #02295b;
  --color-primary-gold: #fda700;
  --color-primary-canvas: #d6d6d6;
  --color-secondary-charcoal: #333f3f;
  --color-secondary-silver: #b0b5b3;
  --color-secondary-muted-fill: #d8d8d6;

  --bg-page: var(--color-primary-canvas);
  --bg-section-alt: var(--color-secondary-muted-fill);
  --text-heading: var(--color-primary-navy);
  --text-body: var(--color-secondary-charcoal);
  --text-muted: var(--color-secondary-silver);
  --border-subtle: var(--color-secondary-silver);
  --accent-cta: var(--color-primary-gold);
}
```

## Accessibility (WCAG)

| Pair | Ratio target | Notes |
|------|--------------|-------|
| Charcoal `#333F3F` on canvas `#D6D6D6` | AAA for body | Default body text |
| Navy `#02295B` on canvas `#D6D6D6` | Strong AA/AAA | Headings / scan text |
| Navy `#02295B` on gold `#FDA700` | Required for CTA labels | Never white-on-gold as default |

## Print / CMYK (approximate)

Use for print collateral aligned to digital HEX; verify on press proofs.

| Color | Approx CMYK |
|-------|-------------|
| Navy | `C100 M80 Y20 K40` |
| Gold | `C0 M40 Y100 K0` |
| Off-White | `C0 M0 Y0 K16` |
| Charcoal | `C50 M30 Y30 K70` |
| Silver | `C20 M10 Y15 K30` |
| Muted | `C0 M0 Y2 K15` |

## Semantic status (not corporate identity)

| Role | HEX | Token |
|------|-----|-------|
| Critical | `#E11D48` | `--status-critical` |
| Warning | `#F59E0B` | `--status-warning` |
| Success | `#059669` | `--status-success` |
