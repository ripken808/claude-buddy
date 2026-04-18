/**
 * electron/main.js
 * Phase 2 — Electron main process.
 * Creates a transparent, frameless, always-on-top window.
 */

const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage } = require('electron')
const path = require('path')
const Store = require('electron-store')

const store = new Store()

let win
let tray

function createWindow() {
  win = new BrowserWindow({
    width: 220,
    height: 280,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  })

  // Load vite dev server in dev, dist in production
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Enable dragging (-webkit-app-region: drag on the renderer side)
  win.setIgnoreMouseEvents(false)
}

function createTray() {
  // Use a default icon; update based on state via IPC
  const icon = nativeImage.createEmpty()
  tray = new Tray(icon)
  const menu = Menu.buildFromTemplate([
    { label: 'Show Buddy', click: () => win.show() },
    { label: 'Quit', click: () => app.quit() },
  ])
  tray.setToolTip('Claude Buddy')
  tray.setContextMenu(menu)
}

app.whenReady().then(() => {
  createWindow()
  createTray()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// IPC: Shake window (for TANTRUM state)
ipcMain.on('shake-window', () => {
  if (!win) return
  const [x, y] = win.getPosition()
  let count = 0
  const interval = setInterval(() => {
    const dx = (Math.random() - 0.5) * 20
    win.setPosition(Math.round(x + dx), y)
    count++
    if (count > 20) {
      clearInterval(interval)
      win.setPosition(x, y)
    }
  }, 40)
})

// IPC: Update tray icon label
ipcMain.on('update-state', (_, state) => {
  if (tray) tray.setToolTip(`Claude Buddy — ${state}`)
})

// IPC: Save/load usage data
ipcMain.handle('get-usage', () => store.get('usage', {}))
ipcMain.handle('set-usage', (_, data) => store.set('usage', data))
