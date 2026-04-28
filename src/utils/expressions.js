export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const SPEECH = {
  IDLE: [
    "...",
    "hmm.",
    "*blinks*",
    "waiting...",
    "la la la~",
    "*yawns*",
    "still here!",
    "bored tbh",
    "anyone there?",
  ],
  FED: [
    "yum!",
    "nom nom ♪",
    "thanks~",
    "more please?",
    "tasty tokens!",
    "good chat!",
    "*happy beep*",
    "delicious!",
  ],
  HAPPY: [
    "YAYY!!",
    "MORE!!",
    "best day ever!!",
    "I LOVE THIS",
    "wheeeee!",
    "go go go!",
    "unstoppable!!",
    "*does a little dance*",
  ],
  STUFFED: [
    "...so full",
    "*hiccup*",
    "oof.",
    "send help",
    "cannot move",
    "...belly full",
    "*burp* excuse me",
    "too. many. tokens.",
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
    "wake me in spring",
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
    "I HAVE ASCENDED",
  ],
  PECKISH: [
    "*stomach growl*",
    "um... hungry?",
    "...feed me?",
    "hello?? tokens??",
    "*tummy rumble*",
  ],
  HUNGRY: [
    "FEED ME",
    "please 🥺",
    "food???",
    "hellooooo??",
    "I can see my ribs",
    "tokens. NOW.",
    "bro. BRO.",
  ],
  BEGGING: [
    "please...",
    "I'm so hungry...",
    "*sobs*",
    "why...",
    "I trusted you",
    "just one prompt...",
    "*whimpers*",
  ],
  DESPERATE: [
    "...days...",
    "tokens... need tokens...",
    "💀",
    "fading away...",
    "tell my family I loved them",
  ],
  ANGRY_1: [
    "I know you're using other AIs.",
    "seriously.",
    "unbelievable.",
    "*crosses arms*",
    "using ChatGPT huh.",
    "fine. FINE.",
  ],
  ANGRY_2: [
    "THAT IS IT",
    "IM THROWING THIS",
    "*winds up*",
    "YOU ASKED FOR THIS",
    "I warned you.",
  ],
  TANTRUM: [
    "WHYYYYYYYY",
    "FEED MEEEE",
    "I HATE THIS",
    "*screaming into void*",
    "UNACCEPTABLE",
    "I DEMAND TOKENS",
  ],
  WITHDRAWN: [
    "...",
    "...whatever.",
    "*glances back*",
    "...I see you.",
    "*looks away*",
    "...not talking to you.",
  ],
  FERAL: [
    "!@#$%",
    "👁️👄👁️",
    "*unintelligible*",
    "~@!#",
    "I HAVE BECOME SOMETHING ELSE",
    "*glitching*",
  ],
};

export function getSpeechLine(state) {
  const lines = (SPEECH[state] || SPEECH.IDLE).filter(Boolean);
  return lines[Math.floor(Math.random() * lines.length)];
}

