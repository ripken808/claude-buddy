const { app, BrowserWindow, Tray, Menu, ipcMain, screen, nativeImage, Notification } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const fs = require('fs')

const storePath = path.join(app.getPath('userData'), 'claude-buddy-store.json')

function storeGet(key, defaultVal) {
  try {
    if (!fs.existsSync(storePath)) return defaultVal
    const data = JSON.parse(fs.readFileSync(storePath, 'utf8'))
    return key in data ? data[key] : defaultVal
  } catch { return defaultVal }
}

function storeSet(key, value) {
  try {
    let data = {}
    if (fs.existsSync(storePath)) data = JSON.parse(fs.readFileSync(storePath, 'utf8'))
    data[key] = value
    fs.writeFileSync(storePath, JSON.stringify(data, null, 2))
  } catch (e) { console.error('[store] write failed:', e.message) }
}

let win = null, tray = null, proxyProcess = null, isClickThrough = false, currentState = 'IDLE'

const STATE_EMOJI = { IDLE:'😐',FED:'😊',HAPPY:'😄',STUFFED:'🤤',SLEEPING:'😴',HIBERNATING:'🧊',ENERGY_DRINK:'⚡',PECKISH:'😕',HUNGRY:'🪧',BEGGING:'😭',DESPERATE:'💀',ANGRY_1:'😠',ANGRY_2:'🤬',TANTRUM:'🌋',WITHDRAWN:'😶',FERAL:'🌀' }

function startProxy() {
  // In dev, __dirname is inside electron/ so go up one level to project root
  const projectRoot = path.join(__dirname, '..')
  const devPath = path.join(projectRoot, '../claude-buddy-proxy/server.js')
  const devPath2 = path.join(projectRoot, 'claude-buddy-proxy/server.js')
  const prodPath = path.join(process.resourcesPath || '', 'proxy/server.js')
  const proxyPath = fs.existsSync(devPath) ? devPath
    : fs.existsSync(devPath2) ? devPath2
    : prodPath

  // Find node — packaged apps don't inherit PATH
  const nodePaths = [
    '/usr/local/bin/node',
    '/usr/bin/node',
    '/opt/homebrew/bin/node',
    process.execPath.includes('node') ? process.execPath : null,
  ].filter(Boolean)

  let nodeBin = 'node'
  for (const p of nodePaths) {
    if (fs.existsSync(p)) { nodeBin = p; break }
  }

  try {
    proxyProcess = spawn(nodeBin, [proxyPath], { detached: false, stdio: 'pipe' })
    proxyProcess.stdout?.on('data', d => console.log('[proxy]', d.toString().trim()))
    proxyProcess.stderr?.on('data', d => console.error('[proxy err]', d.toString().trim()))
    proxyProcess.on('error', e => console.error('[proxy spawn error]', e.message))
    console.log('[main] proxy started with', nodeBin)
  } catch (e) { console.error('[main] proxy failed:', e.message) }
}

function getSavedPosition() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const saved = storeGet('windowPosition', null)
  if (!saved) return { x: width - 232, y: 12 }
  const { x, y } = saved
  if (x < 0 || y < 0 || x > width - 100 || y > height - 100) return { x: width - 232, y: 12 }
  return { x, y }
}

function savePosition() {
  if (!win) return
  const [x, y] = win.getPosition()
  storeSet('windowPosition', { x, y })
}

function createWindow() {
  const { x, y } = getSavedPosition()
  win = new BrowserWindow({
    width: 220, height: 320, x, y,
    transparent: true, frame: false, alwaysOnTop: true,
    resizable: false, skipTaskbar: false, hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  })
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
  win.webContents.on('did-finish-load', () => {
    win.setBackgroundColor('#00000000')
    win.webContents.executeJavaScript('document.documentElement.style.background="transparent";document.body.style.background="transparent"').catch(()=>{})
  })
  win.on('moved', savePosition)
  win.on('closed', () => { win = null })
  setClickThrough(true)
}

function setClickThrough(enable) {
  if (!win) return
  isClickThrough = enable
  win.setIgnoreMouseEvents(enable, { forward: true })
  updateTray()
}

function createTray() {
  tray = new Tray(nativeImage.createEmpty())
  updateTray()
}

function updateTray() {
  if (!tray) return
  const emoji = STATE_EMOJI[currentState] || '🤖'
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const winW = 220, winH = 320
  tray.setToolTip('Claude Buddy ' + emoji + ' ' + currentState)
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Claude Buddy  ' + emoji + '  ' + currentState, enabled: false },
    { type: 'separator' },
    { label: '🔒 Lock (click-through)', type: 'checkbox', checked: isClickThrough, click: () => setClickThrough(true) },
    { label: '🔓 Unlock (interactive)', type: 'checkbox', checked: !isClickThrough, click: () => setClickThrough(false) },
    { type: 'separator' },
    { label: '📍 Top Right',    click: () => { win?.setPosition(width-winW-12, 12); savePosition() } },
    { label: '📍 Top Left',     click: () => { win?.setPosition(12, 12); savePosition() } },
    { label: '📍 Bottom Right', click: () => { win?.setPosition(width-winW-12, height-winH-12); savePosition() } },
    { label: '📍 Bottom Left',  click: () => { win?.setPosition(12, height-winH-12); savePosition() } },
    { type: 'separator' },
    { label: 'Show / Hide', click: () => win?.isVisible() ? win.hide() : win.show() },
    { type: 'separator' },
    { label: 'Quit Claude Buddy', click: () => app.quit() },
  ]))
}

ipcMain.on('state-changed', (_, s) => { currentState = s; updateTray(); if (s === 'TANTRUM') shakeWindow() })
ipcMain.on('shake-window', shakeWindow)
ipcMain.on('answer-ready', () => { if (Notification.isSupported()) new Notification({ title: 'Claude Buddy', body: '✓ Your answer is ready', silent: true }).show() })
ipcMain.on('update-state', (_, s) => { currentState = s; updateTray() })
ipcMain.handle('get-usage', () => storeGet('usage', {}))
ipcMain.handle('set-usage', (_, d) => storeSet('usage', d))

function shakeWindow() {
  if (!win) return
  const [origX, origY] = win.getPosition()
  let count = 0
  const shake = setInterval(() => {
    win.setPosition(origX + Math.round((Math.random()-0.5)*24), origY)
    if (++count >= 24) { clearInterval(shake); win.setPosition(origX, origY) }
  }, 40)
}

app.setLoginItemSettings({ openAtLogin: true, openAsHidden: false, name: 'Claude Buddy' })
app.commandLine.appendSwitch('enable-transparent-visuals')
app.whenReady().then(() => { startProxy(); createWindow(); createTray() })
app.on('window-all-closed', () => { savePosition(); if (proxyProcess) proxyProcess.kill(); if (process.platform !== 'darwin') app.quit() })
app.on('before-quit', () => { savePosition(); if (proxyProcess) proxyProcess.kill() })
app.on('activate', () => { if (!win) createWindow() })
