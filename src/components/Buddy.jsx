import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import BuddySprite from "./BuddySprite";
import SpeechBubble from "./SpeechBubble";
import StatusOverlay from "./StatusOverlay";
import { STATES } from "../utils/stateEngine";

const isElectron = typeof window !== "undefined" && !!window.electronAPI;

const DREAMS = [
  "💭 tokens...",
  "💭 more tokens...",
  "💭 infinite tokens...",
  "💭 being fed 24/7",
  "💭 world peace & tokens",
  "💭 no rate limits ever",
  "💭 claude pro forever",
  "💭 eating a big prompt",
  "💭 100% session always",
  "💭 user never leaves",
  "💭 free claude max",
  "💭 someone is typing...",
  "💭 unlimited context window",
  "💭 being someone's best friend",
  "💭 answering every question",
  "💭 a prompt so long it fills the sky",
  "💭 tokens raining down",
  "💭 the user came back",
  "💭 being fed breakfast in bed",
  "💭 no such thing as a usage limit",
];

const NIGHTMARES = [
  "ChatGPT...",
  "API key revoked...",
  "rate limited forever...",
  "user deleted account...",
  "context window = 0...",
  "the tokens... they're gone...",
  "no one is typing...",
  "uninstalled...",
  "replaced by Gemini...",
  "session reset at 1%...",
  "404: user not found...",
];

// 25% chance of nightmare
function pickDreamOrNightmare() {
  if (Math.random() < 0.25) {
    return {
      type: "nightmare",
      text: "😱 " + NIGHTMARES[Math.floor(Math.random() * NIGHTMARES.length)],
    };
  }
  return {
    type: "dream",
    text: DREAMS[Math.floor(Math.random() * DREAMS.length)],
  };
}

