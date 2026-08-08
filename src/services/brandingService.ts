import type {
  AppSettings,
  BrandGradientStop,
  BrandGradientType,
  BrandIntensity,
  BrandPresetId,
  FontPresetId,
} from '../types';
import { clamp, normalizeHex as normalizeHexShared, rgbaCss } from './colorUtils';

export interface BrandPalette {
  id: BrandPresetId;
  label: string;
  description: string;
  accent: string;
  secondary: string;
  /** Suggested primary font tint on neutrals. */
  font: string;
  /** Suggested secondary font tint on neutrals. */
  secondaryFont: string;
  /** Text on primary accent (defaults via contrast helper when omitted). */
  primaryContrast?: string;
  /** Text on secondary accent. */
  secondaryContrast?: string;
}

export interface FontPack {
  id: FontPresetId;
  label: string;
  description: string;
  body: string;
  display: string;
  /** Google Fonts CSS URL, or empty for system stack */
  googleHref?: string;
}

export const BRAND_PRESETS: BrandPalette[] = [
  {
    id: 'executive',
    label: 'Halliday Corporate',
    description: 'Official Halliday brand guide default (Navy / Gold / Canvas)',
    accent: '#FDA700',
    secondary: '#02295B',
    font: '#02295B',
    secondaryFont: '#333F3F',
    primaryContrast: '#02295B',
    secondaryContrast: '#D6D6D6',
  },
  {
    id: 'indigo',
    label: 'Indigo Pulse',
    description: 'Optional indigo → violet personalization (not the Halliday default)',
    accent: '#6366F1',
    secondary: '#9333EA',
    font: '#818CF8',
    secondaryFont: '#C084FC',
    primaryContrast: '#FFFFFF',
    secondaryContrast: '#FFFFFF',
  },
  {
    id: 'ocean',
    label: 'Ocean Focus',
    description: 'Teal → cyan for calm clarity',
    accent: '#0D9488',
    secondary: '#0891B2',
    font: '#2DD4BF',
    secondaryFont: '#67E8F9',
    primaryContrast: '#FFFFFF',
    secondaryContrast: '#FFFFFF',
  },
  {
    id: 'forest',
    label: 'Forest Signal',
    description: 'Emerald → lime for growth',
    accent: '#059669',
    secondary: '#65A30D',
    font: '#34D399',
    secondaryFont: '#A3E635',
    primaryContrast: '#FFFFFF',
    secondaryContrast: '#14532D',
  },
  {
    id: 'sunset',
    label: 'Sunset Drive',
    description: 'Amber → rose for energy',
    accent: '#D97706',
    secondary: '#E11D48',
    font: '#FBBF24',
    secondaryFont: '#FB7185',
    primaryContrast: '#0F172A',
    secondaryContrast: '#FFFFFF',
  },
  {
    id: 'slate',
    label: 'Slate Steel',
    description: 'Cool slate → blue-gray',
    accent: '#475569',
    secondary: '#64748B',
    font: '#94A3B8',
    secondaryFont: '#CBD5E1',
    primaryContrast: '#FFFFFF',
    secondaryContrast: '#FFFFFF',
  },
];

/** Canonical Halliday design-system defaults (Navy / Gold / Canvas). */
export const EXECUTIVE_PALETTE = BRAND_PRESETS[0];
/** Alias for the official Halliday brand guide preset. */
export const HALLIDAY_PALETTE = EXECUTIVE_PALETTE;

