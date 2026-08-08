/**
 * Preload bridge — sandboxed renderer talks to main for OS keychain encryption.
 * Never expose arbitrary Node or shell APIs here.
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopSecrets', {
  isAvailable: () => ipcRenderer.invoke('secrets:is-available'),
  encrypt: (plainText) => ipcRenderer.invoke('secrets:encrypt', plainText),
  decrypt: (payload) => ipcRenderer.invoke('secrets:decrypt', payload),
  platform: process.platform,
});