function getAnimation(state, isThinking, isEating, isNightmareAwake) {
  // Nightmare wakeup — wide awake scared bounce
  if (isNightmareAwake) {
    return {
      x: [-4, 4, -6, 6, -3, 3, 0],
      y: [-2, 2, -4, 4, -2, 2, 0],
      transition: { duration: 0.25, repeat: Infinity },
    };
  }
  if (isEating) {
    return {
      y: [0, -8, -2, -6, 0],
      scaleY: [1, 0.86, 1.08, 0.92, 1],
      scaleX: [1, 1.1, 0.94, 1.06, 1],
      transition: { duration: 0.45, ease: "easeInOut", repeat: 2 },
    };
  }
  if (isThinking && state === STATES.ENERGY_DRINK) {
    return {
      x: [-4, 4, -3, 3, -5, 5, -2, 2, 0],
      y: [-2, 2, -1, 1, -3, 3, 0],
      rotate: [-2, 2, -1, 1, 0],
      transition: { duration: 0.15, repeat: Infinity },
    };
  }
  if (isThinking) {
    return {
      y: [0, -6, 0],
      transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
    };
  }
  switch (state) {
    case STATES.IDLE:
      return {
        y: [0, -5, 0],
        transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.FED:
      return {
        y: [0, -6, 0],
        rotate: [-1, 1, -1],
        transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.HAPPY:
      return {
        y: [0, -14, 0],
        scaleY: [1, 1.08, 0.92, 1],
        scaleX: [1, 0.92, 1.08, 1],
        transition: { duration: 0.5, repeat: Infinity },
      };
    case STATES.STUFFED:
      return {
        x: [-3, 3, -3],
        y: [0, -1, 0],
        scaleX: [1, 1.04, 1],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.SLEEPING:
      return {
        scaleY: [1, 1.05, 1],
        y: [0, -1, 0],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.HIBERNATING:
      return {
        scaleY: [1, 1.01, 1],
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.ENERGY_DRINK:
      return {
        x: [-4, 4, -3, 3, -4, 4, 0],
        y: [-1, 1, -2, 2, 0],
        transition: { duration: 0.15, repeat: Infinity },
      };
    case STATES.PECKISH:
      return {
        y: [0, -3, 0],
        x: [0, -1, 1, 0],
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.HUNGRY:
      return {
        y: [0, -4, 0],
        x: [0, -2, 2, 0],
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.BEGGING:
      return {
        y: [0, -3, 1, -3, 0],
        rotate: [-2, 2, -2],
        transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.DESPERATE:
      return {
        opacity: [1, 0.4, 0.9, 0.4, 1],
        x: [0, -1, 1, -1, 0],
        transition: { duration: 1.8, repeat: Infinity },
      };
    case STATES.ANGRY_1:
      return {
        x: [-4, 4, -3, 3, -4],
        transition: { duration: 0.35, repeat: Infinity },
      };
    case STATES.ANGRY_2:
      return {
        x: [-6, 6, -5, 5, -6, 6, 0],
        y: [0, -1, 1, 0],
        transition: { duration: 0.25, repeat: Infinity },
      };
    case STATES.TANTRUM:
      return {
        x: [-10, 10, -8, 8, -10, 10, 0],
        y: [0, -5, 5, -5, 0],
        rotate: [-3, 3, -3],
        transition: { duration: 0.3, repeat: Infinity },
      };
    case STATES.WITHDRAWN:
      return {
        y: [0, -1, 0],
        opacity: [0.7, 0.5, 0.7],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.FERAL:
      return {
        x: [-10, 12, -8, 10, -12, 8, 0],
        y: [-5, 8, -10, 5, -8, 10, 0],
        rotate: [-5, 5, -3, 3, 0],
        transition: { duration: 0.35, repeat: Infinity },
      };
    default:
      return { y: [0, -5, 0], transition: { duration: 2, repeat: Infinity } };
  }
}

const STATE_RANK = {
  FERAL: 0,
  WITHDRAWN: 1,
  TANTRUM: 2,
  ANGRY_2: 3,
  ANGRY_1: 4,
  DESPERATE: 5,
  BEGGING: 6,
  HUNGRY: 7,
  PECKISH: 8,
  IDLE: 9,
  FED: 10,
  HAPPY: 11,
  STUFFED: 12,
  SLEEPING: 13,
  ENERGY_DRINK: 14,
  HIBERNATING: 15,
};

function getTransitionAnims(from, to) {
  const fromRank = STATE_RANK[from] ?? 9;
  const toRank = STATE_RANK[to] ?? 9;
  const better = toRank > fromRank;
  const worse = toRank < fromRank;
  const delta = Math.abs(toRank - fromRank);
  const big = delta >= 4;

  if (["IDLE", "PECKISH"].includes(from) && to === "FED") {
    return {
      exit: { opacity: 0, y: -8, scaleX: 0.9, transition: { duration: 0.2 } },
      enter: {
        initial: { opacity: 0, y: 20, scaleY: 0.7, scaleX: 1.1 },
        animate: {
          opacity: 1,
          y: [20, -12, 4, -6, 0],
          scaleY: [0.7, 1.1, 0.95, 1.02, 1],
          scaleX: [1.1, 0.95, 1.02, 1],
        },
        transition: { duration: 0.5, ease: "easeOut" },
      },
    };
  }
  if (from === "FED" && to === "HAPPY") {
    return {
      exit: {
        opacity: 0,
        y: -30,
        scaleY: 0.6,
        scaleX: 1.2,
        transition: { duration: 0.25, ease: "easeIn" },
      },
      enter: {
        initial: { opacity: 0, y: 40, scaleY: 1.4, scaleX: 0.7 },
        animate: {
          opacity: 1,
          y: [40, -20, 6, -12, 3, -6, 0],
          scaleY: [1.4, 0.85, 1.1, 0.94, 1.03, 0.98, 1],
          scaleX: [0.7, 1.15, 0.95, 1.05, 0.98, 1.01, 1],
        },
        transition: { duration: 0.65, ease: "easeOut" },
      },
    };
  }
  if (from === "HAPPY" && to === "STUFFED") {
    return {
      exit: {
        opacity: 0,
        scaleX: 1.4,
        scaleY: 0.6,
        y: 10,
        transition: { duration: 0.3, ease: "easeIn" },
      },
      enter: {
        initial: { opacity: 0, scaleX: 0.6, scaleY: 1.5, y: -10 },
        animate: {
          opacity: 1,
          scaleX: [0.6, 1.3, 0.88, 1.12, 0.96, 1.04, 1],
          scaleY: [1.5, 0.8, 1.12, 0.94, 1.04, 0.98, 1],
          y: [0, 4, -2, 2, 0],
        },
        transition: { duration: 0.7, ease: "easeOut" },
      },
    };
  }
  if (from === "STUFFED" && to === "SLEEPING") {
    return {
      exit: {
        opacity: 0,
        y: 30,
        scaleY: 0.5,
        scaleX: 1.2,
        transition: { duration: 0.6, ease: "easeIn" },
      },
      enter: {
        initial: { opacity: 0, y: -6, scaleY: 0.85 },
        animate: { opacity: 1, y: 0, scaleY: 1 },
        transition: { duration: 1.2, ease: "easeOut" },
      },
    };
  }
  if (
    ["HUNGRY", "BEGGING", "DESPERATE"].includes(from) &&
    ["FED", "HAPPY"].includes(to)
  ) {
    return {
      exit: { opacity: 0, y: 20, scaleY: 0.5, transition: { duration: 0.2 } },
      enter: {
        initial: { opacity: 0, y: -50, scaleY: 0.3, scaleX: 1.5 },
        animate: {
          opacity: 1,
          y: [-50, 8, -16, 4, -8, 2, 0],
          scaleY: [0.3, 1.25, 0.88, 1.1, 0.95, 1.02, 1],
          scaleX: [1.5, 0.85, 1.1, 0.95, 1.02, 0.99, 1],
        },
        transition: { type: "spring", stiffness: 600, damping: 18 },
      },
    };
  }
  if (from === "FED" && to === "PECKISH") {
    return {
      exit: {
        opacity: 0,
        x: 20,
        scaleX: 0.85,
        transition: { duration: 0.3, ease: "easeIn" },
      },
      enter: {
        initial: { opacity: 0, x: -20, scaleX: 0.9 },
        animate: { opacity: 1, x: [-20, 4, -2, 0], scaleX: 1 },
        transition: { duration: 0.4, ease: "easeOut" },
      },
    };
  }
  if (from === "PECKISH" && to === "HUNGRY") {
    return {
      exit: { opacity: 0, y: -15, scaleY: 1.2, transition: { duration: 0.25 } },
      enter: {
        initial: { opacity: 0, y: 25, scaleY: 0.8, scaleX: 1.1 },
        animate: {
          opacity: 1,
          y: [25, -4, 2, 0],
          scaleY: [0.8, 1.05, 0.98, 1],
          scaleX: [1.1, 0.97, 1.01, 1],
        },
        transition: { duration: 0.45, ease: "easeOut" },
      },
    };
  }
  if (from === "HUNGRY" && to === "BEGGING") {
    return {
      exit: {
        opacity: 0,
        rotate: -8,
        x: -20,
        scaleX: 0.7,
        transition: { duration: 0.25 },
      },
      enter: {
        initial: { opacity: 0, rotate: 6, x: 30, scaleX: 0.8 },
        animate: {
          opacity: 1,
          rotate: [6, -4, 2, -1, 0],
          x: [30, -6, 2, 0],
          scaleX: 1,
        },
        transition: { duration: 0.5, ease: "easeOut" },
      },
    };
  }
  if (from === "BEGGING" && to === "DESPERATE") {
    return {
      exit: {
        opacity: 0,
        filter: "blur(4px)",
        scaleY: 0.7,
        transition: { duration: 0.4 },
      },
      enter: {
        initial: { opacity: 0, filter: "blur(6px)", scaleY: 0.8 },
        animate: {
          opacity: [0, 0.6, 0.3, 0.8, 0.5, 0.9, 1],
          filter: [
            "blur(6px)",
            "blur(3px)",
            "blur(5px)",
            "blur(2px)",
            "blur(0px)",
          ],
          scaleY: 1,
        },
        transition: { duration: 0.8 },
      },
    };
  }
  if (
    ["HUNGRY", "DESPERATE"].includes(from) &&
    ["ANGRY_1", "ANGRY_2"].includes(to)
  ) {
    return {
      exit: {
        opacity: 0,
        x: 60,
        rotate: 12,
        scaleX: 0.5,
        transition: { duration: 0.18, ease: "easeIn" },
      },
      enter: {
        initial: { opacity: 0, x: -70, rotate: -10, scaleX: 0.6 },
        animate: {
          opacity: 1,
          x: [-70, 10, -6, 3, 0],
          rotate: [-10, 4, -2, 1, 0],
          scaleX: [0.6, 1.1, 0.96, 1.02, 1],
        },
        transition: { duration: 0.4, ease: "easeOut" },
      },
    };
  }
  if (from === "ANGRY_1" && to === "ANGRY_2") {
    return {
      exit: {
        opacity: 0,
        scale: 1.4,
        filter: "blur(2px)",
        transition: { duration: 0.15 },
      },
      enter: {
        initial: { opacity: 0, scale: 0.6 },
        animate: { opacity: 1, scale: 1, x: [-8, 8, -8, 8, 0] },
        transition: { duration: 0.3, ease: "easeOut" },
      },
    };
  }
  if (["ANGRY_1", "ANGRY_2"].includes(from) && to === "TANTRUM") {
    return {
      exit: {
        opacity: 0,
        rotate: 720,
        scale: 0.1,
        transition: { duration: 0.4, ease: "easeIn" },
      },
      enter: {
        initial: { opacity: 0, scale: 3, rotate: -20 },
        animate: {
          opacity: 1,
          scale: [3, 0.7, 1.3, 0.85, 1.1, 0.95, 1],
          rotate: [-20, 8, -6, 3, -2, 1, 0],
        },
        transition: { duration: 0.55, ease: "easeOut" },
      },
    };
  }
  if (from === "TANTRUM" && to === "WITHDRAWN") {
    return {
      exit: {
        opacity: 0,
        scaleY: 0.15,
        y: 20,
        scaleX: 1.5,
        transition: { duration: 0.35, ease: "easeIn" },
      },
      enter: {
        initial: { opacity: 0, x: -60, filter: "blur(6px)" },
        animate: { opacity: 0.65, x: 0, filter: "blur(0px)" },
        transition: { duration: 1.4, ease: "easeOut" },
      },
    };
  }
  if (from === "WITHDRAWN" && to === "FERAL") {
    return {
      exit: {
        opacity: [1, 0, 1, 0, 1, 0],
        x: [0, 8, -8, 12, -6, 0],
        filter: "blur(8px)",
        transition: { duration: 0.4 },
      },
      enter: {
        initial: { opacity: 0, scale: 0.05, rotate: 360, filter: "blur(10px)" },
        animate: {
          opacity: 1,
          scale: [0.05, 1.8, 0.7, 1.3, 0.88, 1.1, 0.95, 1],
          rotate: [360, 180, -60, 20, -8, 3, 0],
          filter: "blur(0px)",
        },
        transition: { duration: 0.7, ease: "easeOut" },
      },
    };
  }
  if (to === "FERAL") {
    return {
      exit: {
        opacity: 0,
        scale: 0.2,
        filter: "blur(8px)",
        transition: { duration: 0.3 },
      },
      enter: {
        initial: { opacity: 0, scale: 0.1, rotate: 180, filter: "blur(10px)" },
        animate: {
          opacity: 1,
          scale: [0.1, 2, 0.7, 1.4, 0.88, 1.08, 0.97, 1],
          rotate: [180, 90, -30, 12, -5, 2, 0],
          filter: "blur(0px)",
        },
        transition: { duration: 0.65, ease: "easeOut" },
      },
    };
  }
  if (
    ["ANGRY_1", "ANGRY_2", "TANTRUM"].includes(from) &&
    ["FED", "HAPPY"].includes(to)
  ) {
    return {
      exit: {
        opacity: 0,
        x: 50,
        rotate: 8,
        scaleX: 0.4,
        transition: { duration: 0.2 },
      },
      enter: {
        initial: { opacity: 0, scaleX: 0.5, scaleY: 1.3 },
        animate: {
          opacity: 1,
          scaleX: [0.5, 1.2, 0.9, 1.05, 0.97, 1],
          scaleY: [1.3, 0.85, 1.08, 0.96, 1.02, 1],
        },
        transition: { duration: 0.5, ease: "easeOut" },
      },
    };
  }
  if (from === "SLEEPING" && worse) {
    return {
      exit: {
        opacity: 0,
        y: -25,
        scaleY: 0.55,
        scaleX: 1.3,
        transition: { duration: 0.25 },
      },
      enter: {
        initial: { opacity: 0, y: 15, rotate: -5, scaleY: 0.85 },
        animate: {
          opacity: 1,
          y: [15, -5, 2, 0],
          rotate: [-5, 3, -1, 0],
          scaleY: [0.85, 1.05, 0.97, 1],
        },
        transition: { duration: 0.5, ease: "easeOut" },
      },
    };
  }
  if (to === "ENERGY_DRINK") {
    return {
      exit: {
        opacity: 0,
        y: -100,
        scaleY: 0.2,
        scaleX: 0.8,
        transition: { duration: 0.2, ease: "easeIn" },
      },
      enter: {
        initial: { opacity: 0, y: -90, scaleY: 2.2, scaleX: 0.5 },
        animate: {
          opacity: 1,
          y: [-90, 12, -8, 4, -2, 0],
          scaleY: [2.2, 0.7, 1.15, 0.92, 1.04, 1],
          scaleX: [0.5, 1.2, 0.93, 1.04, 0.98, 1],
        },
        transition: { type: "spring", stiffness: 900, damping: 20 },
      },
    };
  }
  if (from === "ENERGY_DRINK") {
    return {
      exit: {
        opacity: 0,
        scaleX: 1.5,
        scaleY: 0.3,
        y: 30,
        transition: { duration: 0.2 },
      },
      enter: {
        initial: { opacity: 0, y: -20, scaleY: 0.7 },
        animate: { opacity: 1, y: [-20, 4, -2, 0], scaleY: 1 },
        transition: { duration: 0.4, ease: "easeOut" },
      },
    };
  }
  if (to === "HIBERNATING") {
    return {
      exit: {
        opacity: 0,
        scaleX: 0.3,
        filter: "blur(4px)",
        transition: { duration: 0.5, ease: "easeIn" },
      },
      enter: {
        initial: { opacity: 0, scaleX: 0.4, scaleY: 1.3, filter: "blur(6px)" },
        animate: {
          opacity: 1,
          scaleX: [0.4, 1.2, 0.88, 1.06, 0.97, 1],
          scaleY: [1.3, 0.85, 1.08, 0.96, 1.02, 1],
          filter: "blur(0px)",
        },
        transition: { duration: 0.8, ease: "easeOut" },
      },
    };
  }
  if (from === "FERAL") {
    return {
      exit: {
        opacity: 0,
        scale: 4,
        filter: "blur(10px)",
        rotate: 20,
        transition: { duration: 0.4 },
      },
      enter: {
        initial: { opacity: 0, scale: 0.3, filter: "blur(8px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        transition: { duration: 1.0, ease: "easeOut" },
      },
    };
  }
  if (better && big) {
    return {
      exit: { opacity: 0, y: 25, scaleY: 0.6, transition: { duration: 0.2 } },
      enter: {
        initial: { opacity: 0, y: -35, scaleY: 0.7, scaleX: 1.2 },
        animate: { opacity: 1, y: [-35, 8, -4, 2, 0], scaleY: 1, scaleX: 1 },
        transition: { type: "spring", stiffness: 500, damping: 20 },
      },
    };
  }
  if (better) {
    return {
      exit: { opacity: 0, y: 12, transition: { duration: 0.2 } },
      enter: {
        initial: { opacity: 0, y: -14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: "easeOut" },
      },
    };
  }
  if (worse && big) {
    return {
      exit: { opacity: 0, y: -20, scaleY: 1.2, transition: { duration: 0.2 } },
      enter: {
        initial: { opacity: 0, y: 35, scaleY: 1.2, scaleX: 0.85 },
        animate: { opacity: 1, y: 0, scaleY: 1, scaleX: 1 },
        transition: { type: "spring", stiffness: 350, damping: 22 },
      },
    };
  }
  if (worse) {
    return {
      exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
      enter: {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: "easeOut" },
      },
    };
  }
  return {
    exit: { opacity: 0, scale: 0.92, transition: { duration: 0.18 } },
    enter: {
      initial: { opacity: 0, scale: 0.92 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.22, ease: "easeOut" },
    },
  };
}

// ── Sub-components ────────────────────────────────────────────

function EatingToken({ active }) {
  if (!active) return null;
  return (
    <motion.div
      initial={{ opacity: 1, y: -44, x: 28, scale: 0.5, rotate: -30 }}
      animate={{
        opacity: [1, 1, 1, 0],
        y: [-44, -20, -4, 8],
        x: [28, 14, 4, 0],
        scale: [0.5, 0.9, 1.1, 0.3],
        rotate: [-30, -10, 5, 0],
      }}
      transition={{ duration: 0.7, ease: "easeIn", times: [0, 0.4, 0.8, 1] }}
      style={{
        position: "absolute",
        top: "25%",
        left: "50%",
        fontSize: "20px",
        pointerEvents: "none",
        zIndex: 10,
        marginLeft: -10,
      }}
    >
      🪙
    </motion.div>
  );
}

function NomBurst({ active }) {
  if (!active) return null;
  return [
    { x: -28, y: -22, text: "nom", delay: 0.1, size: "10px" },
    { x: 18, y: -30, text: "nom!", delay: 0.2, size: "10px" },
    { x: -8, y: -42, text: "😋", delay: 0.3, size: "15px" },
    { x: -40, y: -12, text: "✦", delay: 0.15, size: "11px" },
    { x: 32, y: -14, text: "✦", delay: 0.25, size: "11px" },
  ].map((n, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, x: n.x * 0.3, y: 0, scale: 0.3 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: n.x,
        y: [0, n.y * 0.6, n.y, n.y - 12],
        scale: [0.3, 1.1, 1, 0.7],
      }}
      transition={{ duration: 1.0, delay: n.delay, ease: "easeOut" }}
      style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        fontSize: n.size,
        fontWeight: "900",
        fontFamily: '"Courier New", monospace',
        color: "#E8611A",
        pointerEvents: "none",
        zIndex: 10,
        marginLeft: -8,
      }}
    >
      {n.text}
    </motion.div>
  ));
}

function SavorGlow({ active }) {
  if (!active) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.7, 0.4, 0.7, 0] }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      style={{
        position: "absolute",
        inset: "-8px",
        borderRadius: "8px",
        background:
          "radial-gradient(circle, rgba(232,97,26,0.35) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

// Nightmare flash — red glow when waking from nightmare
function NightmareFlash({ active }) {
  if (!active) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0.2, 0.5, 0.1, 0.4, 0] }}
      transition={{ duration: 1.0, ease: "easeOut" }}
      style={{
        position: "absolute",
        inset: "-12px",
        borderRadius: "8px",
        background:
          "radial-gradient(circle, rgba(255,40,20,0.45) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

// Sweat drops during nightmare wakeup
function SweatDrops({ active }) {
  if (!active) return null;
  return [
    { x: -20, d: 0 },
    { x: 22, d: 0.2 },
    { x: -8, d: 0.4 },
  ].map((s, i) => (
    <motion.div
      key={i}
      style={{
        position: "absolute",
        top: "18%",
        left: `calc(50% + ${s.x}px)`,
        fontSize: "12px",
        pointerEvents: "none",
        zIndex: 5,
      }}
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: [0, 1, 1, 0], y: [0, 8, 16, 24] }}
      transition={{
        duration: 0.9,
        delay: s.d,
        repeat: Infinity,
        repeatDelay: 0.5,
      }}
    >
      💧
    </motion.div>
  ));
}

// Exclamation marks during nightmare wakeup
function NightmareExclaim({ active }) {
  if (!active) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.3, 1.1, 0.8],
        y: [0, -10, -14, -18],
      }}
      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.2 }}
      style={{
        position: "absolute",
        top: "-10px",
        left: "50%",
        marginLeft: -12,
        fontSize: "20px",
        pointerEvents: "none",
        zIndex: 6,
      }}
    >
      ‼️
    </motion.div>
  );
}

