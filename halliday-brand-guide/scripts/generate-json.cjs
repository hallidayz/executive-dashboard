#!/usr/bin/env node
/**
 * Emit Halliday JSON token config for Cursor / tooling.
 * Usage: node halliday-brand-guide/scripts/generate-json.cjs [outfile]
 */
const fs = require('fs');
const path = require('path');

const config = {
  name: 'Halliday Corporate',
  version: 1,
  source: 'halliday-brand-guide',
  presetId: 'executive',
  corporate: {
    navy: '#02295B',
    gold: '#FDA700',
    canvas: '#D6D6D6',
    charcoal: '#333F3F',
    silver: '#B0B5B3',
    muted: '#D8D8D6',
  },
  roles: {
    headersNavPrimaryText: 'navy',
    highImpactCtas: 'gold',
    mainBackgrounds: 'canvas',
    bodyCopy: 'charcoal',
    bordersDividers: 'silver',
    cardFills: 'muted',
  },
  ratios: {
    canvas: 0.6,
    structure: 0.3,
    accent: 0.1,
  },
  cta: {
    background: '#FDA700',
    label: '#02295B',
  },
  status: {
    critical: '#E11D48',
    warning: '#F59E0B',
    success: '#059669',
  },
  cssVars: {
    '--color-primary-navy': '#02295B',
    '--color-primary-gold': '#FDA700',
    '--color-primary-canvas': '#D6D6D6',
    '--color-secondary-charcoal': '#333F3F',
    '--color-secondary-silver': '#B0B5B3',
    '--color-secondary-muted-fill': '#D8D8D6',
    '--brand-accent': '#FDA700',
    '--brand-accent-secondary': '#02295B',
    '--brand-on-accent': '#02295B',
    '--status-critical': '#E11D48',
    '--status-warning': '#F59E0B',
    '--status-success': '#059669',
  },
  tartan: {
    note: 'Heritage reference only — see references/tartan-colors.md',
    useInAppChrome: false,
  },
};

const out = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, '..', 'generated', 'halliday-tokens.json');

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
console.log(`Wrote ${out}`);
