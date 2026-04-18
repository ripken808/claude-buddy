const _fetch = window.fetch;
const PRO_ORG_ID = "697c20d8-96e4-46bd-a2be-745efba88810";
const PROXY_URL = "http://localhost:7821/track-percent";

function sendToProxy(payload) {
  console.log("[Claude Buddy] ✓ sending:", payload);
  chrome.runtime.sendMessage({ type: "SEND_USAGE", payload });
}

async function pollUsage() {
  try {
    const res = await _fetch(`/api/organizations/${PRO_ORG_ID}/usage`, {
      credentials: "include",
    });
    if (!res.ok) return;
    const data = await res.json();

    const sessionPct = Math.round(data.five_hour?.utilization ?? 0);
    const weeklyPct = Math.round(data.seven_day?.utilization ?? 0);
    const extraPct = Math.round(data.extra_usage?.utilization ?? 0);
    const resetsAt = data.five_hour?.resets_at ?? null;

    sendToProxy({ sessionPct, weeklyPct, extraPct, resetsAt });
  } catch (e) {
    console.warn("[Claude Buddy] poll failed:", e.message);
  }
}

pollUsage();
setInterval(pollUsage, 20000);

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "POLL_NOW") pollUsage();
});