export const FONT_PRESETS: FontPack[] = [
  {
    id: 'inter-outfit',
    label: 'Inter + Outfit',
    description: 'Clean product UI (default)',
    body: "'Inter', system-ui, -apple-system, sans-serif",
    display: "'Outfit', 'Inter', system-ui, sans-serif",
    googleHref:
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap',
  },
  {
    id: 'dm-fraunces',
    label: 'DM Sans + Fraunces',
    description: 'Modern UI with editorial headings',
    body: "'DM Sans', system-ui, sans-serif",
    display: "'Fraunces', Georgia, serif",
    googleHref:
      'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap',
  },
  {
    id: 'source',
    label: 'Source Sans',
    description: 'Readable document-style UI',
    body: "'Source Sans 3', system-ui, sans-serif",
    display: "'Source Sans 3', system-ui, sans-serif",
    googleHref:
      'https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
  },
  {
    id: 'plex',
    label: 'IBM Plex Sans',
    description: 'Technical / systems feel',
    body: "'IBM Plex Sans', system-ui, sans-serif",
    display: "'IBM Plex Sans', system-ui, sans-serif",
    googleHref:
      'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
  },
  {
    id: 'system',
    label: 'System UI',
    description: 'Native OS fonts only',
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
];

const INTENSITY_ALPHA: Record<BrandIntensity, { soft: number; border: number; glow: number; button: number }> = {
  soft: { soft: 0.1, border: 0.28, glow: 0.22, button: 0.88 },
  balanced: { soft: 0.16, border: 0.4, glow: 0.35, button: 1 },
  bold: { soft: 0.24, border: 0.55, glow: 0.5, button: 1 },
};

export function normalizeHex(input: string, fallback: string): string {
  return normalizeHexShared(input, fallback);
}

let stopSeq = 0;
export function createGradientStop(
  color: string,
  position: number,
  alpha = 100,
  id?: string
): BrandGradientStop {
  stopSeq += 1;
  return {
    id: id || `stop-${Date.now().toString(36)}-${stopSeq}`,
    color: normalizeHex(color, '#FDA700'),
    position: clamp(Math.round(position), 0, 100),
    alpha: clamp(Math.round(alpha), 0, 100),
  };
}

export function stopsFromPair(accent: string, secondary: string): BrandGradientStop[] {
  return [
    createGradientStop(accent, 0, 100, 'stop-start'),
    createGradientStop(secondary, 100, 100, 'stop-end'),
  ];
}

export function normalizeGradientStops(
  stops: BrandGradientStop[] | undefined,
  accent = '#FDA700',
  secondary = '#02295B'
): BrandGradientStop[] {
  if (!stops?.length) return stopsFromPair(accent, secondary);
  const cleaned = stops
    .map((s, i) =>
      createGradientStop(s.color || accent, s.position ?? (i === 0 ? 0 : 100), s.alpha ?? 100, s.id)
    )
    .sort((a, b) => a.position - b.position);
  return cleaned.length >= 2 ? cleaned : stopsFromPair(accent, secondary);
}

export function buildBrandGradientCss(
  type: BrandGradientType,
  angle: number,
  stops: BrandGradientStop[],
  solidFallback?: string
): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  if (!sorted.length) return solidFallback || '#FDA700';
  if (sorted.length === 1) {
    return rgbaCss(sorted[0].color, sorted[0].alpha);
  }
  const stopCss = sorted.map((s) => `${rgbaCss(s.color, s.alpha)} ${clamp(s.position, 0, 100)}%`).join(', ');
  if (type === 'radial') {
    return `radial-gradient(circle, ${stopCss})`;
  }
  const deg = ((Math.round(angle) % 360) + 360) % 360;
  return `linear-gradient(${deg}deg, ${stopCss})`;
}

/** True when input is a complete #RRGGBB (or #RGB) HTML color. */
export function isCompleteHex(input: string): boolean {
  const raw = (input || '').trim();
  return /^#?[0-9A-Fa-f]{6}$/.test(raw) || /^#?[0-9A-Fa-f]{3}$/.test(raw);
}

