/**
 * Buddy.jsx - Fixed centering, removed rotation from animations.
 */

import { motion } from "framer-motion";
import { useState } from "react";
import BuddySprite from "./BuddySprite";
import SpeechBubble from "./SpeechBubble";
import StatusOverlay from "./StatusOverlay";
import { STATES } from "../utils/stateEngine";

function getAnimation(state) {
  switch (state) {
    case STATES.IDLE:
      return {
        y: [0, -6, 0],
        transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.FED:
      return {
        y: [0, -4, 0],
        transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.HAPPY:
      return {
        y: [0, -14, 0],
        scaleY: [1, 1.06, 0.94, 1],
        scaleX: [1, 0.94, 1.06, 1],
        transition: { duration: 0.6, repeat: Infinity },
      };
    case STATES.STUFFED:
      return {
        x: [-3, 3, -3],
        y: [0, -2, 0],
        transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.SLEEPING:
      return {
        scaleY: [1, 1.03, 1],
        y: [0, -2, 0],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.HIBERNATING:
      return {
        scaleY: [1, 1.02, 1],
        transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.ENERGY_DRINK:
      return {
        x: [-3, 3, -2, 2, -3, 3, 0],
        y: [-1, 1, -1, 1, 0],
        transition: { duration: 0.2, repeat: Infinity },
      };
    case STATES.PECKISH:
      return {
        y: [0, -4, 0],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.HUNGRY:
      return {
        y: [0, -5, 0],
        transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.BEGGING:
      return {
        y: [0, -3, 0],
        transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.DESPERATE:
      return {
        opacity: [1, 0.5, 1],
        y: [0, -3, 0],
        transition: { duration: 2, repeat: Infinity },
      };
    case STATES.ANGRY_1:
      return {
        x: [-3, 3, -3],
        transition: { duration: 0.4, repeat: Infinity },
      };
    case STATES.ANGRY_2:
      return {
        x: [-5, 5, -4, 4, 0],
        transition: { duration: 0.3, repeat: Infinity },
      };
    case STATES.TANTRUM:
      // NO rotate — only translate so it stays centered
      return {
        x: [-8, 8, -6, 6, -8, 8, 0],
        y: [0, -4, 4, -4, 0],
        transition: { duration: 0.35, repeat: Infinity },
      };
    case STATES.WITHDRAWN:
      return {
        y: [0, -2, 0],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      };
    case STATES.FERAL:
      return {
        x: [-8, 10, -6, 8, -10, 6, 0],
        y: [-4, 6, -8, 4, -6, 8, 0],
        transition: { duration: 0.4, repeat: Infinity },
      };
    default:
      return { y: [0, -6, 0], transition: { duration: 2, repeat: Infinity } };
  }
}

function Sparkles({ active }) {
  if (!active) return null;
  return [
    { x: -64, y: -24, d: 0 },
    { x: 64, y: -32, d: 0.3 },
    { x: -52, y: 28, d: 0.6 },
    { x: 58, y: 22, d: 0.9 },
  ].map((s, i) => (
    <motion.div
      key={i}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        fontSize: "14px",
        pointerEvents: "none",
        color: "#E8611A",
      }}
      animate={{
        x: [s.x, s.x * 1.1, s.x],
        y: [s.y, s.y - 8, s.y],
        opacity: [0.9, 1, 0.9],
        scale: [0.8, 1.3, 0.8],
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
        inset: "-16px",
        borderRadius: "4px",
        boxShadow: "0 0 24px 8px #39ff14, 0 0 60px 20px rgba(57,255,20,0.25)",
        pointerEvents: "none",
      }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 0.25, repeat: Infinity }}
    />
  );
}

function SteamPuffs({ active }) {
  if (!active) return null;
  return [
    { x: -10, d: 0 },
    { x: 10, d: 0.4 },
  ].map((s, i) => (
    <motion.div
      key={i}
      style={{
        position: "absolute",
        top: "-10px",
        left: `calc(50% + ${s.x}px)`,
        fontSize: "18px",
        pointerEvents: "none",
      }}
      animate={{ y: [0, -20, -40], opacity: [1, 0.5, 0], scale: [0.5, 1, 1.5] }}
      transition={{ duration: 1.2, repeat: Infinity, delay: s.d }}
    >
      💨
    </motion.div>
  ));
}

function Tears({ active }) {
  if (!active) return null;
  return [
    { x: -18, d: 0 },
    { x: 18, d: 0.5 },
  ].map((t, i) => (
    <motion.div
      key={i}
      style={{
        position: "absolute",
        top: "52px",
        left: `calc(50% + ${t.x}px)`,
        fontSize: "12px",
        pointerEvents: "none",
      }}
      animate={{ y: [0, 20, 40], opacity: [1, 0.6, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, delay: t.d }}
    >
      💧
    </motion.div>
  ));
}

export default function Buddy({ buddyState, usage }) {
  const [speechKey, setSpeechKey] = useState(0);
  const anim = getAnimation(buddyState);

  return (
    <div
      onClick={() => setSpeechKey((k) => k + 1)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "260px",
        height: "200px",
        cursor: "pointer",
      }}
    >
      <SpeechBubble state={buddyState} triggerKey={speechKey} />
      <EnergyGlow active={buddyState === STATES.ENERGY_DRINK} />
      <SteamPuffs
        active={[STATES.ANGRY_1, STATES.ANGRY_2, STATES.TANTRUM].includes(
          buddyState,
        )}
      />
      <Tears active={buddyState === STATES.BEGGING} />
      <Sparkles active={buddyState === STATES.HAPPY} />

      <motion.div
        animate={anim}
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // No transform-origin tricks — plain centered div
        }}
      >
        <BuddySprite state={buddyState} />
      </motion.div>

      <StatusOverlay usage={usage} buddyState={buddyState} />
    </div>
  );
}
