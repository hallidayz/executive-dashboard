# Executive Chief of Staff Dashboard

React + TypeScript + Vite app with an optional Electron shell.

## Personal install & multi-device (Mac, Windows, iPhone, Android)

| Device | How to run | Where API keys live |
|--------|------------|---------------------|
| **Mac / Windows** | `npm run electron:dev` (best) | OS `safeStorage` (Keychain / Credential Manager). Encrypted blob is **not** portable between PCs. |
| **Mac / Windows browser** | `npm run dev` | Session only (cleared when the tab closes). |
| **iPhone / Android** | `npm run dev:lan` on a desktop, open `http://<your-lan-ip>:5173` | Session only. Add to Home Screen for an app-like tab. |

**Mac ↔ Windows:** Settings → System → Export Workspace → copy the JSON → Import on the other PC. Turn on **Include secrets** only when you need keys to travel (treat the file like a password vault). Do **not** copy Electron ciphertext between machines.

**Desktop → phone:** Export on Mac/Windows → AirDrop / Files / Drive → open the LAN URL on the phone → Import. Re-import or re-paste keys after the mobile browser session ends.

```bash
npm install
# Daily drivers (Mac or Windows)
npm run electron:dev

# Phone / tablet on the same Wi‑Fi
npm run dev:lan
# then open http://<desktop-lan-ip>:5173 on iPhone/Android
```

**First-run checklist**

1. Settings → System — confirm the detected device line (Electron vs phone browser).
2. Settings → Personalization — Halliday branding / theme.
3. Settings → Connectors — Demo connect (Local demo is expected).
4. Tools & Connectors — local demo boards appear.
5. Settings → AI Models → Free tier sources — save a gateway if you want.
6. Export / Import to move the workspace across your devices.

## Share on Vercel (layout / UX feedback)

Minimal config is in [`vercel.json`](vercel.json). Connect the GitHub repo in [Vercel](https://vercel.com) (Framework: Vite, Output: `dist`) or:

```bash
npx vercel
```

**What reviewers can do on the shared URL**

| Works for feedback | Limitation (be clear with testers) |
|--------------------|-------------------------------------|
| Full layout, nav, Command Center, Settings | Each browser has its **own** localStorage — nothing syncs to you |
| Demo-connect connectors, Tools boards, personalization | Status stays **Local demo** — no live OAuth / vendor APIs yet |
| Free AI / LLM **setup** (paste a key, save provider) | Keys are **session-only** in the browser; advisor replies are still **mock** until a live `LlmClient` ships |
| Export / Import workspace JSON | Don’t ask testers to export with secrets unless you trust them |

Electron on Mac/Windows remains the better personal install; Vercel is the shareable web preview for phones and remote feedback.

## Design system

**Source of truth:** [`halliday-brand-guide/`](halliday-brand-guide/)

Default brand preset is **Halliday Corporate** (`brandPreset: 'executive'`):

| Role | HEX |
|------|-----|
| Navy | `#02295B` |
| Gold (CTAs ~10%) | `#FDA700` |
| Canvas (~60%) | `#D6D6D6` |
| Charcoal (body) | `#333F3F` |
| Silver (borders) | `#B0B5B3` |
| Muted (cards) | `#D8D8D6` |

Status (critical / warning / success) stays red / amber / green and is never remapped by brand personalization.

Validate tokens:

```bash
node halliday-brand-guide/scripts/validate-colors.cjs
```

## Stack notes

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for more.
