const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  shakeWindow: () => ipcRenderer.send("shake-window"),
  stateChanged: (state) => ipcRenderer.send("state-changed", state),
  isElectron: true,
});
