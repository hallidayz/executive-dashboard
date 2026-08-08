/**
 * Optional desktop shell. Day-to-day development: `npm run dev` (Vite) on Mac or Windows.
 * Packaged/desktop run: `npm run build` then `npm run electron`.
 *
 * Auto-start uses Electron's login-item API (works on both darwin and win32).
 * Preference is read from OPEN_AT_LOGIN env, default true for packaged demos.
 */
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Executive Chief of Staff Dashboard',
    backgroundColor: '#02295B',
    // SECURITY: Keep renderer sandboxed. Do NOT set nodeIntegration:true or
    // contextIsolation:false — older electron/main.js once used those insecure
    // defaults; this shell must not regress.
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  const startUrl =
    process.env.VITE_DEV_SERVER_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const openAtLogin = process.env.OPEN_AT_LOGIN !== 'false';
  try {
    app.setLoginItemSettings({
      openAtLogin,
      openAsHidden: false,
      // path is honored on Windows; macOS uses the app bundle path automatically
      path: process.platform === 'win32' ? process.execPath : undefined,
    });
  } catch (err) {
    console.warn('Login item settings unavailable in this environment:', err?.message || err);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
