import { useState } from "react";
import { motion } from "framer-motion";
import BuddyCanvas from "./BuddyCanvas";
import { MODELS, COLOR_PALETTES, EYE_STYLES } from "../utils/models";
import { STATES } from "../utils/stateEngine";

const STORAGE_KEY = "claude_buddy_prefs";

export const DEFAULT_PREFS = {
  modelId: "classic",
  colorId: "orange",
  eyeStyle: "arrows",
  size: 120,
  opacity: 100,
  position: "top-right",
  showStatus: true,
  showBubbles: true,
};

export function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePrefs(prefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

const STATE_LIST = Object.values(STATES);

export default function SettingsApp() {
  const [prefs, setPrefs] = useState(loadPrefs);
  const [previewState, setPreviewState] = useState("IDLE");
  const [saved, setSaved] = useState(false);

  function update(key, val) {
    setPrefs((p) => ({ ...p, [key]: val }));
  }

  function handleSave() {
    savePrefs(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setPrefs(DEFAULT_PREFS);
    savePrefs(DEFAULT_PREFS);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#fff",
        fontFamily: '"Courier New", monospace',
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(232,97,26,0.2)",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              color: "#E8611A",
              fontSize: "10px",
              letterSpacing: "2px",
              opacity: 0.6,
            }}
          >
            {">"} claude buddy
          </div>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "700",
              letterSpacing: "3px",
              color: "#E8611A",
              margin: 0,
            }}
          >
            CUSTOMIZE
          </h1>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Btn onClick={handleReset} secondary>
            Reset
          </Btn>
          <Btn onClick={handleSave} accent>
            {saved ? "✓ Saved!" : "Save"}
          </Btn>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left — live preview */}
        <div
          style={{
            width: "260px",
            borderRight: "1px solid rgba(232,97,26,0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "24px 16px",
            background: "#0A0A0A",
            flexShrink: 0,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              width: "180px",
              height: "180px",
              background: "#111",
              borderRadius: "12px",
              border: "1px solid rgba(232,97,26,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <BuddyCanvas
              modelId={prefs.modelId}
              colorId={prefs.colorId}
              eyeStyle={prefs.eyeStyle}
              state={previewState}
              size={130}
            />
          </div>

          <div
            style={{
              fontSize: "10px",
              color: "rgba(232,97,26,0.5)",
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            PREVIEW STATE
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4px",
              width: "100%",
            }}
          >
            {STATE_LIST.map((s) => (
              <button
                key={s}
                onClick={() => setPreviewState(s)}
                style={{
                  background:
                    previewState === s ? "#E8611A" : "rgba(232,97,26,0.08)",
                  border: `1px solid ${previewState === s ? "#E8611A" : "rgba(232,97,26,0.2)"}`,
                  color: previewState === s ? "#000" : "rgba(255,255,255,0.5)",
                  borderRadius: "4px",
                  padding: "4px 6px",
                  cursor: "pointer",
                  fontSize: "9px",
                  letterSpacing: "0.5px",
                  fontFamily: "inherit",
                  fontWeight: "700",
                  textTransform: "uppercase",
                }}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Right — settings */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <Section title="BUDDY MODEL">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              {Object.values(MODELS).map((m) => (
                <motion.button
                  key={m.id}
                  onClick={() => update("modelId", m.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background:
                      prefs.modelId === m.id
                        ? "rgba(232,97,26,0.12)"
                        : "rgba(255,255,255,0.03)",
                    border: `${prefs.modelId === m.id ? "2px" : "1px"} solid ${prefs.modelId === m.id ? "#E8611A" : "rgba(232,97,26,0.15)"}`,
                    borderRadius: "10px",
                    padding: "12px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    color:
                      prefs.modelId === m.id
                        ? "#E8611A"
                        : "rgba(255,255,255,0.6)",
                  }}
                >
                  <BuddyCanvas
                    modelId={m.id}
                    colorId={prefs.colorId}
                    eyeStyle={prefs.eyeStyle}
                    state="IDLE"
                    size={72}
                  />
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      letterSpacing: "1px",
                    }}
                  >
                    {m.name.toUpperCase()}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      opacity: 0.6,
                      lineHeight: 1.3,
                      textAlign: "center",
                    }}
                  >
                    {m.desc}
                  </div>
                </motion.button>
              ))}
            </div>
          </Section>

          <Section title="COLOR">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px",
              }}
            >
              {COLOR_PALETTES.map((col) => (
                <button
                  key={col.id}
                  onClick={() => update("colorId", col.id)}
                  style={{
                    background:
                      prefs.colorId === col.id
                        ? "rgba(232,97,26,0.1)"
                        : "transparent",
                    border: `${prefs.colorId === col.id ? "2px" : "1px"} solid ${prefs.colorId === col.id ? "#E8611A" : "rgba(232,97,26,0.15)"}`,
                    borderRadius: "8px",
                    padding: "10px 8px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: col.body,
                      border: `2px solid ${col.dark}`,
                      boxShadow:
                        prefs.colorId === col.id
                          ? `0 0 10px ${col.body}88`
                          : "none",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "9px",
                      fontWeight: "700",
                      letterSpacing: "1px",
                      color:
                        prefs.colorId === col.id
                          ? "#E8611A"
                          : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {col.name.toUpperCase()}
                  </div>
                </button>
              ))}
            </div>
          </Section>

          <Section title="EYE STYLE">
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {EYE_STYLES.map((e) => (
                <button
                  key={e.id}
                  onClick={() => update("eyeStyle", e.id)}
                  style={{
                    background:
                      prefs.eyeStyle === e.id
                        ? "#E8611A"
                        : "rgba(232,97,26,0.08)",
                    border: `1px solid ${prefs.eyeStyle === e.id ? "#E8611A" : "rgba(232,97,26,0.2)"}`,
                    color: prefs.eyeStyle === e.id ? "#000" : "#E8611A",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontFamily: "monospace",
                    fontWeight: "700",
                    letterSpacing: "2px",
                    minWidth: "80px",
                  }}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </Section>

          <Section title="SIZE & APPEARANCE">
            <SliderRow
              label="Size"
              min={60}
              max={200}
              value={prefs.size}
              display={`${prefs.size}px`}
              onChange={(v) => update("size", v)}
            />
            <SliderRow
              label="Opacity"
              min={30}
              max={100}
              value={prefs.opacity}
              display={`${prefs.opacity}%`}
              onChange={(v) => update("opacity", v)}
            />
          </Section>

          <Section title="SCREEN POSITION">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                maxWidth: "300px",
              }}
            >
              {[
                { id: "top-left", label: "↖ Top Left" },
                { id: "top-right", label: "↗ Top Right" },
                { id: "bottom-left", label: "↙ Bottom Left" },
                { id: "bottom-right", label: "↘ Bottom Right" },
              ].map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => update("position", pos.id)}
                  style={{
                    background:
                      prefs.position === pos.id
                        ? "#E8611A"
                        : "rgba(232,97,26,0.08)",
                    border: `1px solid ${prefs.position === pos.id ? "#E8611A" : "rgba(232,97,26,0.2)"}`,
                    color:
                      prefs.position === pos.id
                        ? "#000"
                        : "rgba(255,255,255,0.6)",
                    borderRadius: "6px",
                    padding: "10px",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontFamily: "inherit",
                    fontWeight: "700",
                    letterSpacing: "1px",
                  }}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </Section>

          <Section title="OPTIONS">
            <Toggle
              label="Show status bar"
              desc="Session %, weekly %, LIVE indicator"
              value={prefs.showStatus}
              onChange={(v) => update("showStatus", v)}
            />
            <Toggle
              label="Show speech bubbles"
              desc="Buddy talks when you click it"
              value={prefs.showBubbles}
              onChange={(v) => update("showBubbles", v)}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <div
        style={{
          fontSize: "10px",
          color: "#E8611A",
          letterSpacing: "2px",
          opacity: 0.6,
          marginBottom: "12px",
          fontWeight: "700",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function SliderRow({ label, min, max, value, display, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.5)",
          width: "64px",
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ flex: 1 }}
      />
      <div
        style={{
          fontSize: "11px",
          color: "#E8611A",
          width: "48px",
          textAlign: "right",
          fontWeight: "700",
        }}
      >
        {display}
      </div>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid rgba(232,97,26,0.08)",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.8)",
            fontWeight: "700",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.3)",
            marginTop: "2px",
          }}
        >
          {desc}
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: "44px",
          height: "24px",
          borderRadius: "12px",
          background: value ? "#E8611A" : "rgba(255,255,255,0.1)",
          border: "none",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "white",
            position: "absolute",
            top: "3px",
            left: value ? "23px" : "3px",
            transition: "left 0.2s",
          }}
        />
      </button>
    </div>
  );
}

function Btn({ children, onClick, accent, secondary }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: accent
          ? "#E8611A"
          : secondary
            ? "rgba(255,255,255,0.05)"
            : "transparent",
        border: `1px solid ${accent ? "#E8611A" : "rgba(232,97,26,0.3)"}`,
        color: accent ? "#000" : "#E8611A",
        borderRadius: "4px",
        padding: "6px 14px",
        cursor: "pointer",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "1px",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}
