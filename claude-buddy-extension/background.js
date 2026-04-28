// Keep service worker alive with a periodic alarm
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("keepAlive", { periodInMinutes: 0.4 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "keepAlive") {
    // no-op, just keeps service worker active
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SEND_USAGE") {
    fetch("http://localhost:7821/track-percent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg.payload),
    })
      .then((r) => r.json())
      .then(() => sendResponse({ ok: true }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }
});

// Wake up content scripts on tab navigation
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  sendResponse({ ok: true });
  return true;
});
