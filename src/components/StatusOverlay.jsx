// Intentionally empty in Electron mode — App.jsx handles status display
import { getSessionPercent } from "../utils/tokenTracker";
import { getStateMoodColor } from "../utils/stateEngine";

const isElectron = typeof window !== "undefined" && !!window.electronAPI;

export default function StatusOverlay({ usage, buddyState, isThinking }) {
  // In Electron mode, App.jsx renders the status bar directly
  if (isElectron) return null;

  const pct = getSessionPercent(usage);
  const color = getStateMoodColor(buddyState);
  const barPct = Math.min(
    usage.sessionPct != null ? usage.sessionPct : pct * 100,
    100,
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: -72,
        left: "50%",
        transform: "translateX(-50%)",
        width: "160px",
        textAlign: "center",
        pointerEvents: "none",
        fontFamily: '"Courier New", monospace',
      }}
    >
      <div
        style={{
          color: isThinking ? "#E8611A" : color,
          fontSize: "10px",
          fontWeight: "700",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "5px",
          textShadow: `0 0 8px ${isThinking ? "#E8611A" : color}`,
        }}
      >
        {isThinking ? "THINKING" : buddyState.replace("_", " ")}
      </div>

      <div
        style={{
          width: "100%",
          height: "8px",
          background: "#1A1A1A",
          border: "1px solid #333",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${barPct}%`,
            height: "100%",
            background: isThinking ? "#E8611A" : color,
            boxShadow: `0 0 8px ${isThinking ? "#E8611A" : color}`,
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
              background: "#333",
            }}
          />
        ))}
      </div>

      <div
        style={{
          color: "rgba(232,97,26,0.5)",
          fontSize: "9px",
          marginTop: "4px",
          letterSpacing: "1px",
        }}
      >
        {usage.sessionPct != null
          ? `${usage.sessionPct}% · ${usage.weeklyPct}% wk`
          : `${(usage.sessionTokens || 0).toLocaleString()} / 50,000 tkn`}
      </div>
    </div>
  );
}