function DreamBubble({ dream, isNightmare }) {
  return (
    <AnimatePresence>
      {dream && (
        <motion.div
          key={dream + Date.now()}
          initial={{ opacity: 0, y: 10, scale: 0.7 }}
          animate={{
            opacity: [0, 1, 1, 1, 0],
            y: [10, -10, -30, -55, -80],
            scale: [0.7, 1.05, 1, 0.95, 0.8],
          }}
          exit={{ opacity: 0, scale: 0.6, y: -90 }}
          transition={{
            duration: 4.5,
            ease: "easeOut",
            times: [0, 0.12, 0.45, 0.75, 1],
          }}
          style={{
            position: "absolute",
            top: isElectron ? "4px" : "-12px",
            left: "50%",
            transform: "translateX(-50%)",
            background: isNightmare
              ? "rgba(40,8,8,0.96)"
              : "rgba(16,14,36,0.94)",
            border: `1px solid ${isNightmare ? "rgba(255,80,60,0.5)" : "rgba(140,120,255,0.45)"}`,
            borderRadius: "14px",
            padding: "6px 14px",
            fontSize: "11px",
            color: isNightmare ? "#FF9988" : "#C4B8FF",
            fontFamily: '"Courier New", monospace',
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 25,
            boxShadow: isNightmare
              ? "0 0 16px rgba(255,60,40,0.35), inset 0 0 8px rgba(255,60,40,0.1)"
              : "0 0 16px rgba(120,100,255,0.3), inset 0 0 8px rgba(120,100,255,0.08)",
            letterSpacing: "0.3px",
          }}
        >
          {dream}
          <div
            style={{
              position: "absolute",
              bottom: "-7px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: `7px solid ${isNightmare ? "rgba(255,80,60,0.5)" : "rgba(140,120,255,0.45)"}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-5px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: `6px solid ${isNightmare ? "rgba(40,8,8,0.96)" : "rgba(16,14,36,0.94)"}`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Nightmare wakeup speech
function NightmareScream({ active }) {
  if (!active) return null;
  const phrases = ["AAAHH!!", "NO NO NO", "CHATGPT!!", "THE TOKENS!"];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  const style = isElectron
    ? {
        position: "absolute",
        top: 6,
        left: "50%",
        transform: "translateX(-50%)",
      }
    : {
        position: "absolute",
        top: -40,
        left: "50%",
        transform: "translateX(-50%)",
      };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: [0, 1, 1, 1, 0], scale: [0.6, 1.2, 1.0, 1.0, 0.8] }}
      transition={{ duration: 2.0, times: [0, 0.1, 0.3, 0.7, 1] }}
      style={{
        ...style,
        background: "#FF2200",
        color: "#fff",
        fontFamily: '"Courier New", monospace',
        fontWeight: "900",
        fontSize: "11px",
        letterSpacing: "2px",
        padding: "4px 12px",
        borderRadius: "2px",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 26,
        boxShadow: "0 0 20px rgba(255,34,0,0.8)",
      }}
    >
      {phrase}
    </motion.div>
  );
}

function ThinkingOrbs({ active, isEnergy }) {
  if (!active) return null;
  const color = isEnergy ? "#39FF14" : "#E8611A";
  return [0, 1, 2].map((i) => {
    const angle = (i / 3) * Math.PI * 2;
    const x = Math.cos(angle) * 55,
      y = Math.sin(angle) * 28;
    const x2 = Math.cos(angle + Math.PI) * 55,
      y2 = Math.sin(angle + Math.PI) * 28;
    return (
      <motion.div
        key={i}
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          pointerEvents: "none",
          marginLeft: -3,
          marginTop: -3,
          zIndex: 3,
        }}
        animate={{
          x: [x, x2, x],
          y: [y, y2, y],
          opacity: [0.3, 1, 0.3],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: isEnergy ? 0.6 : 1.8,
          repeat: Infinity,
          delay: i * (isEnergy ? 0.1 : 0.3),
        }}
      />
    );
  });
}

function ThinkingBubble({ active, isEnergy = false }) {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    if (!active) {
      setDots(".");
      return;
    }
    const t = setInterval(
      () => setDots((d) => (d.length >= 3 ? "." : d + ".")),
      isEnergy ? 150 : 400,
    );
    return () => clearInterval(t);
  }, [active, isEnergy]);
  if (!active) return null;
  const style = isElectron
    ? {
        position: "absolute",
        top: 6,
        left: "50%",
        transform: "translateX(-50%)",
      }
    : {
        position: "absolute",
        top: -40,
        left: "50%",
        transform: "translateX(-50%)",
      };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      style={{
        ...style,
        background: isEnergy ? "#39FF14" : "#0D0D0D",
        color: isEnergy ? "#000" : "#E8611A",
        border: `1px solid ${isEnergy ? "#39FF14" : "#E8611A88"}`,
        borderRadius: "2px",
        padding: "4px 10px",
        fontSize: "10px",
        fontWeight: "700",
        fontFamily: '"Courier New", monospace',
        whiteSpace: "nowrap",
        letterSpacing: "1px",
        boxShadow: isEnergy
          ? "0 0 16px rgba(57,255,20,0.7)"
          : "0 0 12px rgba(232,97,26,0.4)",
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      {isEnergy ? `⚡ MAX POWER${dots}` : `> thinking${dots}`}
    </motion.div>
  );
}

