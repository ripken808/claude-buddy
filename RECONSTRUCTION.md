# RECONSTRUCTION PROMPT

_Last updated after: Initial project scaffolding & Phase planning_

---

Paste this entire prompt into Claude to reconstruct the Claude Buddy project from scratch:

---

**PROMPT:**

Build me a "Claude Buddy" desktop Tamagotchi-style pet app called **Claude Buddy** using Electron + React + Vite. The creature lives on the user's desktop and is fed by Claude API token usage. Here is the full spec:

## Core Concept
A transparent, always-on-top desktop window housing a pixel-art animated creature. Its hunger/energy state is driven by Claude token consumption tracked via a local config file that an Electron IPC bridge reads. The more tokens used in a session, the more fed it gets. When tokens run low or time passes without usage, it enters increasingly dramatic "hungry" states.

## Tech Stack
- **Electron** (main process, always-on-top transparent window, system tray)
- **React + Vite** (renderer process)
- **Framer Motion** (animations)
- **electron-store** (persistent state)
- **State tracked in**: `~/.claude-buddy/state.json`

## Token State Thresholds (session-based, resets each session)
| State | Tokens Used | Behavior |
|---|---|---|
| `IDLE` | 0 | Blinking, idle breathing loop |
| `FED` | 1–40% of session limit | Content, slow tail wag |
| `HAPPY` | 40–70% | Bouncy, smiling, sparkles |
| `STUFFED` | 70–95% | Belly rub, slow walk, burp animation |
| `SLEEPING` | 95–100% (session limit hit) | Eyes closed, ZZZ bubbles, stars |
| `HIBERNATING` | Week limit hit | Cocoon/wrapped state, deep freeze |
| `ENERGY_DRINK` | Tokens exceed session cap (Pro burst) | Jittery, neon glow, speed lines |

## Hunger States (no usage over time)
| State | Trigger | Animation |
|---|---|---|
| `PECKISH` | 2+ hours no usage | Stomach growl bubble |
| `HUNGRY` | 4+ hours | Holds sign "FEED ME 🪧" |
| `BEGGING` | 6+ hours | On knees, tears, sad eyes |
| `DESPERATE` | 12+ hours | Skeleton overlay flickering |
| `ANGRY_1` | 1 day no usage | Arms crossed, steam from head |
| `ANGRY_2` | 2 days | Throws object off screen |
| `TANTRUM` | 3 days | Full floor tantrum, shaking screen |
| `WITHDRAWN` | 5–7 days | Turned away, ignores clicks |
| `FERAL` | 7+ days | Wild eyes, chaotic movement |

## File Structure to Recreate
```
claude-buddy/
├── electron/
│   ├── main.js              # Electron main process
│   └── preload.js           # IPC bridge
├── src/
│   ├── components/
│   │   ├── Buddy.jsx         # Main creature component
│   │   ├── BuddySprite.jsx   # Pixel art SVG renderer
│   │   ├── StatusOverlay.jsx # Hunger bar, token meter
│   │   └── SpeechBubble.jsx  # Dialogue/reaction bubbles
│   ├── hooks/
│   │   ├── useTokenState.js  # Token usage → state machine
│   │   └── useHungerTimer.js # Time-based hunger escalation
│   ├── utils/
│   │   ├── stateEngine.js    # Core state transition logic
│   │   └── tokenTracker.js   # Reads claude usage config
│   ├── App.jsx
│   └── main.jsx
├── public/
├── docs/
│   ├── PHASES.md
├── PROMPT_LOG.md
├── RECONSTRUCTION.md
├── package.json
├── vite.config.js
└── electron-builder.config.js
```

## Key Behaviors
1. Window is transparent, frameless, always-on-top, draggable
2. System tray icon shows current state emoji
3. Token data is read from `~/.config/claude/usage.json` (or mock file for dev)
4. State machine updates every 60 seconds
5. Creature is a chunky pixel-art blob character with expressive eyes and stubby limbs
6. All animations in Framer Motion
7. Phase 1 is a browser-based React prototype (no Electron)
8. Phase 2 converts to Electron

## Animation Details Per State (implement all of these)
- **IDLE**: Slow bob up/down (2s loop), eye blink every 3–5s randomly
- **FED**: Tail wag side to side, closed-eye smile
- **HAPPY**: Bounce with squash/stretch, sparkle particles orbit
- **STUFFED**: Wobble walk, belly poke = burp bubble
- **SLEEPING**: ZZZ bubbles float upward, star twinkle on head
- **HIBERNATING**: Ice crystal overlay, breath puff every 4s, blue tint
- **ENERGY_DRINK**: Shake/jitter loop, neon outline pulse, speed lines from sides
- **HUNGRY**: Sign appears ("Feed me!"), foot tap
- **BEGGING**: Drop to knees pose, tear drops fall, whimper bubble
- **TANTRUM**: Full shake of entire window, creature rolls on floor
- **FERAL**: Eyes go wide/spiral, erratic movement, screen flicker edge

Rebuild this project, starting with Phase 1 (browser prototype). Create all files listed. Include placeholder pixel art SVG for the creature (chunky blob, big eyes, stubby arms). Use a dark, slightly purple-tinted UI theme.
