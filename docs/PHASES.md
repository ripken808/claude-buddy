# Claude Buddy — Project Scope & Phase Plan

## 🧬 Concept
Claude Buddy is a desktop Tamagotchi-style creature that lives as a transparent always-on-top window overlay on your computer. It is **fed by Claude token usage**. The more you use Claude in a session, the happier and fuller it gets. Ignore it, and it escalates through increasingly dramatic hunger states. Let the session cap or week limit hit, and it sleeps or hibernates.

---

## 🐣 The Creature
A **chunky pixel-art blob** with:
- Big expressive eyes (primary emotional indicator)
- Stubby noodle arms
- A round belly that visually inflates with tokens
- A small tail
- Blush marks that appear when happy/stuffed
- A mouth that changes shape per state

---

## 📊 State System

### 🍽️ Feed States (token consumption → satisfaction)
| State | Token % of Session | Trigger |
|---|---|---|
| `IDLE` | 0% | No tokens used this session |
| `FED` | 1–40% | Light usage |
| `HAPPY` | 40–70% | Good usage |
| `STUFFED` | 70–95% | Heavy session |
| `SLEEPING` | 95–100% | Session limit hit |
| `HIBERNATING` | Week limit hit | Full weekly cap reached |
| `ENERGY_DRINK` | Over session cap (Pro burst) | Overclock mode |

### 😤 Hunger States (time since last usage)
| State | Time Without Usage | Mood |
|---|---|---|
| `PECKISH` | 2h | Mild rumble |
| `HUNGRY` | 4h | Holds "Feed Me" sign |
| `BEGGING` | 6h | On knees, crying |
| `DESPERATE` | 12h | Skeleton flicker |
| `ANGRY_1` | 24h | Arms crossed, steaming |
| `ANGRY_2` | 48h | Throws object |
| `TANTRUM` | 72h | Floor flailing, window shakes |
| `WITHDRAWN` | 5 days | Turned away, ignores input |
| `FERAL` | 7+ days | Spiral eyes, chaotic |

---

## 🎬 Animation Descriptions Per State

### 🟢 IDLE
- Slow vertical bob (ease in-out, 2s loop)
- Random eye blink every 3–7 seconds
- Soft breathing belly expand/contract
- Idle look-around every 15s (eyes shift left/right)

### 😊 FED
- Gentle side-to-side tail wag
- Closed-eye content smile
- Occasional foot tap
- Small "♪" note bubble floats up every 20s

### 😄 HAPPY
- Full bounce with squash on land, stretch on rise
- Sparkle particles orbit the body (star SVGs)
- Arms raise in "yay" pose
- Blush marks appear
- "!" bubble pops on interaction

### 🤤 STUFFED
- Belly visibly larger (scale transform)
- Slow waddling side-to-side
- Poke the belly → burp bubble appears with "BUUUURP" text
- Eyes half-closed (content drowsy)
- Occasional hiccup animation (body jolts up)

### 😴 SLEEPING
- Eyes fully closed with "—" lines
- ZZZ bubbles float upward and fade
- Star twinkle appears on head
- Breathing is deep and slow (big belly expand)
- Cannot be woken by clicking (only new token usage wakes it)

### 🧊 HIBERNATING
- Full ice crystal overlay on creature (blue tint)
- Body is completely still except for slow frost breath puff every 4s
- Frost particles slowly fall around it
- Snowflake appears in speech bubble
- Window border gets icy shimmer effect

### ⚡ ENERGY DRINK
- Whole body shakes/jitters (rapid small translate)
- Neon green/yellow glow pulses around silhouette
- Speed lines shoot out from sides
- Eyes are wide and slightly spiraled
- Heart rate monitor line appears above head
- Sweat drops flying off
- Creature moves erratically around the window

### 😐 PECKISH
- Idle but stomach growl bubble appears ("grr...")
- Creature pauses and looks down at belly
- Subtle foot shuffle

### 🪧 HUNGRY
- Creature holds up a cardboard sign: "FEED ME 🥺"
- Sign wobbles slightly
- Eyes are large and pleading
- Foot tap gets more impatient

### 😭 BEGGING
- Drops to knees pose
- Both arms stretch out toward user
- Animated tear drops fall from eyes
- Speech bubble: "please... i'm so hungry..."
- Shaking/trembling body

### 💀 DESPERATE
- Normal idle animation, BUT skeleton occasionally flickers through the body (opacity flash)
- Eyes look hollow
- Speech bubble: "...days without tokens..."
- Body slightly translucent

