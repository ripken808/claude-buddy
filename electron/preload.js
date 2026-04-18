/**
 * electron/preload.js
 * Exposes safe IPC bridge to renderer.
 */

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  shakeWindow: () => ipcRenderer.send('shake-window'),
  updateState: (state) => ipcRenderer.send('update-state', state),
  getUsage: () => ipcRenderer.invoke('get-usage'),
  setUsage: (data) => ipcRenderer.invoke('set-usage', data),
})