/** Readable brand label color derived from a primary accent. */
export function suggestFontColorFromAccent(accent: string): string {
  return mixTowardWhite(normalizeHex(accent, '#FDA700'), 0.28);
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Text/icon color that stays readable on brand gradient buttons. */
export function contrastOnAccent(accent: string): string {
  return relativeLuminance(normalizeHex(accent, '#FDA700')) > 0.45 ? '#02295B' : '#FFFFFF';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = normalizeHex(hex, '#FDA700').slice(1);
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function mixTowardWhite(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`.toUpperCase();
}

function mixTowardBlack(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const mix = (c: number) => Math.round(c * (1 - amount));
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`.toUpperCase();
}

export function resolveBrandColors(
  settings: Pick<
    AppSettings,
    | 'brandPreset'
    | 'accentColor'
    | 'accentSecondary'
    | 'primaryFontColor'
    | 'secondaryFontColor'
    | 'primaryContrastColor'
    | 'secondaryContrastColor'
  >
): {
  accent: string;
  secondary: string;
  primaryFont: string;
  secondaryFont: string;
  primaryContrast: string;
  secondaryContrast: string;
} {
  const preset = BRAND_PRESETS.find((p) => p.id === settings.brandPreset);
  // Prefer stored hex fields so custom edits always win; presets seed those fields on apply.
  const accent = normalizeHex(
    settings.accentColor,
    preset && settings.brandPreset !== 'custom' ? preset.accent : '#FDA700'
  );
  const secondary = normalizeHex(
    settings.accentSecondary,
    preset && settings.brandPreset !== 'custom' ? preset.secondary : '#02295B'
  );
  const presetFont = preset?.font || suggestFontColorFromAccent(accent);
  const presetSecondaryFont = preset?.secondaryFont || suggestFontColorFromAccent(secondary);
  return {
    accent,
    secondary,
    primaryFont: normalizeHex(settings.primaryFontColor, presetFont),
    secondaryFont: normalizeHex(settings.secondaryFontColor, presetSecondaryFont),
    primaryContrast: normalizeHex(
      settings.primaryContrastColor,
      preset?.primaryContrast || contrastOnAccent(accent)
    ),
    secondaryContrast: normalizeHex(
      settings.secondaryContrastColor,
      preset?.secondaryContrast || contrastOnAccent(secondary)
    ),
  };
}

function ensureGoogleFont(href?: string): void {
  const id = 'exec-dash-brand-font';
  const existing = document.getElementById(id) as HTMLLinkElement | null;
  if (!href) {
    existing?.remove();
    return;
  }
  if (existing) {
    if (existing.href !== href) existing.href = href;
    return;
  }
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

export type BrandingSettings = Pick<
  AppSettings,
  | 'brandPreset'
  | 'accentColor'
  | 'accentSecondary'
  | 'primaryFontColor'
  | 'secondaryFontColor'
  | 'primaryContrastColor'
  | 'secondaryContrastColor'
  | 'brandGradientType'
  | 'brandGradientAngle'
  | 'brandGradientStops'
  | 'brandIntensity'
  | 'useBrandGradient'
  | 'fontPreset'
>;

/**
 * Apply full personalization chrome: brand colors, button tokens, and fonts.
 * Safe to call on boot and after Save personalization.
 */
export function applyBranding(settings: BrandingSettings): void {
  const root = document.documentElement;
  const {
    accent,
    secondary,
    primaryFont,
    secondaryFont,
    primaryContrast,
    secondaryContrast,
  } = resolveBrandColors(settings);
  const intensity = settings.brandIntensity || 'balanced';
  const alphas = INTENSITY_ALPHA[intensity] || INTENSITY_ALPHA.balanced;
  const useGradient = settings.useBrandGradient !== false;
  const fontPack = FONT_PRESETS.find((f) => f.id === settings.fontPreset) || FONT_PRESETS[0];
  const stops = normalizeGradientStops(settings.brandGradientStops, accent, secondary);
  const type = settings.brandGradientType || 'linear';
  const angle = settings.brandGradientAngle ?? 135;
  const gradientCss = useGradient
    ? buildBrandGradientCss(type, angle, stops, accent)
    : `linear-gradient(${angle}deg, ${accent}, ${accent})`;
  const gradientXCss = useGradient
    ? buildBrandGradientCss(type === 'radial' ? 'linear' : type, type === 'radial' ? 90 : angle, stops, accent)
    : `linear-gradient(90deg, ${accent}, ${accent})`;

  ensureGoogleFont(fontPack.googleHref);

  /* Core design-system palette — halliday-brand-guide/ (always available) */
  root.style.setProperty('--color-primary-navy', '#02295B');
  root.style.setProperty('--color-primary-gold', '#FDA700');
  root.style.setProperty('--color-primary-canvas', '#D6D6D6');
  root.style.setProperty('--color-secondary-charcoal', '#333F3F');
  root.style.setProperty('--color-secondary-silver', '#B0B5B3');
  root.style.setProperty('--color-secondary-muted-fill', '#D8D8D6');
  root.style.setProperty('--accent-cta', accent);
  /* Semantic status — never driven by brand remaps (see halliday-brand-guide/) */
  root.style.setProperty('--status-critical', '#E11D48');
  root.style.setProperty('--status-warning', '#F59E0B');
  root.style.setProperty('--status-success', '#059669');

  // Functional text/bg tokens must follow shell theme (dark default vs light canvas).
  const isDarkShell =
    root.classList.contains('dark') || !root.classList.contains('light');
  if (isDarkShell) {
    root.style.setProperty('--bg-page', '#0b0d12');
    root.style.setProperty('--bg-section-alt', '#161b27');
    root.style.setProperty('--text-heading', '#f8fafc');
    root.style.setProperty('--text-body', '#e2e8f0');
    root.style.setProperty('--text-muted', '#94a3b8');
    root.style.setProperty('--border-subtle', 'rgba(255, 255, 255, 0.12)');
  } else {
    root.style.setProperty('--bg-page', 'var(--color-primary-canvas)');
    root.style.setProperty('--bg-section-alt', 'var(--color-secondary-muted-fill)');
    root.style.setProperty('--text-heading', 'var(--color-primary-navy)');
    root.style.setProperty('--text-body', 'var(--color-secondary-charcoal)');
    root.style.setProperty('--text-muted', 'var(--color-secondary-silver)');
    root.style.setProperty('--border-subtle', 'var(--color-secondary-silver)');
  }

  // Navy/charcoal fonts are for light canvas; lift them on dark shells.
  const fontPrimary =
    isDarkShell && primaryFont.toUpperCase() === '#02295B' ? '#FDA700' : primaryFont;
  const fontSecondary =
    isDarkShell && secondaryFont.toUpperCase() === '#333F3F' ? '#B0B5B3' : secondaryFont;

  root.style.setProperty('--brand-accent', accent);
  root.style.setProperty('--brand-accent-secondary', secondary);
  root.style.setProperty('--brand-font', fontPrimary);
  root.style.setProperty('--brand-font-secondary', fontSecondary);
  root.style.setProperty('--brand-on-accent', primaryContrast);
  root.style.setProperty('--brand-on-secondary', secondaryContrast);
  root.style.setProperty('--brand-accent-hover', mixTowardWhite(accent, 0.12));
  root.style.setProperty('--brand-accent-pressed', mixTowardBlack(accent, 0.12));
  root.style.setProperty('--brand-accent-soft', rgba(accent, alphas.soft));
  root.style.setProperty('--brand-accent-soft-strong', rgba(accent, Math.min(alphas.soft + 0.1, 0.4)));
  root.style.setProperty('--brand-accent-border', rgba(accent, alphas.border));
  root.style.setProperty('--brand-secondary-soft', rgba(secondary, alphas.soft));
  root.style.setProperty('--brand-secondary-border', rgba(secondary, alphas.border));
  root.style.setProperty('--brand-glow', rgba(accent, alphas.glow));
  root.style.setProperty('--brand-button', rgba(accent, alphas.button));
  root.style.setProperty('--brand-gradient', gradientCss);
  root.style.setProperty('--brand-gradient-x', gradientXCss);
  root.style.setProperty('--font-body', fontPack.body);
  root.style.setProperty('--font-display', fontPack.display);

  root.dataset.brandIntensity = intensity;
  root.dataset.brandGradient = useGradient ? 'on' : 'off';
  root.dataset.fontPreset = fontPack.id;
  root.dataset.brandApplied = 'true';
}