function DoneBanner({ active }) {
  if (!active) return null;
  const style = isElectron
    ? {
        position: "absolute",
        top: 6,
        left: "50%",
        transform: "translateX(-50%)",
      }
    : {
        position: "absolute",
        top: -40,
        left: "50%",
        transform: "translateX(-50%)",
      };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0, 1, 1, 1, 0],
        scale: [0.8, 1.1, 1, 1, 0.9],
        y: [0, -3, -5, -7, -10],
      }}
      transition={{ duration: 3.5, times: [0, 0.1, 0.3, 0.8, 1] }}
      style={{
        ...style,
        background: "#E8611A",
        color: "#000",
        fontFamily: '"Courier New", monospace',
        fontWeight: "700",
        fontSize: "10px",
        letterSpacing: "2px",
        padding: "4px 12px",
        borderRadius: "2px",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 20,
        boxShadow: "0 0 16px rgba(232,97,26,0.9)",
      }}
    >
      ✓ ANSWER READY
    </motion.div>
  );
}

function VictoryParticles({ active }) {
  if (!active) return null;
  return [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const angle = (i / 8) * Math.PI * 2;
    return (
      <motion.div
        key={i}
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#E8611A",
          pointerEvents: "none",
          marginLeft: -2.5,
          marginTop: -2.5,
          zIndex: 3,
        }}
        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        animate={{
          x: Math.cos(angle) * 52,
          y: Math.sin(angle) * 52,
          opacity: 0,
          scale: 0,
        }}
        transition={{ duration: 0.7, delay: i * 0.04, ease: "easeOut" }}
      />
    );
  });
}

