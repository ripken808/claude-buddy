import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Buddy from "./components/Buddy";
import { useTokenState } from "./hooks/useTokenState";
import { resetSession, saveUsage, loadUsage } from "./utils/tokenTracker";
import { STATES, getStateMoodColor } from "./utils/stateEngine";

const isElectron = typeof window !== "undefined" && !!window.electronAPI;

function setHoursAgo(hours) {
  const usage = loadUsage();
  const d = new Date();
  d.setHours(d.getHours() - hours);
  usage.lastUsedAt = d.toISOString();
  saveUsage(usage);
}

const STATE_LIST = Object.values(STATES);

function ElectronApp({
  usage,
  buddyState,
  prevState,
  isTransitioning,
  isConnected,
  isThinking,
  isEating,
  justFinished,
  accentColor,
}) {
  if (window.electronAPI) {
    window.electronAPI.stateChanged(buddyState);
    if (buddyState === STATES.TANTRUM) window.electronAPI.shakeWindow();
  }
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "2px",
        fontFamily: '"Courier New", monospace',
        WebkitAppRegion: "drag",
        userSelect: "none",
      }}
    >
      <div style={{ WebkitAppRegion: "no-drag" }}>
        <Buddy
          buddyState={buddyState}
          prevState={prevState}
          isTransitioning={isTransitioning}
          usage={usage}
          isThinking={isThinking}
          isEating={isEating}
          justFinished={justFinished}
        />
      </div>
      <div
        style={{
          color: isThinking ? "#E8611A" : accentColor,
          fontSize: "10px",
          fontWeight: "700",
          letterSpacing: "2px",
          textTransform: "uppercase",
          textShadow: `0 0 8px ${isThinking ? "#E8611A" : accentColor}`,
          marginTop: "-8px",
          WebkitAppRegion: "no-drag",
        }}
      >
        {isEating
          ? "> nom nom..."
          : isThinking
            ? "⟳ THINKING"
            : buddyState.replace("_", " ")}
      </div>
      <div
        style={{ width: "140px", marginTop: "6px", WebkitAppRegion: "no-drag" }}
      >
        <div
          style={{
            width: "100%",
            height: "6px",
            background: "rgba(26,26,26,0.9)",
            border: "1px solid #333",
            position: "relative",
            overflow: "hidden",
            borderRadius: "1px",
          }}
        >
          <div
            style={{
              width: `${usage.sessionPct ?? Math.min(((usage.sessionTokens || 0) / 50000) * 100, 100)}%`,
              height: "100%",
              background: isThinking ? "#E8611A" : accentColor,
              boxShadow: `0 0 6px ${isThinking ? "#E8611A" : accentColor}`,
              transition: "width 0.6s ease, background 0.6s ease",
            }}
          />
          {[25, 50, 75].map((t) => (
            <div
              key={t}
              style={{
                position: "absolute",
                left: `${t}%`,
                top: 0,
                width: "1px",
                height: "100%",
                background: "#444",
              }}
            />
          ))}
        </div>
        <div
          style={{
            color: "rgba(232,97,26,0.55)",
            fontSize: "9px",
            marginTop: "3px",
            letterSpacing: "1px",
            textAlign: "center",
          }}
        >
          {usage.sessionPct != null
            ? `${usage.sessionPct}% · ${usage.weeklyPct}% wk`
            : `${(usage.sessionTokens || 0).toLocaleString()} tkn`}
        </div>
      </div>
    </div>
  );
}

