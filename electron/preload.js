const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  stateChanged: (state) => ipcRenderer.send("state-changed", state),
  updateState: (state) => ipcRenderer.send("update-state", state),
  shakeWindow: () => ipcRenderer.send("shake-window"),
  answerReady: () => ipcRenderer.send("answer-ready"),
  getUsage: () => ipcRenderer.invoke("get-usage"),
  setUsage: (data) => ipcRenderer.invoke("set-usage", data),
});
