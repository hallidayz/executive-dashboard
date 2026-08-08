/** Shared color math for the brand gradient editor. */

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number; // 0–100
}

export interface Hsva {
  h: number; // 0–360
  s: number; // 0–100
  v: number; // 0–100
  a: number; // 0–100
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function normalizeHex(input: string, fallback = '#FDA700'): string {
  const raw = (input || '').trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(raw)) return raw.toUpperCase();
  if (/^[0-9A-Fa-f]{6}$/.test(raw)) return `#${raw.toUpperCase()}`;
  const short = raw.startsWith('#') ? raw.slice(1) : raw;
  if (/^[0-9A-Fa-f]{3}$/.test(short)) {
    const [a, b, c] = short;
    return `#${a}${a}${b}${b}${c}${c}`.toUpperCase();
  }
  return fallback.toUpperCase();
}

export function isCompleteHex(input: string): boolean {
  const raw = (input || '').trim();
  return /^#?[0-9A-Fa-f]{6}$/.test(raw) || /^#?[0-9A-Fa-f]{3}$/.test(raw);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = normalizeHex(hex).slice(1);
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hexToHsva(hex: string, alpha = 100): Hsva {
  const { r, g, b } = hexToRgb(hex);
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d) % 6;
    else if (max === gg) h = (bb - rr) / d + 2;
    else h = (rr - gg) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : (d / max) * 100;
  const v = max * 100;
  return { h, s, v, a: clamp(alpha, 0, 100) };
}

export function hsvaToRgb(hsva: Hsva): { r: number; g: number; b: number } {
  const h = ((hsva.h % 360) + 360) % 360;
  const s = clamp(hsva.s, 0, 100) / 100;
  const v = clamp(hsva.v, 0, 100) / 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h < 180) [rp, gp, bp] = [0, c, x];
  else if (h < 240) [rp, gp, bp] = [0, x, c];
  else if (h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];
  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  };
}

export function hsvaToHex(hsva: Hsva): string {
  const { r, g, b } = hsvaToRgb(hsva);
  return rgbToHex(r, g, b);
}

export function rgbaCss(hex: string, alphaPercent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const a = clamp(alphaPercent, 0, 100) / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
