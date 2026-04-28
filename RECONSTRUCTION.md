# RECONSTRUCTION PROMPT

_Last updated: 2026-04-28 — All features working including dreams, nightmares, energy drink, pair-based transitions_

Paste this into Claude to reconstruct the full project from scratch:

---

Build me "Claude Buddy" — a Tamagotchi-style desktop pet fed by real Claude AI usage.

## Tech Stack

- React + Vite + Framer Motion (UI)
- Electron (transparent always-on-top desktop overlay)
- Express proxy on port 7821
- Chrome MV3 extension (reads Claude.ai usage API)

## Folder Structure

```
claude-buddy/
├── claude-buddy/           ← React + Vite + Electron
│   ├── src/
│   │   ├── components/
│   │   │   ├── Buddy.jsx           ← animations, effects, transitions
│   │   │   ├── BuddySprite.jsx     ← SVG sprite
│   │   │   ├── SpeechBubble.jsx
│   │   │   └── StatusOverlay.jsx
│   │   ├── hooks/
│   │   │   └── useTokenState.js    ← polling, state machine, eating/thinking
│   │   └── utils/
│   │       ├── stateEngine.js      ← resolveState, 15 states
│   │       └── tokenTracker.js     ← loadUsage, saveUsage, fetchRealUsage
│   ├── electron/
│   │   ├── main.js
│   │   └── preload.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── claude-buddy-proxy/     ← Express proxy
│   └── server.js
├── claude-buddy-extension/ ← Chrome MV3
│   ├── manifest.json
│   ├── background.js
│   └── content.js
├── PROMPT_LOG.md
└── RECONSTRUCTION.md
```

## GitHub

https://github.com/ripken808/claude-buddy.git

## Theme

- Background: #080808
- Accent: #E8611A orange
- Font: Courier New monospace
- Scanline overlay, orange grid, corner brackets

## Sprite Design (BuddySprite.jsx)

- SVG-based Claude Code mascot: wide landscape body (BW=88, BH=56), two arms (AW=14, AH=14), four legs in two pairs (LW=12, LH=16)
- Symbol eyes only, no mouth ever, no panels
- Eye colors: black default, blue sleeping, cyan hibernating, green energy drink, red angry, magenta feral, purple desperate
- State-reactive body colors
- Accessories: ZZZ sleeping, ⚡ speed lines energy drink, 💢 angry, ❄ hibernating, 💧 tears begging, FEED ME sign hungry

## 15 States + Triggers

| State        | Trigger                              |
| ------------ | ------------------------------------ |
| IDLE         | 0% session                           |
| FED          | 1-40% session                        |
| HAPPY        | 40-70% session                       |
| STUFFED      | 70-100% session                      |
| SLEEPING     | 100% session                         |
| HIBERNATING  | 100% weekly                          |
| ENERGY_DRINK | extraPct > 0 (any extra usage spend) |
| PECKISH      | 2h no use                            |
| HUNGRY       | 4h no use                            |
| BEGGING      | 6h no use                            |
| DESPERATE    | 12h no use                           |
| ANGRY_1      | 24h no use                           |
| ANGRY_2      | 48h no use                           |
| TANTRUM      | 72h no use                           |
| WITHDRAWN    | 120h no use                          |
| FERAL        | 168h no use                          |

## Real Usage API

`GET /api/organizations/{ORG_ID}/usage`

- five_hour.utilization → sessionPct
- seven_day.utilization → weeklyPct
- extra_usage.utilization → extraPct (>0 = energy drink state)
- Pro org ID: 697c20d8-96e4-46bd-a2be-745efba88810

## Key Features

### Eating Animation

- Triggers when isThinking flips false→true (prompt submitted)
- State forced immediately (so ENERGY_DRINK shows during eating)
- Token flies in, mouth opens, nom nom burst, savor glow
- 1.5s eating → then thinking orbs appear

### Thinking Detection

- Extension detects Enter key / send button / stop button DOM poll
- Sets isThinking in localStorage + proxy
- Hook detects transition: false→true = eat then think, true→false = justFinished

### State Transitions (pair-based)

- getTransitionAnims(from, to) — 20+ specific pair overrides
- HUNGRY→FED: spring up relief bounce
- HAPPY→STUFFED: horizontal stretch/bloat
- STUFFED→SLEEPING: slow melt down
- ANGRY→TANTRUM: spin 720° implode → explode at 3x
- WITHDRAWN→FERAL: glitch flicker → chaos assembly
- ANY→ENERGY_DRINK: rocket launch up → meteor crash down
- Generic: better = slide up, worse = slide down, big jump = squash/stretch

### Dreams (while SLEEPING)

- First dream 3s after entering sleep state
- Every 10 minutes after
- 25% chance of NIGHTMARE
- Normal dreams: purple bubble floats upward with token fantasy text
- Nightmare sequence: red bubble → fades → buddy jolts awake (x eyes, red flash, sweat drops, ‼️, scream banner) → shakes 10s → falls back asleep
- Dev panel 💭 button triggers dream anytime

### Dev Panel (browser mode)

- [DEV] button top right
- 🪙 eat — triggers eating animation
- 💭 dream — triggers random dream/nightmare
- State buttons — forceState(s) with 8s devLock (prevents live data overwrite)
- Time buttons — simulate hours since last use
- 🔒 LOCKED indicator while devLock active

### Electron

- Transparent frameless always-on-top panel window
- 200×280px, top-right corner
- System tray with state emoji + position presets
- Click-through by default, unlock via tray
- Auto-starts proxy via spawn
- Window shake on TANTRUM state

### Chrome Extension

- manifest.json: MV3, matches claude.ai/\*
- content.js: reads usage API, writes to localStorage + proxy
- Thinking detection: Enter key, send button, stop button DOM poll, PerformanceObserver
- Org ID: hardcoded known ID tested first, auto-detect fallback
- background.js: minimal message listener only

## Extension Files

### manifest.json

```json
{
  "manifest_version": 3,
  "name": "Claude Buddy Feed",
  "version": "1.0.0",
  "permissions": ["storage"],
  "host_permissions": ["https://claude.ai/*", "http://localhost:7821/*"],
  "content_scripts": [
    {
      "matches": ["https://claude.ai/*"],
      "js": ["content.js"],
      "run_at": "document_idle",
      "all_frames": false
    }
  ],
  "action": { "default_title": "Claude Buddy Feed" }
}
```

### background.js

```js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  sendResponse({ ok: true });
  return true;
});
```