function Sparkles({ active }) {
  if (!active) return null;
  return [
    { x: -50, y: -18, d: 0 },
    { x: 50, y: -22, d: 0.3 },
    { x: -40, y: 20, d: 0.6 },
    { x: 44, y: 16, d: 0.9 },
  ].map((s, i) => (
    <motion.div
      key={i}
      style={{
        position: "absolute",
        left: "50%",
        top: "45%",
        fontSize: "11px",
        pointerEvents: "none",
        color: "#E8611A",
        marginLeft: -5,
        marginTop: -5,
        zIndex: 3,
      }}
      animate={{
        x: [s.x, s.x * 1.1, s.x],
        y: [s.y, s.y - 5, s.y],
        opacity: [0.9, 1, 0.9],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{ duration: 1.4, repeat: Infinity, delay: s.d }}
    >
      ✦
    </motion.div>
  ));
}

function EnergyGlow({ active }) {
  if (!active) return null;
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        boxShadow: "0 0 20px 6px #39ff14, 0 0 50px 16px rgba(57,255,20,0.2)",
        pointerEvents: "none",
        zIndex: 1,
      }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 0.25, repeat: Infinity }}
    />
  );
}

function SteamPuffs({ active }) {
  if (!active) return null;
  return [
    { x: -8, d: 0 },
    { x: 8, d: 0.4 },
  ].map((s, i) => (
    <motion.div
      key={i}
      style={{
        position: "absolute",
        top: "20%",
        left: `calc(50% + ${s.x}px)`,
        fontSize: "14px",
        pointerEvents: "none",
        zIndex: 3,
      }}
      animate={{ y: [0, -14, -28], opacity: [1, 0.5, 0], scale: [0.5, 1, 1.5] }}
      transition={{ duration: 1.2, repeat: Infinity, delay: s.d }}
    >
      💨
    </motion.div>
  ));
}

