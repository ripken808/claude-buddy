const _fetch = window.fetch.bind(window);
const KNOWN_ORG_ID = "697c20d8-96e4-46bd-a2be-745efba88810";

function postToProxy(path, body) {
  fetch(`http://localhost:7821${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}

function writeToStorage(data) {
  try {
    const existing = JSON.parse(
      localStorage.getItem("claude_buddy_usage") || "{}",
    );
    const merged = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("claude_buddy_usage", JSON.stringify(merged));
  } catch {}
}

function safeSend(msg) {
  try {
    if (chrome?.runtime?.id) chrome.runtime.sendMessage(msg).catch(() => {});
  } catch {}
}

// Reset thinking on load
writeToStorage({ isThinking: false });
postToProxy("/thinking", { isThinking: false });

// ── Thinking detection ──────────────────────────────────────
let isCurrentlyThinking = false;
let thinkingStart = null;

function setThinking(val) {
  if (val === isCurrentlyThinking) return;
  isCurrentlyThinking = val;
  thinkingStart = val ? Date.now() : null;
  console.log("[Claude Buddy]", val ? "🎯 THINKING" : "✅ DONE");
  writeToStorage({ isThinking: val });
  postToProxy("/thinking", { isThinking: val });
}

// Auto reset if stuck
setInterval(() => {
  if (
    isCurrentlyThinking &&
    thinkingStart &&
    Date.now() - thinkingStart > 120000
  ) {
    setThinking(false);
  }
}, 5000);

// Enter key
document.addEventListener(
  "keydown",
  (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const el = document.activeElement;
      if (
        el &&
        (el.tagName === "TEXTAREA" ||
          el.getAttribute("contenteditable") === "true" ||
          el.getAttribute("role") === "textbox")
      ) {
        setTimeout(() => setThinking(true), 80);
      }
    }
  },
  true,
);

// Send button
document.addEventListener(
  "click",
  (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const label = (btn.getAttribute("aria-label") || "").toLowerCase();
    const testid = (btn.getAttribute("data-testid") || "").toLowerCase();
    if (label.includes("send") || testid.includes("send")) {
      setTimeout(() => setThinking(true), 80);
    }
  },
  true,
);

// Stream end detection
try {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (
        entry.name.includes("chat_conversations") &&
        entry.name.includes("completion") &&
        entry.duration > 200
      ) {
        setThinking(false);
      }
    }
  }).observe({ entryTypes: ["resource"], buffered: false });
} catch {}

// Stop button poll
setInterval(() => {
  const stop =
    document.querySelector('[data-testid="stop-button"]') ||
    document.querySelector('button[aria-label="Stop"]') ||
    document.querySelector('button[aria-label="Stop response"]');
  if (stop && !isCurrentlyThinking) setThinking(true);
  else if (!stop && isCurrentlyThinking) setThinking(false);
}, 300);

// ── Usage polling ───────────────────────────────────────────
async function pollUsage() {
  // Skip on settings pages — they block the usage API
  if (window.location.href.includes("/settings")) return;

  try {
    if (!chrome?.runtime?.id) return;
  } catch {
    return;
  }

  try {
    const res = await _fetch(`/api/organizations/${KNOWN_ORG_ID}/usage`, {
      credentials: "include",
    });
    if (!res.ok) return;

    const data = await res.json();
    const sessionPct = Math.round(data.five_hour?.utilization ?? 0);
    const weeklyPct = Math.round(data.seven_day?.utilization ?? 0);
    const extraPct = Math.round(data.extra_usage?.utilization ?? 0);
    const resetsAt = data.five_hour?.resets_at ?? null;

    console.log("[Claude Buddy] ✓", { sessionPct, weeklyPct, extraPct });

    const payload = {
      sessionTokens: Math.round((sessionPct / 100) * 50000),
      weekTokens: Math.round((weeklyPct / 100) * 500000),
      sessionPct,
      weeklyPct,
      extraPct,
      resetsAt,
      lastUsedAt: new Date().toISOString(),
    };

    writeToStorage(payload);
    postToProxy("/track-percent", {
      sessionPct,
      weeklyPct,
      extraPct,
      resetsAt,
    });
    safeSend({ type: "SEND_USAGE", payload });
  } catch (e) {
    console.warn("[Claude Buddy] poll error:", e.message);
  }
}

setTimeout(pollUsage, 2000);
setInterval(pollUsage, 60000);

try {
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "POLL_NOW") pollUsage();
  });
} catch {}
