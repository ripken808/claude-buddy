const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  ipcMain,
  screen,
  nativeImage,
} = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let win = null;
let tray = null;
let proxyProcess = null;
let isClickThrough = false;
let currentState = "IDLE";

const STATE_EMOJI = {
  IDLE: "😐",
  FED: "😊",
  HAPPY: "😄",
  STUFFED: "🤤",
  SLEEPING: "😴",
  HIBERNATING: "🧊",
  ENERGY_DRINK: "⚡",
  PECKISH: "😕",
  HUNGRY: "🪧",
  BEGGING: "😭",
  DESPERATE: "💀",
  ANGRY_1: "😠",
  ANGRY_2: "🤬",
  TANTRUM: "🌋",
  WITHDRAWN: "😶",
  FERAL: "🌀",
};

function startProxy() {
  const proxyPath = path.join(__dirname, "../../claude-buddy-proxy/server.js");
  proxyProcess = spawn("node", [proxyPath], { detached: false });
  proxyProcess.stdout.on("data", (d) =>
    console.log("[proxy]", d.toString().trim()),
  );
  proxyProcess.stderr.on("data", (d) =>
    console.error("[proxy err]", d.toString().trim()),
  );
  console.log("[main] proxy started");
}

function createWindow() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  const winWidth = 200;
  const winHeight = 280;
  const x = width - winWidth - 12;
  const y = 12;

  win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x,
    y,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    backgroundColor: "#00000000",
    type: "panel",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  win.webContents.on("did-finish-load", () => {
    win.setBackgroundColor("#00000000");
    win.webContents
      .executeJavaScript(
        `
      document.documentElement.style.background = 'transparent';
      document.body.style.background = 'transparent';
      document.getElementById('root').style.background = 'transparent';
    `,
      )
      .catch(() => {});
  });

  setClickThrough(true);
  win.on("closed", () => {
    win = null;
  });
}

function setClickThrough(enable) {
  if (!win) return;
  isClickThrough = enable;
  win.setIgnoreMouseEvents(enable, { forward: true });
  updateTray(currentState);
}

function createTray() {
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  updateTray("IDLE");
}

function updateTray(state) {
  currentState = state;
  if (!tray) return;
  const emoji = STATE_EMOJI[state] || "🤖";
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  tray.setToolTip(`Claude Buddy ${emoji} ${state}`);

  const menu = Menu.buildFromTemplate([
    { label: `Claude Buddy  ${emoji} ${state}`, enabled: false },
    {
      label: isClickThrough ? "🔒 Click-through ON" : "🔓 Interactive",
      enabled: false,
    },
    { type: "separator" },
    {
      label: "🔒 Lock (click-through)",
      type: "checkbox",
      checked: isClickThrough,
      click: () => setClickThrough(true),
    },
    {
      label: "🔓 Unlock (interactive)",
      type: "checkbox",
      checked: !isClickThrough,
      click: () => setClickThrough(false),
    },
    { type: "separator" },
    { label: "📍 Top Right", click: () => win?.setPosition(width - 212, 12) },
    { label: "📍 Top Left", click: () => win?.setPosition(12, 12) },
    {
      label: "📍 Bottom Right",
      click: () => win?.setPosition(width - 212, height - 292),
    },
    {
      label: "📍 Bottom Left",
      click: () => win?.setPosition(12, height - 292),
    },
    { type: "separator" },
    {
      label: "⚙️ Customize",
      click: () => {
        const settingsWin = new BrowserWindow({
          width: 900,
          height: 700,
          webPreferences: { contextIsolation: true },
        });
        if (process.env.NODE_ENV === "development") {
          settingsWin.loadURL("http://localhost:5173/?settings");
        } else {
          settingsWin.loadFile(path.join(__dirname, "../dist/index.html"), {
            query: { settings: "" },
          });
        }
      },
    },
    { type: "separator" },
    {
      label: "Show / Hide",
      click: () => (win?.isVisible() ? win.hide() : win.show()),
    },
    { type: "separator" },
    { label: "Quit Claude Buddy", click: () => app.quit() },
  ]);

  tray.setContextMenu(menu);
}

ipcMain.on("state-changed", (_, state) => updateTray(state));

ipcMain.on("shake-window", () => {
  if (!win) return;
  const [origX, origY] = win.getPosition();
  let count = 0;
  const shake = setInterval(() => {
    const dx = Math.round((Math.random() - 0.5) * 24);
    win.setPosition(origX + dx, origY);
    if (++count >= 24) {
      clearInterval(shake);
      win.setPosition(origX, origY);
    }
  }, 40);
});

app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: false,
  name: "Claude Buddy",
});
app.commandLine.appendSwitch("enable-transparent-visuals");

app.whenReady().then(() => {
  startProxy();
  createWindow();
  createTray();
});

app.on("window-all-closed", () => {
  if (proxyProcess) proxyProcess.kill();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (proxyProcess) proxyProcess.kill();
});

app.on("activate", () => {
  if (!win) createWindow();
});