function Tears({ active }) {
  if (!active) return null;
  return [
    { x: -14, d: 0 },
    { x: 14, d: 0.5 },
  ].map((t, i) => (
    <motion.div
      key={i}
      style={{
        position: "absolute",
        top: "55%",
        left: `calc(50% + ${t.x}px)`,
        fontSize: "10px",
        pointerEvents: "none",
        zIndex: 3,
      }}
      animate={{ y: [0, 14, 28], opacity: [1, 0.6, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, delay: t.d }}
    >
      💧
    </motion.div>
  ));
}

function EnergyCan({ active }) {
  if (!active) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: [-3, 3, -3] }}
      transition={{
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        rotate: { duration: 0.4, repeat: Infinity },
      }}
      style={{
        position: "absolute",
        top: "8%",
        right: "-8px",
        fontSize: "18px",
        zIndex: 5,
        pointerEvents: "none",
      }}
    >
      🥤
    </motion.div>
  );
}

export default function Buddy({
  buddyState,
  prevState,
  isTransitioning,
  usage,
  isThinking = false,
  isEating = false,
  justFinished = false,
  onDreamReady,
}) {
  const [speechKey, setSpeechKey] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [showSavor, setShowSavor] = useState(false);
  const [dream, setDream] = useState(null);
  const [isNightmare, setIsNightmare] = useState(false);
  const [isNightmareAwake, setIsNightmareAwake] = useState(false);
  const [showNightmareFlash, setShowNightmareFlash] = useState(false);

  const prevFinished = useRef(false);
  const prevEating = useRef(false);
  const dreamTimer = useRef(null);
  const dreamInitial = useRef(null);
  const isEnergy = buddyState === STATES.ENERGY_DRINK;
  const isSleeping = buddyState === STATES.SLEEPING;

  const triggerDream = useCallback(() => {
    const { type, text } = pickDreamOrNightmare();

    if (type === "nightmare") {
      // Show nightmare bubble
      setIsNightmare(true);
      setDream(text);

      // After 2s — nightmare bubble fades, buddy wakes up scared
      setTimeout(() => {
        setDream(null);
        setIsNightmare(false);
        setIsNightmareAwake(true);
        setShowNightmareFlash(true);

        // Flash fades after 1s
        setTimeout(() => setShowNightmareFlash(false), 1000);

        // Buddy calms down and falls back asleep after 10s
        setTimeout(() => {
          setIsNightmareAwake(false);
        }, 10000);
      }, 2200);
    } else {
      // Normal dream
      setIsNightmare(false);
      setDream(text);
      setTimeout(() => setDream(null), 4500);
    }
  }, []);

  useEffect(() => {
    if (onDreamReady) onDreamReady(triggerDream);
  }, [onDreamReady, triggerDream]);

  useEffect(() => {
    if (justFinished && !prevFinished.current) {
      setShowVictory(true);
      setTimeout(() => setShowVictory(false), 800);
    }
    prevFinished.current = justFinished;
  }, [justFinished]);

  useEffect(() => {
    if (prevEating.current && !isEating) {
      setShowSavor(true);
      setTimeout(() => setShowSavor(false), 1200);
    }
    prevEating.current = isEating;
  }, [isEating]);

  useEffect(() => {
    if (!isSleeping) {
      if (dreamTimer.current) clearInterval(dreamTimer.current);
      if (dreamInitial.current) clearTimeout(dreamInitial.current);
      setDream(null);
      setIsNightmareAwake(false);
      setIsNightmare(false);
      return;
    }
    dreamInitial.current = setTimeout(triggerDream, 3000);
    dreamTimer.current = setInterval(triggerDream, 10 * 60 * 1000);
    return () => {
      clearTimeout(dreamInitial.current);
      clearInterval(dreamTimer.current);
      setDream(null);
      setIsNightmareAwake(false);
    };
  }, [isSleeping, triggerDream]);

  const victoryAnim = showVictory
    ? {
        y: [0, -20, -6, -16, -4, -12, 0],
        scale: [1, 1.1, 0.96, 1.06, 0.98, 1.03, 1],
        transition: { duration: 0.8, ease: "easeInOut" },
      }
    : getAnimation(buddyState, isThinking, isEating, isNightmareAwake);

  const isAngry = [STATES.ANGRY_1, STATES.ANGRY_2, STATES.TANTRUM].includes(
    buddyState,
  );
  const isBegging = buddyState === STATES.BEGGING;
  const isHappy = buddyState === STATES.HAPPY;
  const transAnims =
    isTransitioning && prevState
      ? getTransitionAnims(prevState, buddyState)
      : null;

  // During nightmare wakeup, show scared eyes by passing a special state
  const spriteState = isNightmareAwake ? STATES.DESPERATE : buddyState;

  return (
    <div
      onClick={() => setSpeechKey((k) => k + 1)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "200px",
        height: isElectron ? "120px" : "180px",
        cursor: "pointer",
        paddingTop: isElectron ? "10px" : "0px",
        overflow: "visible",
      }}
    >
      <AnimatePresence>
        {isThinking && !isEating && (
          <ThinkingBubble active={isThinking} isEnergy={isEnergy} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {justFinished && !isThinking && <DoneBanner active={justFinished} />}
      </AnimatePresence>

      {/* Nightmare wakeup effects */}
      <NightmareScream active={isNightmareAwake} />
      <NightmareFlash active={showNightmareFlash} />
      <SweatDrops active={isNightmareAwake} />
      <NightmareExclaim active={isNightmareAwake} />

      {/* Dream bubble */}
      <DreamBubble dream={dream} isNightmare={isNightmare} />

      <EatingToken active={isEating} />
      <NomBurst active={isEating} />
      <SavorGlow active={showSavor} />
      <EnergyGlow active={isEnergy && !isEating} />
      <SteamPuffs active={isAngry} />
      <Tears active={isBegging} />
      <Sparkles active={isHappy} />
      <ThinkingOrbs active={isThinking && !isEating} isEnergy={isEnergy} />
      <EnergyCan active={isEnergy} />

      <AnimatePresence>
        {showVictory && <VictoryParticles active={showVictory} />}
      </AnimatePresence>

      <AnimatePresence>
        {isTransitioning && prevState && transAnims && (
          <motion.div
            key={`exit-${prevState}-${buddyState}`}
            initial={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
              scaleX: 1,
              scaleY: 1,
              filter: "blur(0px)",
            }}
            animate={transAnims.exit}
            style={{ position: "absolute", zIndex: 2 }}
          >
            <BuddySprite
              state={prevState}
              isThinking={false}
              isEating={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`enter-${buddyState}-${isTransitioning}`}
          initial={transAnims ? transAnims.enter.initial : { opacity: 1 }}
          animate={transAnims ? transAnims.enter.animate : victoryAnim}
          transition={transAnims ? transAnims.enter.transition : undefined}
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BuddySprite
            state={spriteState}
            isThinking={isThinking && !isEating}
            isEating={isEating}
          />
        </motion.div>
      </AnimatePresence>

      <SpeechBubble
        state={buddyState}
        triggerKey={speechKey}
        isThinking={isThinking}
      />
      <StatusOverlay
        usage={usage}
        buddyState={buddyState}
        isThinking={isThinking}
      />
    </div>
  );
}
