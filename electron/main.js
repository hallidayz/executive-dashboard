/**
 * Legacy entry — package.json `main` points at main.cjs (CommonJS) because
 * the root package.json has `"type": "module"`. Prefer electron/main.cjs.
 */
require('./main.cjs');
