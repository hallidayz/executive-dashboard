# Executive Chief of Staff Dashboard

React + TypeScript + Vite app with an optional Electron shell.

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
