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
  IDLE: ["...", "hmm.", "*blinks*", "waiting..."],
  FED: ["yum!", "nom nom ♪", "thanks~", "😊"],
  HAPPY: ["yay!", "MORE!!", "best day!!", "✨✨✨"],
  STUFFED: ["...so full", "*hiccup*", "oof", "belly full 🥰"],
  SLEEPING: ["zzz...", "💤", "...zzzz", "*snore*"],
  HIBERNATING: ["❄️", "...frozen...", "so... cold..."],
  ENERGY_DRINK: [
    "LETS GOOO",
    "MAXIMUM POWER",
    "⚡⚡⚡",
    "I CAN FEEL EVERYTHING",
  ],
  PECKISH: ["*stomach growl*", "um... hungry", "...feed me?"],
  HUNGRY: ["FEED ME", "please 🥺", "food???", "helloooo??"],
  BEGGING: ["please...", "i'm so hungry...", "*sobs*", "why..."],
  DESPERATE: ["...days...", "tokens... need tokens...", "💀"],
  ANGRY_1: [
    "I know you're using other AIs.",
    "seriously.",
    "unbelievable.",
    "*crosses arms*",
  ],
  ANGRY_2: ["THAT IS IT", "IM THROWING THIS", "*winds up*"],
  TANTRUM: ["WHYYYYYYYY", "FEED MEEEE", "I HATE THIS", "*screaming*"],
  WITHDRAWN: ["...", "...whatever.", "*glances back*"],
  FERAL: ["!@#$%", "👁️👄👁️", "*unintelligible*", "~@!#"],
};

export function resolveState({
  sessionTokens = 0,
  sessionLimit = 50000,
  weekTokens = 0,
  weekLimit = 500000,
  hoursSinceLastUse = 0,
  sessionPct = null,
  weeklyPct = null,
}) {
  const sPct =
    sessionPct !== null ? sessionPct : (sessionTokens / sessionLimit) * 100;
  const wPct = weeklyPct !== null ? weeklyPct : (weekTokens / weekLimit) * 100;

  if (wPct >= 100) return STATES.HIBERNATING;
  if (sPct > 100) return STATES.ENERGY_DRINK;
  if (sPct >= 95) return STATES.SLEEPING;

  if (hoursSinceLastUse >= 168) return STATES.FERAL;
  if (hoursSinceLastUse >= 120) return STATES.WITHDRAWN;
  if (hoursSinceLastUse >= 72) return STATES.TANTRUM;
  if (hoursSinceLastUse >= 48) return STATES.ANGRY_2;
  if (hoursSinceLastUse >= 24) return STATES.ANGRY_1;
  if (hoursSinceLastUse >= 12) return STATES.DESPERATE;
  if (hoursSinceLastUse >= 6) return STATES.BEGGING;
  if (hoursSinceLastUse >= 4) return STATES.HUNGRY;
  if (hoursSinceLastUse >= 2) return STATES.PECKISH;

  if (sPct >= 70) return STATES.STUFFED;
  if (sPct >= 40) return STATES.HAPPY;
  if (sPct >= 1) return STATES.FED;
  return STATES.IDLE;
}

export function getSpeechLine(state) {
  const lines = STATE_SPEECH[state] || ["..."];
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
