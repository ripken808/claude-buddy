# PROMPT LOG

---

## Entry #001

**Date:** 2026-04-18
**Prompt Summary:** Initial project creation. Tamagotchi desktop pet fed by Claude token usage.
**What Was Delivered:** Full scaffold — all components, hooks, utils, state engine, Electron stubs, PHASES.md.
**Effectiveness:** ⭐⭐⭐⭐⭐ — Complete foundation delivered first pass.

---

## Entry #002–008

**Date:** 2026-04-18
**Prompt Summary:** Theme overhaul, sprite design, real usage connection, GitHub push, Electron Phase 2.
**What Was Delivered:** Full Claude Code orange/black theme, pixel robot sprite, Chrome extension reading real API, proxy server, Electron transparent overlay.
**Effectiveness:** ⭐⭐⭐⭐⭐ — Phase 1 complete and shipped.

---

## Entry #009–015

**Date:** 2026-04-19
**Prompt Summary:** Electron transparency fixes, thinking detection, eating animation, state transitions, settings/customization system.
**What Was Delivered:** Transparent Electron window, thinking orbs + bubble, eating token animation, nom burst, savor glow, 6 model designs with canvas renderer, settings page at /?settings.
**Effectiveness:** ⭐⭐⭐⭐ — Most features working. Settings system later removed from main UI.

---

## Entry #016–022

**Date:** 2026-04-26
**Prompt Summary:** Marketability push — remove hardcoded org ID, remove proxy dependency, dynamic org detection, extension popup mode, model picker UI.
**What Was Delivered:** Auto-detect org ID from /api/organizations, localStorage fallback (no proxy needed), interactive model picker widget, 6 sprite models, 8 color palettes, 5 eye styles.
**Effectiveness:** ⭐⭐⭐⭐ — Extension works for any Claude user. Model picker built but canvas approach broke Electron.

---

## Entry #023–028

**Date:** 2026-04-26
**Prompt Summary:** Reverted to iconic Claude Code sprite, removed customization, made smaller, fixed gap issues, restored working extension org detection.
**What Was Delivered:** Final BuddySprite.jsx — flat SVG, Claude Code mascot proportions (BW=88, BH=56), symbol eyes, state-reactive colors. Electron window tightened.
**Effectiveness:** ⭐⭐⭐⭐⭐ — Correct design locked in.

---

## Entry #029–035

**Date:** 2026-04-26
**Prompt Summary:** Dev sandbox, smooth state transitions, eating animation sequence, devLock system so live data doesn't overwrite dev state buttons.
**What Was Delivered:** useTokenState with devLock (8s lock), forceState/forceEat functions, transitionToState with 400ms animated crossfade, eating triggers on thinking start not sessionPct increase, proxy/localStorage fallback.
**Effectiveness:** ⭐⭐⭐⭐ — Transitions working. Eating reliable.

---

## Entry #036–042

**Date:** 2026-04-27
**Prompt Summary:** State-pair transition animations — each FROM→TO pair tells a story. Dream bubbles while sleeping. Nightmare system (25% chance).
**What Was Delivered:** getTransitionAnims(from, to) with 20+ specific pair overrides. Dream/nightmare bubbles floating up. Nightmare wakeup sequence: red flash, sweat drops, ‼️, scream banner, 10s shaking, falls back asleep. Dev panel 💭 dream button.
**Effectiveness:** ⭐⭐⭐⭐⭐ — Highly expressive. Living entity feel achieved.

---

## Entry #043–048

**Date:** 2026-04-27
**Prompt Summary:** ENERGY_DRINK state not triggering with extra tokens. Extension broken (background.js missing, settings page blocking poll).
**What Was Delivered:** stateEngine fix (ePct > 0 triggers ENERGY_DRINK regardless of session%). Hook fix (force state immediately when thinking starts so ENERGY_DRINK shows during eating). Extension restored to minimal working version. manifest.json cleaned up.
**Effectiveness:** ⭐⭐⭐⭐ — Extension working again. Energy drink triggers correctly.
