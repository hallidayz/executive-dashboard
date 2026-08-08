#!/usr/bin/env node
/**
 * WCAG contrast + Halliday brand rule validator.
 * Usage: node halliday-brand-guide/scripts/validate-colors.cjs
 */
const assert = require('assert');

const COLORS = {
  navy: '#02295B',
  gold: '#FDA700',
  canvas: '#D6D6D6',
  charcoal: '#333F3F',
  silver: '#B0B5B3',
  muted: '#D8D8D6',
  critical: '#E11D48',
  warning: '#F59E0B',
  success: '#059669',
};

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}

function channel(c) {
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a, b) {
  const L1 = luminance(a);
  const L2 = luminance(b);
  const light = Math.max(L1, L2);
  const dark = Math.min(L1, L2);
  return (light + 0.05) / (dark + 0.05);
}

const failures = [];

function check(name, ok, detail) {
  if (!ok) failures.push(`${name}: ${detail}`);
  else console.log(`✓ ${name}`);
}

const bodyOnCanvas = contrast(COLORS.charcoal, COLORS.canvas);
check(
  'Body charcoal on canvas ≥ 7 (AAA)',
  bodyOnCanvas >= 7,
  `ratio=${bodyOnCanvas.toFixed(2)}`
);

const headingOnCanvas = contrast(COLORS.navy, COLORS.canvas);
check(
  'Navy heading on canvas ≥ 4.5 (AA)',
  headingOnCanvas >= 4.5,
  `ratio=${headingOnCanvas.toFixed(2)}`
);

const ctaLabel = contrast(COLORS.navy, COLORS.gold);
check(
  'CTA navy on gold ≥ 4.5 (AA)',
  ctaLabel >= 4.5,
  `ratio=${ctaLabel.toFixed(2)}`
);

check(
  'Gold is not status warning hex',
  COLORS.gold.toUpperCase() !== COLORS.warning.toUpperCase(),
  'brand gold must stay distinct from --status-warning'
);

check(
  'Status triad distinct',
  new Set([COLORS.critical, COLORS.warning, COLORS.success, COLORS.gold]).size === 4,
  'critical/warning/success/gold must all differ'
);

// Brand rule: gold reserved for CTAs — encoded as documentation invariant
assert.strictEqual(COLORS.gold, '#FDA700');
assert.strictEqual(COLORS.navy, '#02295B');
assert.strictEqual(COLORS.canvas, '#D6D6D6');

if (failures.length) {
  console.error('\nFailures:');
  failures.forEach((f) => console.error(`✗ ${f}`));
  process.exit(1);
}

console.log('\nAll Halliday brand color checks passed.');