function BrowserApp({
  usage,
  buddyState,
  prevState,
  isTransitioning,
  refresh,
  isConnected,
  isThinking,
  isEating,
  justFinished,
  accentColor,
  devLocked,
  forceState,
  forceEat,
}) {
  const [showDev, setShowDev] = useState(false);
  const dreamTriggerRef = useRef(null);

  const handleDreamReady = useCallback((fn) => {
    dreamTriggerRef.current = fn;
  }, []);

  function handleReset() {
    resetSession();
    refresh();
  }

  function triggerTestDream() {
    if (dreamTriggerRef.current) {
      dreamTriggerRef.current();
    } else {
      // Fallback: force sleeping state first
      forceState("SLEEPING");
      setTimeout(() => {
        if (dreamTriggerRef.current) dreamTriggerRef.current();
      }, 500);
    }
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
        fontFamily: '"Courier New", monospace',
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `linear-gradient(rgba(232,97,26,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,97,26,0.04) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
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

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: "40px", zIndex: 2 }}
      >
        <div
          style={{
            color: "#E8611A",
            fontSize: "11px",
            letterSpacing: "2px",
            marginBottom: "6px",
            opacity: 0.6,
          }}
        >
          {">"} claude buddy v0.2.0
        </div>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            letterSpacing: "6px",
            color: "#E8611A",
            textShadow: "0 0 30px rgba(232,97,26,0.5)",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          CLAUDE BUDDY
        </h1>
        <div
          style={{
            color: "rgba(232,97,26,0.4)",
            fontSize: "10px",
            letterSpacing: "3px",
            marginTop: "4px",
          }}
        >
          feed it or suffer the consequences
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.1 }}
        style={{
          position: "relative",
          zIndex: 2,
          marginBottom: "80px",
          padding: "28px",
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
            boxShadow: `inset 0 0 50px ${accentColor}11`,
            pointerEvents: "none",
            transition: "box-shadow 1s ease",
          }}
        />
        <Buddy
          buddyState={buddyState}
          prevState={prevState}
          isTransitioning={isTransitioning}
          usage={usage}
          isThinking={isThinking}
          isEating={isEating}
          justFinished={justFinished}
          onDreamReady={handleDreamReady}
        />
      </motion.div>

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
          fontSize: "10px",
          letterSpacing: "2px",
          fontFamily: "inherit",
          zIndex: 10,
        }}
      >
        {showDev ? "[HIDE DEV]" : "[DEV]"}
      </button>

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
              padding: "12px 20px",
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "#E8611A",
                opacity: 0.6,
                letterSpacing: "2px",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <span>{">"} DEV</span>
              <span style={{ color: accentColor }}>{buddyState}</span>
              <span style={{ color: isConnected ? "#39FF14" : "#FF4444" }}>
                {isConnected ? "● LIVE" : "○ offline"}
              </span>
              <span
                style={{
                  color: isThinking ? "#FFB800" : "rgba(255,255,255,0.2)",
                }}
              >
                {isThinking ? "⟳ THINKING" : isEating ? "🍽 EATING" : "○"}
              </span>
              {usage.sessionPct != null && (
                <span style={{ color: "rgba(255,255,255,0.3)" }}>
                  {usage.sessionPct}% · {usage.weeklyPct}% wk{" "}
                  {usage.extraPct > 0 ? `· extra ${usage.extraPct}%` : ""}
                </span>
              )}
              {devLocked && (
                <span
                  style={{
                    color: "#FFB800",
                    background: "rgba(255,184,0,0.1)",
                    border: "1px solid #FFB80044",
                    borderRadius: "2px",
                    padding: "1px 6px",
                    fontSize: "9px",
                  }}
                >
                  🔒 LOCKED 8s
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                marginBottom: "8px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Btn onClick={forceEat} accent>
                🪙 eat
              </Btn>
              <Btn
                onClick={triggerTestDream}
                style={{
                  background: "rgba(140,120,255,0.15)",
                  border: "1px solid rgba(140,120,255,0.4)",
                  color: "#C4B8FF",
                }}
              >
                💭 dream
              </Btn>
              <Btn onClick={handleReset} danger>
                reset
              </Btn>
              <span
                style={{
                  color: "rgba(255,255,255,0.15)",
                  fontSize: "10px",
                  margin: "0 4px",
                }}
              >
                last-used:
              </span>
              {[2, 4, 6, 12, 24, 48, 72, 120, 168].map((h) => (
                <Btn
                  key={h}
                  onClick={() => {
                    setHoursAgo(h);
                    refresh();
                  }}
                >
                  {h}h
                </Btn>
              ))}
            </div>

            {/* State buttons */}
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {STATE_LIST.map((s) => (
                <Btn
                  key={s}
                  onClick={() => forceState(s)}
                  active={buddyState === s}
                >
                  {s}
                </Btn>
              ))}
            </div>
            <div
              style={{
                fontSize: "9px",
                color: "rgba(255,255,255,0.2)",
                marginTop: "6px",
                letterSpacing: "1px",
              }}
            >
              state buttons lock 8s · 💭 dream works anytime · sleeping
              auto-dreams after 3s
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const {
    usage,
    buddyState,
    prevState,
    isTransitioning,
    refresh,
    isConnected,
    isThinking,
    isEating,
    justFinished,
    devLocked,
    forceState,
    forceEat,
  } = useTokenState();
  const accentColor = getStateMoodColor(buddyState);

  if (isElectron) {
    return (
      <ElectronApp
        usage={usage}
        buddyState={buddyState}
        prevState={prevState}
        isTransitioning={isTransitioning}
        isConnected={isConnected}
        isThinking={isThinking}
        isEating={isEating}
        justFinished={justFinished}
        accentColor={accentColor}
      />
    );
  }
  return (
    <BrowserApp
      usage={usage}
      buddyState={buddyState}
      prevState={prevState}
      isTransitioning={isTransitioning}
      refresh={refresh}
      isConnected={isConnected}
      isThinking={isThinking}
      isEating={isEating}
      justFinished={justFinished}
      accentColor={accentColor}
      devLocked={devLocked}
      forceState={forceState}
      forceEat={forceEat}
    />
  );
}

function Btn({ children, onClick, accent, danger, active, style: extraStyle }) {
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
        padding: "2px 7px",
        cursor: "pointer",
        fontSize: "9px",
        letterSpacing: "0.5px",
        fontFamily: '"Courier New", monospace',
        fontWeight: "700",
        textTransform: "uppercase",
        ...extraStyle,
      }}
    >
      {children}
    </button>
  );
}