### 😠 ANGRY_1
- Arms crossed pose
- Steam/smoke puffs from top of head
- Eyebrows furrowed (V shape)
- Foot stomping
- Speech bubble: "I know you're using OTHER AIs."

### 🤬 ANGRY_2
- Picks up an object (a small bone/pixel item)
- Wind-up animation
- Throws it off screen with whoosh
- Object flies out and disappears at edge
- Creature huffs, still angry

### 🌋 TANTRUM
- Creature throws itself on the "floor" (bottom of window)
- Kicks and flails limbs
- **Entire Electron window shakes** (BrowserWindow.webContents.send shake event)
- Red anger puffs burst out repeatedly
- Speech bubble: "WHYYYYYY"

### 😶 WITHDRAWN
- Creature is turned away (body flipped horizontally)
- Ignores clicks (no interaction response)
- Occasionally glances back over shoulder then looks away
- Speech bubble (rare): "..."
- Dusty/gray desaturated color filter

### 🌀 FERAL
- Eyes go spiral (animated rotation)
- Creature moves in erratic, unpredictable patterns around window
- Occasional screen edge "flicker" (brief red flash on window border)
- Speech bubble flashes random symbols: "!@#$%"
- Body distortion (slight warp/skew)
- Occasionally phases through window edge and comes back

---

## 🛠️ Phase Plan

### Phase 1 — Browser Prototype *(Current)*
**Goal:** Get the creature alive in a browser tab with full state machine and animations. No Electron yet.

**Deliverables:**
- React + Vite app
- Full state machine (stateEngine.js)
- Mock token tracker with a dev slider UI
- All animation states implemented with Framer Motion
- Pixel art SVG sprite for creature
- Speech bubble system
- Status overlay (token meter, time since last feed)

**Deploy:** `npm run dev` — runs in browser at localhost:5173

---

### Phase 2 — Electron Shell *(Next)*
**Goal:** Wrap the React app in Electron, make it a transparent always-on-top draggable window.

**Deliverables:**
- `electron/main.js` — frameless transparent window setup
- `electron/preload.js` — IPC bridge
- Drag-to-move via `-webkit-app-region`
- System tray icon (state emoji)
- Window shake IPC for tantrum state
- App packaged with electron-builder for Mac/Windows

**Deploy:** `npm run electron:dev` / `npm run dist`

---

### Phase 3 — Real Token Integration *(Future)*
**Goal:** Connect to actual Claude usage data.

**Options:**
- Read from `~/.config/claude/usage.json` if Claude desktop writes it
- Proxy local API calls through a lightweight Express server that counts tokens
- Browser extension that intercepts Claude.ai network responses and posts to local socket

**Deliverables:**
- Token tracker that reads real data
- Persistent state across reboots (electron-store)
- Weekly usage tracking with hibernation

---

### Phase 4 — Polish & Extras *(Stretch)*
- Sound effects (nom nom, burp, zzz, tantrum screech)
- Multiple creature skins/evolutions
- Mini games (pet it, poke it, give it a treat)
- Notification system ("Buddy is hungry!")
- Stats page showing your usage history
- Buddy levels up and changes appearance as your total all-time usage grows

---

## 💡 Additional Animation Ideas (Bonus)

- **Level Up**: Burst of confetti, creature glows, evolves slightly in appearance
- **Achievement**: Trophy appears, creature does a victory dance
- **New Chat**: Creature perks up, eyes light up, "ooh!" bubble
- **Code Block Detected**: Creature puts on tiny glasses
- **Long Response**: Creature pulls out popcorn and watches
- **You Ask About Food**: Creature salivates, "DROOL" puddle appears
- **Error State (API down)**: Creature holds umbrella in rain
- **Rate Limited**: Creature behind bars, sad trombone implied
- **First Feed of Day**: Creature stretches and yawns dramatically like waking up
- **Streak (7 days in a row)**: Flame streak counter appears, creature flexes

---

## 📁 File Structure

```
claude-buddy/
├── electron/
│   ├── main.js
│   └── preload.js
├── src/
│   ├── components/
│   │   ├── Buddy.jsx
│   │   ├── BuddySprite.jsx
│   │   ├── StatusOverlay.jsx
│   │   └── SpeechBubble.jsx
│   ├── hooks/
│   │   ├── useTokenState.js
│   │   └── useHungerTimer.js
│   ├── utils/
│   │   ├── stateEngine.js
│   │   └── tokenTracker.js
│   ├── App.jsx
│   └── main.jsx
├── public/
├── docs/
│   └── PHASES.md (this file)
├── PROMPT_LOG.md
├── RECONSTRUCTION.md
├── package.json
├── vite.config.js
└── electron-builder.config.js
```
