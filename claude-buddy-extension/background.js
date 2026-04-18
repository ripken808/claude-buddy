/**
 * background.js
 * Service worker — handles all fetch to localhost
 * since content scripts can't hit localhost directly.
 */

const PROXY = "http://localhost:7821/track-percent";

// Listen for usage data from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SEND_USAGE") {
    fetch(PROXY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg.payload),
    })
      .then((r) => r.json())
      .then((d) => {
        console.log("[Claude Buddy] proxy response:", d);
        sendResponse({ ok: true });
      })
      .catch((err) => {
        console.warn("[Claude Buddy] proxy unreachable:", err.message);
        sendResponse({ ok: false });
      });

    return true; // keep channel open for async response
  }
});

// Periodically ping the usage API directly using cookies from the tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url?.includes("claude.ai")) {
    chrome.tabs.sendMessage(tabId, { type: "POLL_NOW" }).catch(() => {});
  }
});
