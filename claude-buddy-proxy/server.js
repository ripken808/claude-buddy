const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

let state = {
  sessionPct: 0,
  weeklyPct: 0,
  extraPct: 0,
  resetsAt: null,
  lastUsedAt: null,
  updatedAt: null,
};

app.get("/usage", (req, res) => {
  res.json({
    sessionTokens: Math.round((state.sessionPct / 100) * 50000),
    weekTokens: Math.round((state.weeklyPct / 100) * 500000),
    sessionPct: state.sessionPct,
    weeklyPct: state.weeklyPct,
    extraPct: state.extraPct,
    resetsAt: state.resetsAt,
    lastUsedAt: state.lastUsedAt,
    updatedAt: state.updatedAt,
  });
});

app.post("/track-percent", (req, res) => {
  const { sessionPct, weeklyPct, extraPct, resetsAt } = req.body;
  const prev = state.sessionPct;

  if (sessionPct != null) state.sessionPct = sessionPct;
  if (weeklyPct != null) state.weeklyPct = weeklyPct;
  if (extraPct != null) state.extraPct = extraPct;
  if (resetsAt != null) state.resetsAt = resetsAt;

  state.updatedAt = new Date().toISOString();

  // If session % went up, mark as recently active
  if (sessionPct > prev) {
    state.lastUsedAt = new Date().toISOString();
  }

  console.log(
    `[usage] session: ${state.sessionPct}% | weekly: ${state.weeklyPct}% | extra: ${state.extraPct}%`,
  );
  res.json({ ok: true, state });
});

app.post("/reset", (req, res) => {
  state.sessionPct = 0;
  state.lastUsedAt = null;
  console.log("[reset] session cleared");
  res.json({ ok: true });
});

app.listen(7821, () => {
  console.log("Claude Buddy proxy → http://localhost:7821");
});
