# Design Rules

## Do

- Default new screens to canvas `#D6D6D6` with muted `#D8D8D6` for nested surfaces.
- Use navy `#02295B` for headers, sidebar, and primary text.
- Use charcoal `#333F3F` for body copy.
- Use silver `#B0B5B3` for borders, dividers, and muted captions.
- Reserve gold `#FDA700` for high-impact CTAs, selected primary controls, and focal accents (~10%).
- Put navy text on gold buttons (`.brand-button` / `--brand-on-accent`).
- Keep alerts and status as red (critical), amber (warning), green (success).
- Prefer `.brand-*` and design tokens over hardcoded indigo/purple utilities.

## Don't

- Don't use indigo/violet as brand identity (legacy personalization remaps exist only as bridge).
- Don't use amber Tailwind utilities as primary CTAs — amber is **warning status**.
- Don't recolor rose/emerald status families through brand personalization.
- Don't put white text on gold as the default CTA treatment.
- Don't paint large surfaces gold (breaks 60/30/10).
- Don't use tartan weaves as default app chrome.

## Compliance checklist

- [ ] Page background is canvas (or intentional dark shell), not indigo wash
- [ ] Primary CTA uses gold fill + navy label
- [ ] Body text is charcoal on light / readable light on dark
- [ ] Borders/dividers use silver or `--app-border`
- [ ] Cards/sections use muted fill, not random purple tints
- [ ] Critical alerts are red/rose; warnings amber; success emerald
- [ ] No new `bg-indigo-*` / `bg-purple-*` identity chrome
- [ ] Settings preset default still resolves to Halliday Corporate (`executive`)
