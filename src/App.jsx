import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Buddy from "./components/Buddy";
import { useTokenState } from "./hooks/useTokenState";
import {
  addTokens,
  resetSession,
  saveUsage,
  loadUsage,
} from "./utils/tokenTracker";
import { STATES, getStateMoodColor } from "./utils/stateEngine";

function setHoursAgo(hours) {
  const usage = loadUsage();
  const d = new Date();
  d.setHours(d.getHours() - hours);
  usage.lastUsedAt = d.toISOString();
  saveUsage(usage);
}

const STATE_LIST = Object.values(STATES);

const TOKEN_MAP = {
  IDLE: { tokens: 0, hours: 0 },
  FED: { tokens: 5000, hours: 0 },
  HAPPY: { tokens: 25000, hours: 0 },
  STUFFED: { tokens: 40000, hours: 0 },
  SLEEPING: { tokens: 48000, hours: 0 },
  ENERGY_DRINK: { tokens: 55000, hours: 0 },
  HIBERNATING: { tokens: 0, hours: 0, weekMax: true },
  PECKISH: { tokens: 0, hours: 2.5 },
  HUNGRY: { tokens: 0, hours: 4.5 },
  BEGGING: { tokens: 0, hours: 7 },
  DESPERATE: { tokens: 0, hours: 13 },
  ANGRY_1: { tokens: 0, hours: 25 },
  ANGRY_2: { tokens: 0, hours: 49 },
  TANTRUM: { tokens: 0, hours: 73 },
  WITHDRAWN: { tokens: 0, hours: 121 },
  FERAL: { tokens: 0, hours: 169 },
};

