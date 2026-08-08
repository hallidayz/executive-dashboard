import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp, Pipette } from 'lucide-react';
import {
  clamp,
  hexToHsva,
  hsvaToHex,
  hsvaToRgb,
  isCompleteHex,
  normalizeHex,
  type Hsva,
} from '../services/colorUtils';

type ChannelMode = 'rgb' | 'hex' | 'hsl';

const POPOVER_WIDTH = 240;
const VIEW_PAD = 8;

interface ColorPickerPopoverProps {
  value: string;
  onChange: (hex: string) => void;
  onClose: () => void;
  /** Anchor element for positioning */
  anchorRect: DOMRect | null;
  /** Keep clicks on the swatch from immediately closing the popover */
  anchorEl?: HTMLElement | null;
}

function fitPopoverPosition(
  anchor: DOMRect,
  panelW: number,
  panelH: number
): { top: number; left: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(panelW || POPOVER_WIDTH, vw - VIEW_PAD * 2);
  const height = Math.min(panelH || 260, vh - VIEW_PAD * 2);

  // Prefer below the swatch; flip above when there isn't enough room.
  let top = anchor.bottom + VIEW_PAD;
  if (top + height > vh - VIEW_PAD) {
    top = anchor.top - height - VIEW_PAD;
  }
  if (top < VIEW_PAD) {
    top = VIEW_PAD;
  }
  if (top + height > vh - VIEW_PAD) {
    top = Math.max(VIEW_PAD, vh - VIEW_PAD - height);
  }

  // Align to the right edge of the swatch, then clamp into the viewport.
  let left = anchor.right - width;
  if (left < VIEW_PAD) left = VIEW_PAD;
  if (left + width > vw - VIEW_PAD) {
    left = Math.max(VIEW_PAD, vw - VIEW_PAD - width);
  }

  return { top, left };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
  else if (max === gg) h = ((bb - rr) / d + 2) / 6;
  else h = ((rr - gg) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hh = ((h % 360) + 360) % 360 / 360;
  const ss = clamp(s, 0, 100) / 100;
  const ll = clamp(l, 0, 100) / 100;
  if (ss === 0) {
    const v = Math.round(ll * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
  const p = 2 * ll - q;
  return {
    r: Math.round(hue2rgb(p, q, hh + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hh) * 255),
    b: Math.round(hue2rgb(p, q, hh - 1 / 3) * 255),
  };
}

/** Compact DevTools-style color picker popover (ported to body, viewport-clamped). */
export const ColorPickerPopover: React.FC<ColorPickerPopoverProps> = ({
  value,
  onChange,
  onClose,
  anchorRect,
  anchorEl,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const svRef = useRef<HTMLDivElement>(null);
  const [hsva, setHsva] = useState<Hsva>(() => hexToHsva(normalizeHex(value, '#FDA700')));
  const [hexDraft, setHexDraft] = useState(normalizeHex(value, '#FDA700'));
  const [mode, setMode] = useState<ChannelMode>('rgb');
  const [coords, setCoords] = useState<{ top: number; left: number }>(() =>
    anchorRect
      ? fitPopoverPosition(anchorRect, POPOVER_WIDTH, 260)
      : { top: VIEW_PAD, left: VIEW_PAD }
  );
  const draggingSv = useRef(false);
  const draggingHue = useRef(false);

  useEffect(() => {
    const next = hexToHsva(normalizeHex(value, '#FDA700'));
    setHsva(next);
    setHexDraft(hsvaToHex(next));
  }, [value]);

  useLayoutEffect(() => {
    const place = () => {
      if (!panelRef.current) return;
      const anchor = anchorEl?.getBoundingClientRect() ?? anchorRect;
      if (!anchor) return;
      const rect = panelRef.current.getBoundingClientRect();
      setCoords(fitPopoverPosition(anchor, rect.width, rect.height));
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [anchorRect, anchorEl, mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorEl?.contains(target)) return;
      onClose();
    };
    window.addEventListener('keydown', onKey);
    // Delay so the opening click doesn't immediately dismiss.
    const timer = window.setTimeout(() => {
      window.addEventListener('mousedown', onPointer);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onPointer);
    };
  }, [onClose, anchorEl]);

  const commit = (next: Hsva) => {
    setHsva(next);
    const hex = hsvaToHex(next);
    setHexDraft(hex);
    onChange(hex);
  };

  const onSvPointer = (clientX: number, clientY: number) => {
    const el = svRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const s = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
    const v = clamp(100 - ((clientY - rect.top) / rect.height) * 100, 0, 100);
    commit({ ...hsva, s, v });
  };

  const pickEyeDropper = async () => {
    const EyeDropperCtor = (window as unknown as { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } })
      .EyeDropper;
    if (!EyeDropperCtor) return;
    try {
      const result = await new EyeDropperCtor().open();
      commit(hexToHsva(normalizeHex(result.sRGBHex)));
    } catch {
      /* user cancelled */
    }
  };

  const rgb = hsvaToRgb(hsva);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hueColor = hsvaToHex({ ...hsva, s: 100, v: 100, a: 100 });
  const hex = hsvaToHex(hsva);

  const panel = (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        width: POPOVER_WIDTH,
        maxWidth: `calc(100vw - ${VIEW_PAD * 2}px)`,
        maxHeight: `calc(100vh - ${VIEW_PAD * 2}px)`,
        zIndex: 9999,
      }}
      className="rounded-lg border border-slate-300 bg-white text-slate-800 shadow-2xl overflow-auto"
      role="dialog"
      aria-label="Color picker"
    >
      <div
        ref={svRef}
        className="relative h-[140px] w-full cursor-crosshair"
        style={{
          background: `
            linear-gradient(to top, #000, transparent),
            linear-gradient(to right, #fff, ${hueColor})
          `,
        }}
        onPointerDown={(e) => {
          draggingSv.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          onSvPointer(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (!draggingSv.current) return;
          onSvPointer(e.clientX, e.clientY);
        }}
        onPointerUp={() => {
          draggingSv.current = false;
        }}
      >
        <div
          className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
          style={{ left: `${hsva.s}%`, top: `${100 - hsva.v}%`, background: hex }}
        />
      </div>

      <div className="flex items-center gap-3 px-3 py-2.5">
        <button
          type="button"
          onClick={pickEyeDropper}
          className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-40"
          title={
            'EyeDropper' in window
              ? 'Pick color from screen'
              : 'Eyedropper not supported in this browser'
          }
          disabled={!('EyeDropper' in window)}
        >
          <Pipette className="w-4 h-4" />
        </button>
        <div
          className="h-8 w-8 rounded-full border border-slate-300 shadow-inner shrink-0"
          style={{ backgroundColor: hex }}
          title={hex}
        />
        <div
          className="relative flex-1 h-3 rounded-full cursor-pointer"
          style={{
            background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
          }}
          onPointerDown={(e) => {
            draggingHue.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            const rect = e.currentTarget.getBoundingClientRect();
            const h = clamp(((e.clientX - rect.left) / rect.width) * 360, 0, 359.9);
            commit({ ...hsva, h });
          }}
          onPointerMove={(e) => {
            if (!draggingHue.current) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const h = clamp(((e.clientX - rect.left) / rect.width) * 360, 0, 359.9);
            commit({ ...hsva, h });
          }}
          onPointerUp={() => {
            draggingHue.current = false;
          }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 border-white shadow"
            style={{ left: `${(hsva.h / 360) * 100}%`, background: hueColor }}
          />
        </div>
      </div>

      <div className="px-3 pb-3 flex items-end gap-1.5">
        {mode === 'hex' && (
          <div className="flex-1 space-y-0.5">
            <label className="text-[10px] font-semibold text-slate-500">Hex</label>
            <input
              type="text"
              value={hexDraft}
              spellCheck={false}
              onChange={(e) => {
                const raw = e.target.value;
                setHexDraft(raw);
                if (isCompleteHex(raw)) commit(hexToHsva(normalizeHex(raw)));
              }}
              onBlur={() => setHexDraft(hex)}
              className="w-full px-2 py-1.5 rounded border border-slate-300 bg-white text-xs font-mono uppercase"
            />
          </div>
        )}

        {mode === 'rgb' &&
          (
            [
              ['R', rgb.r],
              ['G', rgb.g],
              ['B', rgb.b],
            ] as const
          ).map(([label, val]) => (
            <div key={label} className="flex-1 space-y-0.5">
              <label className="text-[10px] font-semibold text-slate-500">{label}</label>
              <input
                type="number"
                min={0}
                max={255}
                value={val}
                onChange={(e) => {
                  const n = clamp(Number(e.target.value) || 0, 0, 255);
                  const nextRgb = { ...rgb, [label.toLowerCase()]: n } as typeof rgb;
                  commit(hexToHsva(normalizeHex(rgbToHexSafe(nextRgb.r, nextRgb.g, nextRgb.b))));
                }}
                className="w-full px-1.5 py-1.5 rounded border border-slate-300 bg-white text-xs font-mono text-center"
              />
            </div>
          ))}

        {mode === 'hsl' &&
          (
            [
              ['H', hsl.h, 360],
              ['S', hsl.s, 100],
              ['L', hsl.l, 100],
            ] as const
          ).map(([label, val, max]) => (
            <div key={label} className="flex-1 space-y-0.5">
              <label className="text-[10px] font-semibold text-slate-500">{label}</label>
              <input
                type="number"
                min={0}
                max={max}
                value={val}
                onChange={(e) => {
                  const n = clamp(Number(e.target.value) || 0, 0, max);
                  const next = {
                    h: label === 'H' ? n : hsl.h,
                    s: label === 'S' ? n : hsl.s,
                    l: label === 'L' ? n : hsl.l,
                  };
                  const converted = hslToRgb(next.h, next.s, next.l);
                  commit(hexToHsva(normalizeHex(rgbToHexSafe(converted.r, converted.g, converted.b))));
                }}
                className="w-full px-1.5 py-1.5 rounded border border-slate-300 bg-white text-xs font-mono text-center"
              />
            </div>
          ))}

        <button
          type="button"
          onClick={() =>
            setMode((m) => (m === 'rgb' ? 'hex' : m === 'hex' ? 'hsl' : 'rgb'))
          }
          className="mb-0.5 p-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
          title="Cycle RGB / Hex / HSL"
        >
          <span className="flex flex-col items-center leading-none">
            <ChevronUp className="w-3 h-3" />
            <ChevronDown className="w-3 h-3 -mt-0.5" />
          </span>
        </button>
      </div>
    </div>
  );

  return createPortal(panel, document.body);
};

function rgbToHexSafe(r: number, g: number, b: number): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

interface ColorHexRowProps {
  label: string;
  value: string;
  fallback?: string;
  onChange: (hex: string) => void;
}

/** Theme-settings style row: label · hex · swatch (opens popover). */
export const ColorHexRow: React.FC<ColorHexRowProps> = ({
  label,
  value,
  fallback = '#FDA700',
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const swatchRef = useRef<HTMLButtonElement>(null);
  const display = isCompleteHex(value) ? normalizeHex(value, fallback) : fallback;

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-800/80 last:border-b-0">
      <label className="w-[40%] min-w-[140px] text-xs font-medium text-slate-300 shrink-0">
        {label}
      </label>
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <input
          type="text"
          value={value}
          spellCheck={false}
          onChange={(e) => {
            const raw = e.target.value;
            if (isCompleteHex(raw)) onChange(normalizeHex(raw, fallback));
            else onChange(raw);
          }}
          onBlur={() => {
            if (!isCompleteHex(value)) onChange(normalizeHex(value, fallback));
            else onChange(normalizeHex(value, fallback));
          }}
          className="flex-1 min-w-0 px-3 py-2 rounded-lg glass-input text-xs font-mono uppercase"
          aria-label={`${label} hex`}
        />
        <button
          ref={swatchRef}
          type="button"
          onClick={() => {
            const rect = swatchRef.current?.getBoundingClientRect() ?? null;
            setAnchor(rect);
            setOpen((v) => !v);
          }}
          className="h-9 w-9 rounded-md border border-slate-600 shadow-inner shrink-0 cursor-pointer hover:ring-2 hover:ring-[var(--brand-accent-border)]"
          style={{ backgroundColor: display }}
          title="Open color picker"
          aria-label={`Pick ${label}`}
        />
      </div>
      {open && (
        <ColorPickerPopover
          value={display}
          anchorRect={anchor}
          anchorEl={swatchRef.current}
          onChange={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};
