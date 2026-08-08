/**
 * Optional desktop shell. Day-to-day: `npm run electron:dev` (Vite + Electron).
 * Packaged: `npm run build` then `npm run electron`.
 *
 * Secrets use Electron safeStorage (OS keychain-backed encryption).
 */
const { app, BrowserWindow, ipcMain, safeStorage } = require('electron');
const path = require('path');

let mainWindow;

function registerSecretIpc() {
  ipcMain.handle('secrets:is-available', () => {
    try {
      return Boolean(safeStorage.isEncryptionAvailable());
    } catch {
      return false;
    }
  });

  ipcMain.handle('secrets:encrypt', (_event, plainText) => {
    if (typeof plainText !== 'string') {
      throw new Error('encrypt expects a string');
    }
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('safeStorage encryption is not available on this machine');
    }
    const buf = safeStorage.encryptString(plainText);
    return buf.toString('base64');
  });

  ipcMain.handle('secrets:decrypt', (_event, payload) => {
    if (typeof payload !== 'string') {
      throw new Error('decrypt expects a base64 string');
    }
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('safeStorage encryption is not available on this machine');
    }
    const buf = Buffer.from(payload, 'base64');
    return safeStorage.decryptString(buf);
  });
}

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
      preload: path.join(__dirname, 'preload.cjs'),
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

  // Personal use: default login-item off so install doesn't surprise you.
  const openAtLogin = process.env.OPEN_AT_LOGIN === 'true';
  try {
    app.setLoginItemSettings({
      openAtLogin,
      openAsHidden: false,
      path: process.platform === 'win32' ? process.execPath : undefined,
    });
  } catch (err) {
    console.warn('Login item settings unavailable in this environment:', err?.message || err);
  }
}

app.whenReady().then(() => {
  registerSecretIpc();
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