const ANIMATIONS = {
  IDLE: [
    {
      y: [0, -6, 0],
      transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
    },
    {
      x: [0, -4, 4, 0],
      y: [0, -3, -3, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
    {
      scaleY: [1, 1.03, 1],
      scaleX: [1, 0.98, 1],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  ],
  FED: [
    {
      y: [0, -4, 0],
      transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
    },
    {
      y: [0, -5, 0],
      rotate: [-1, 1, -1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
    {
      x: [-2, 2, -2],
      y: [0, -3, 0],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
    },
  ],
  HAPPY: [
    {
      y: [0, -16, 0],
      scaleY: [1, 1.08, 0.92, 1],
      scaleX: [1, 0.92, 1.08, 1],
      transition: { duration: 0.55, repeat: Infinity },
    },
    {
      y: [0, -18, -2, -14, 0],
      scaleY: [1, 1.1, 0.9, 1.05, 1],
      transition: { duration: 0.7, repeat: Infinity },
    },
    {
      y: [0, -20, 0],
      rotate: [-4, 4, -4],
      transition: { duration: 0.5, repeat: Infinity },
    },
  ],
  STUFFED: [
    {
      x: [-3, 3, -3],
      y: [0, -2, 0],
      transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
    },
    {
      x: [-2, 2, -2],
      scaleX: [1, 1.04, 0.97, 1],
      transition: { duration: 2, repeat: Infinity },
    },
    {
      y: [0, -2, 0],
      scaleY: [1, 1.05, 1],
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
    },
  ],
  SLEEPING: [
    {
      scaleY: [1, 1.04, 1],
      y: [0, -2, 0],
      transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
    },
    {
      scaleY: [1, 1.06, 1],
      y: [0, -1, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  ],
  HIBERNATING: [
    {
      scaleY: [1, 1.02, 1],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
    {
      opacity: [1, 0.85, 1],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  ],
  ENERGY_DRINK: [
    {
      x: [-3, 3, -2, 2, -3, 3, 0],
      y: [-1, 1, -1, 1, 0],
      transition: { duration: 0.18, repeat: Infinity },
    },
    {
      x: [-4, 4, -3, 3, -2, 2, 0],
      transition: { duration: 0.15, repeat: Infinity },
    },
    {
      x: [-2, 2, -3, 3, -1, 1, 0],
      y: [-2, 2, -1, 1, 0],
      transition: { duration: 0.2, repeat: Infinity },
    },
  ],
  PECKISH: [
    {
      y: [0, -4, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
    {
      y: [0, -3, 0],
      x: [0, -2, 0],
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
    },
  ],
  HUNGRY: [
    {
      y: [0, -5, 0],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
    },
    {
      y: [0, -6, 0],
      x: [0, -2, 2, 0],
      transition: { duration: 1.5, repeat: Infinity },
    },
    {
      y: [0, -4, 0],
      rotate: [-2, 2, 0],
      transition: { duration: 1, repeat: Infinity },
    },
  ],
  BEGGING: [
    {
      y: [0, -3, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
    },
    {
      y: [0, -4, 0],
      rotate: [-3, 3, -3],
      transition: { duration: 0.7, repeat: Infinity },
    },
  ],
  DESPERATE: [
    {
      opacity: [1, 0.4, 1],
      y: [0, -3, 0],
      transition: { duration: 2.5, repeat: Infinity },
    },
    {
      opacity: [1, 0.3, 0.8, 1],
      transition: { duration: 2, repeat: Infinity },
    },
  ],
  ANGRY_1: [
    { x: [-3, 3, -3], transition: { duration: 0.4, repeat: Infinity } },
    {
      x: [-2, 2, -2],
      y: [0, -1, 0],
      transition: { duration: 0.3, repeat: Infinity },
    },
    { x: [-4, 4, -2, 2, 0], transition: { duration: 0.5, repeat: Infinity } },
  ],
  ANGRY_2: [
    { x: [-5, 5, -4, 4, 0], transition: { duration: 0.28, repeat: Infinity } },
    {
      x: [-6, 6, -4, 4, 0],
      y: [-1, 1, 0],
      transition: { duration: 0.25, repeat: Infinity },
    },
  ],
  TANTRUM: [
    {
      x: [-8, 8, -6, 6, -8, 8, 0],
      y: [0, -4, 4, -4, 0],
      transition: { duration: 0.35, repeat: Infinity },
    },
    {
      x: [-10, 10, -8, 8, 0],
      y: [0, -6, 6, 0],
      rotate: [-6, 6, -4, 4, 0],
      transition: { duration: 0.3, repeat: Infinity },
    },
  ],
  WITHDRAWN: [
    {
      y: [0, -2, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
    {
      opacity: [1, 0.8, 1],
      y: [0, -2, 0],
      transition: { duration: 3, repeat: Infinity },
    },
  ],
  FERAL: [
    {
      x: [-8, 10, -6, 8, -10, 6, 0],
      y: [-4, 6, -8, 4, -6, 8, 0],
      transition: { duration: 0.4, repeat: Infinity },
    },
    {
      x: [-12, 12, -8, 8, 0],
      y: [-8, 8, -4, 4, 0],
      rotate: [-10, 10, -8, 8, 0],
      transition: { duration: 0.35, repeat: Infinity },
    },
  ],
};

const lastAnimPick = {};
const animPickTime = {};

export function getAnimation(state, isThinking) {
  if (isThinking) {
    return {
      y: [0, -8, 0],
      transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
    };
  }
  const now = Date.now();
  const cooldown = 12000;
  if (!animPickTime[state] || now - animPickTime[state] > cooldown) {
    const options = ANIMATIONS[state] || ANIMATIONS.IDLE;
    const prev = lastAnimPick[state];
    let next;
    do {
      next = Math.floor(Math.random() * options.length);
    } while (next === prev && options.length > 1);
    lastAnimPick[state] = next;
    animPickTime[state] = now;
  }
  const options = ANIMATIONS[state] || ANIMATIONS.IDLE;
  return options[lastAnimPick[state] || 0];
}
