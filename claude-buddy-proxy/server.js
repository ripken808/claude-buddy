const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let state = {
  sessionTokens: 0,
  weekTokens: 0,
  sessionPct: 0,
  weeklyPct: 0,
  extraPct: 0,
  resetsAt: null,
  lastUsedAt: null,
  updatedAt: null,
  isThinking: false,
  thinkingSince: null,
};

// Claude Buddy app polls this every second
app.get("/usage", (req, res) => {
  res.json(state);
});

// Extension posts real usage percentages here
app.post("/track-percent", (req, res) => {
  const { sessionPct, weeklyPct, extraPct, resetsAt } = req.body;
  if (sessionPct != null) {
    state.sessionPct = sessionPct;
    state.weeklyPct = weeklyPct ?? state.weeklyPct;
    state.extraPct = extraPct ?? state.extraPct;
    state.resetsAt = resetsAt ?? state.resetsAt;
    state.sessionTokens = Math.round((sessionPct / 100) * 50000);
    state.weekTokens = Math.round(((weeklyPct ?? 0) / 100) * 500000);
    state.lastUsedAt = new Date().toISOString();
    state.updatedAt = new Date().toISOString();
    console.log(
      `[usage] session=${sessionPct}% week=${weeklyPct}% extra=${extraPct}%`,
    );
  }
  res.json({ ok: true });
});

// Extension posts thinking state here
app.post("/thinking", (req, res) => {
  const { isThinking } = req.body;
  state.isThinking = !!isThinking;
  state.thinkingSince = isThinking ? new Date().toISOString() : null;
  state.updatedAt = new Date().toISOString();
  if (isThinking) state.lastUsedAt = new Date().toISOString();
  console.log(`[thinking] ${isThinking ? "🎯 START" : "✅ DONE"}`);
  res.json({ ok: true });
});

// Legacy token tracking
app.post("/track", (req, res) => {
  const { tokens } = req.body;
  if (typeof tokens === "number" && tokens > 0) {
    state.sessionTokens += tokens;
    state.weekTokens += tokens;
    state.lastUsedAt = new Date().toISOString();
    state.updatedAt = new Date().toISOString();
    console.log(`[+] ${tokens} tokens | session: ${state.sessionTokens}`);
  }
  res.json({ ok: true, state });
});

app.post("/reset", (req, res) => {
  state.sessionTokens = 0;
  state.sessionPct = 0;
  state.lastUsedAt = null;
  res.json({ ok: true });
});

const PORT = 7821;
app.listen(PORT, () => {
  console.log(`Claude Buddy proxy running on http://localhost:${PORT}`);
});