export default function App() {
  const { usage, buddyState, refresh, isConnected } = useTokenState();
  const [showDev, setShowDev] = useState(true);
  const [tokenInput, setTokenInput] = useState("1000");
  const accentColor = getStateMoodColor(buddyState);

  function handleAddTokens() {
    addTokens(parseInt(tokenInput) || 0);
    refresh();
  }

  function handleReset() {
    resetSession();
    refresh();
  }

  function handleForceState(s) {
    const cfg = TOKEN_MAP[s] || { tokens: 0, hours: 0 };
    const u = loadUsage();
    u.sessionTokens = cfg.tokens;
    u.weekTokens = cfg.weekMax ? 500000 : cfg.tokens;
    const d = new Date();
    if (cfg.hours > 0) d.setHours(d.getHours() - cfg.hours);
    u.lastUsedAt = d.toISOString();
    saveUsage(u);
    refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Courier New", "Courier", monospace',
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scanline overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
        }}
      />

      {/* Orange grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `
          linear-gradient(rgba(232,97,26,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(232,97,26,0.04) 1px, transparent 1px)
        `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Corner brackets */}
      {[
        { top: 16, left: 16, rotate: 0 },
        { top: 16, right: 16, rotate: 90 },
        { bottom: 16, left: 16, rotate: 270 },
        { bottom: 16, right: 16, rotate: 180 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            ...pos,
            width: 24,
            height: 24,
            borderTop: "2px solid rgba(232,97,26,0.4)",
            borderLeft: "2px solid rgba(232,97,26,0.4)",
            transform: `rotate(${pos.rotate}deg)`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: "center",
          marginBottom: "48px",
          zIndex: 2,
          position: "relative",
        }}
      >
        <div
          style={{
            color: "#E8611A",
            fontSize: "13px",
            letterSpacing: "2px",
            marginBottom: "8px",
            opacity: 0.7,
          }}
        >
          {">"} claude buddy v0.1.0
        </div>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            letterSpacing: "6px",
            color: "#E8611A",
            textShadow:
              "0 0 30px rgba(232,97,26,0.5), 0 0 60px rgba(232,97,26,0.2)",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          CLAUDE BUDDY
        </h1>
        <div
          style={{
            color: "rgba(232,97,26,0.5)",
            fontSize: "11px",
            letterSpacing: "3px",
            marginTop: "6px",
          }}
        >
          feed it or suffer the consequences
        </div>
      </motion.div>

      {/* Buddy container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.1 }}
        style={{
          position: "relative",
          zIndex: 2,
          marginBottom: "80px",
          padding: "32px",
          background: "rgba(232,97,26,0.04)",
          border: "1px solid rgba(232,97,26,0.15)",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "4px",
            boxShadow: `inset 0 0 60px ${accentColor}11`,
            pointerEvents: "none",
            transition: "box-shadow 1s ease",
          }}
        />
        <Buddy buddyState={buddyState} usage={usage} />
      </motion.div>

      {/* Dev toggle */}
      <button
        onClick={() => setShowDev((v) => !v)}
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          background: "transparent",
          border: "1px solid rgba(232,97,26,0.4)",
          color: "#E8611A",
          borderRadius: "2px",
          padding: "4px 10px",
          cursor: "pointer",
          fontSize: "11px",
          letterSpacing: "2px",
          fontFamily: "inherit",
          zIndex: 10,
        }}
      >
        {showDev ? "[HIDE DEV]" : "[DEV]"}
      </button>

      {/* Dev panel */}
      <AnimatePresence>
        {showDev && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: "#0D0D0D",
              borderTop: "1px solid rgba(232,97,26,0.3)",
              padding: "14px 20px",
              zIndex: 10,
            }}
          >
            {/* Header row */}
            <div
              style={{
                fontSize: "10px",
                color: "#E8611A",
                opacity: 0.6,
                letterSpacing: "2px",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span>{">"} DEV_CONSOLE</span>
              <span style={{ color: accentColor }}>STATE: {buddyState}</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>
                TOKENS: {(usage.sessionTokens || 0).toLocaleString()}
              </span>
              <span style={{ color: isConnected ? "#39FF14" : "#FF4444" }}>
                {isConnected ? "● LIVE" : "○ DEV MODE"}
              </span>
            </div>

            {/* Token controls */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "10px",
                alignItems: "center",
              }}
            >
              <input
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTokens()}
                style={{
                  background: "#1A1A1A",
                  border: "1px solid #E8611A44",
                  color: "#E8611A",
                  borderRadius: "2px",
                  padding: "4px 10px",
                  width: "90px",
                  fontSize: "12px",
                  fontFamily: "inherit",
                }}
              />
              <Btn onClick={handleAddTokens} accent>
                +tokens
              </Btn>
              <Btn onClick={handleReset} danger>
                reset
              </Btn>
              <span
                style={{
                  color: "rgba(255,255,255,0.15)",
                  fontSize: "10px",
                  marginLeft: "4px",
                }}
              >
                set last-used:
              </span>
              {[2, 4, 6, 12, 24, 48, 72, 120, 168].map((h) => (
                <Btn
                  key={h}
                  onClick={() => {
                    setHoursAgo(h);
                    refresh();
                  }}
                >
                  {h}h ago
                </Btn>
              ))}
            </div>

            {/* State buttons */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {STATE_LIST.map((s) => (
                <Btn
                  key={s}
                  onClick={() => handleForceState(s)}
                  active={buddyState === s}
                >
                  {s}
                </Btn>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Btn({ children, onClick, accent, danger, active }) {
  let bg = "#1A1A1A",
    border = "#333",
    color = "rgba(255,255,255,0.5)";
  if (accent) {
    bg = "#E8611A22";
    border = "#E8611A";
    color = "#E8611A";
  }
  if (danger) {
    bg = "#FF302022";
    border = "#FF3020";
    color = "#FF3020";
  }
  if (active) {
    bg = "#E8611A";
    border = "#E8611A";
    color = "#000";
  }

  return (
    <button
      onClick={onClick}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        color,
        borderRadius: "2px",
        padding: "3px 9px",
        cursor: "pointer",
        fontSize: "10px",
        letterSpacing: "0.5px",
        fontFamily: '"Courier New", monospace',
        fontWeight: "700",
        textTransform: "uppercase",
        transition: "all 0.1s",
      }}
    >
      {children}
    </button>
  );
}
