export const STATES = {
  IDLE: "IDLE",
  FED: "FED",
  HAPPY: "HAPPY",
  STUFFED: "STUFFED",
  SLEEPING: "SLEEPING",
  HIBERNATING: "HIBERNATING",
  ENERGY_DRINK: "ENERGY_DRINK",
  PECKISH: "PECKISH",
  HUNGRY: "HUNGRY",
  BEGGING: "BEGGING",
  DESPERATE: "DESPERATE",
  ANGRY_1: "ANGRY_1",
  ANGRY_2: "ANGRY_2",
  TANTRUM: "TANTRUM",
  WITHDRAWN: "WITHDRAWN",
  FERAL: "FERAL",
};

export const STATE_SPEECH = {
  IDLE: [
    "...",
    "hmm.",
    "*blinks*",
    "waiting...",
    "la la la~",
    "*yawns*",
    "still here!",
    "bored tbh",
  ],
  FED: [
    "yum!",
    "nom nom ♪",
    "thanks~",
    "more please?",
    "tasty tokens!",
    "*happy beep*",
  ],
  HAPPY: [
    "YAYY!!",
    "MORE!!",
    "best day ever!!",
    "I LOVE THIS",
    "wheeeee!",
    "unstoppable!!",
  ],
  STUFFED: [
    "...so full",
    "*hiccup*",
    "oof.",
    "send help",
    "cannot move",
    "*burp* excuse me",
  ],
  SLEEPING: [
    "zzz...",
    "💤",
    "...zzzz",
    "*snore*",
    "...dreaming of tokens",
    "do not disturb",
  ],
  HIBERNATING: [
    "❄️...",
    "so... cold...",
    "...frozen...",
    "wake me next week",
    "brrr....",
  ],
  ENERGY_DRINK: [
    "LETS GOOOOO",
    "MAXIMUM POWER",
    "⚡⚡⚡",
    "I FEEL EVERYTHING",
    "CANNOT STOP",
    "IS THIS LEGAL",
    "ZOOOOOM",
  ],
  PECKISH: [
    "*stomach growl*",
    "um... hungry?",
    "...feed me?",
    "getting hungry ngl",
  ],
  HUNGRY: [
    "FEED ME",
    "please 🥺",
    "food???",
    "hellooooo??",
    "tokens. NOW.",
    "bro. BRO.",
  ],
  BEGGING: [
    "please...",
    "I'm so hungry...",
    "*sobs*",
    "why...",
    "just one prompt...",
  ],
  DESPERATE: ["...days...", "tokens... need tokens...", "💀", "fading away..."],
  ANGRY_1: [
    "I know you're using other AIs.",
    "seriously.",
    "*crosses arms*",
    "fine. FINE.",
  ],
  ANGRY_2: [
    "THAT IS IT",
    "IM THROWING THIS",
    "YOU ASKED FOR THIS",
    "I warned you.",
  ],
  TANTRUM: [
    "WHYYYYYYYY",
    "FEED MEEEE",
    "I HATE THIS",
    "*screaming into void*",
    "I DEMAND TOKENS",
  ],
  WITHDRAWN: [
    "...",
    "...whatever.",
    "*glances back*",
    "...not talking to you.",
  ],
  FERAL: [
    "!@#$%",
    "👁️👄👁️",
    "*unintelligible*",
    "I HAVE BECOME SOMETHING ELSE",
  ],
};

export function resolveState({
  sessionTokens = 0,
  sessionLimit = 50000,
  weekTokens = 0,
  weekLimit = 500000,
  hoursSinceLastUse = 0,
  sessionPct = null,
  weeklyPct = null,
  extraPct = null,
}) {
  const sPct =
    sessionPct !== null ? sessionPct : (sessionTokens / sessionLimit) * 100;
  const wPct = weeklyPct !== null ? weeklyPct : (weekTokens / weekLimit) * 100;
  const ePct = extraPct !== null ? extraPct : 0;

  // Weekly limit hit → hibernating (only at 100%)
  if (wPct >= 100) return STATES.HIBERNATING;

  // Extra usage active (over session cap) → energy drink
  if (ePct > 0 && sPct >= 100) return STATES.ENERGY_DRINK;

  // Session limit hit (100%) → sleeping
  if (sPct >= 100) return STATES.SLEEPING;

  // Hunger states — time based, take priority over feed states
  if (hoursSinceLastUse >= 168) return STATES.FERAL;
  if (hoursSinceLastUse >= 120) return STATES.WITHDRAWN;
  if (hoursSinceLastUse >= 72) return STATES.TANTRUM;
  if (hoursSinceLastUse >= 48) return STATES.ANGRY_2;
  if (hoursSinceLastUse >= 24) return STATES.ANGRY_1;
  if (hoursSinceLastUse >= 12) return STATES.DESPERATE;
  if (hoursSinceLastUse >= 6) return STATES.BEGGING;
  if (hoursSinceLastUse >= 4) return STATES.HUNGRY;
  if (hoursSinceLastUse >= 2) return STATES.PECKISH;

  // Feed states from session %
  if (sPct >= 70) return STATES.STUFFED;
  if (sPct >= 40) return STATES.HAPPY;
  if (sPct >= 1) return STATES.FED;
  return STATES.IDLE;
}

export function getSpeechLine(state) {
  const lines = (STATE_SPEECH[state] || STATE_SPEECH.IDLE).filter(Boolean);
  return lines[Math.floor(Math.random() * lines.length)];
}

export function isHungerState(state) {
  return [
    STATES.PECKISH,
    STATES.HUNGRY,
    STATES.BEGGING,
    STATES.DESPERATE,
    STATES.ANGRY_1,
    STATES.ANGRY_2,
    STATES.TANTRUM,
    STATES.WITHDRAWN,
    STATES.FERAL,
  ].includes(state);
}

export function getStateMoodColor(state) {
  const colors = {
    IDLE: "#a0a0c0",
    FED: "#7ecb8f",
    HAPPY: "#f9e04b",
    STUFFED: "#f4a259",
    SLEEPING: "#8ab4f8",
    HIBERNATING: "#aee4ff",
    ENERGY_DRINK: "#39ff14",
    PECKISH: "#d4b483",
    HUNGRY: "#e08040",
    BEGGING: "#e05f5f",
    DESPERATE: "#c040c0",
    ANGRY_1: "#ff4444",
    ANGRY_2: "#ff2020",
    TANTRUM: "#ff0000",
    WITHDRAWN: "#808080",
    FERAL: "#ff00ff",
  };
  return colors[state] || "#ffffff";
}
