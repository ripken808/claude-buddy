const SESSION_LIMIT = 50000;
const WEEK_LIMIT = 500000;
const STORAGE_KEY = "claude_buddy_usage";
const PROXY_URL = "http://localhost:7821/usage";

function getDefaultUsage() {
  return { sessionTokens: 0, weekTokens: 0, lastUsedAt: null, history: [] };
}

export function loadUsage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultUsage();
    return JSON.parse(raw);
  } catch {
    return getDefaultUsage();
  }
}

export function saveUsage(usage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
}

export function addTokens(count) {
  const usage = loadUsage();
  usage.sessionTokens = (usage.sessionTokens || 0) + count;
  usage.weekTokens = (usage.weekTokens || 0) + count;
  usage.lastUsedAt = new Date().toISOString();
  saveUsage(usage);
  return usage;
}

export function resetSession() {
  const usage = loadUsage();
  if (usage.sessionTokens > 0) {
    usage.history = usage.history || [];
    usage.history.push({
      date: new Date().toISOString(),
      tokens: usage.sessionTokens,
    });
    if (usage.history.length > 30) usage.history = usage.history.slice(-30);
  }
  usage.sessionTokens = 0;
  saveUsage(usage);
  return usage;
}

export function getHoursSinceLastUse(usage) {
  if (!usage.lastUsedAt) return 999;
  return (Date.now() - new Date(usage.lastUsedAt)) / (1000 * 60 * 60);
}

export function getTokenState(usage) {
  return {
    sessionTokens: usage.sessionTokens || 0,
    sessionLimit: 50000,
    weekTokens: usage.weekTokens || 0,
    weekLimit: 500000,
    hoursSinceLastUse: getHoursSinceLastUse(usage),
    sessionPct: usage.sessionPct ?? null,
    weeklyPct: usage.weeklyPct ?? null,
  };
}

export function getSessionPercent(usage) {
  return Math.min((usage.sessionTokens || 0) / SESSION_LIMIT, 1);
}

export async function fetchRealUsage() {
  try {
    const res = await fetch(PROXY_URL, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return null;
    const data = await res.json();

    if (data.sessionTokens != null) {
      const usage = loadUsage();

      // Only update lastUsedAt from proxy if proxy has a real value
      // Otherwise preserve local lastUsedAt so hunger timer still works
      usage.sessionTokens = data.sessionTokens;
      usage.weekTokens = data.weekTokens ?? usage.weekTokens;
      if (data.lastUsedAt) usage.lastUsedAt = data.lastUsedAt;

      // Store raw percentages for display
      usage.sessionPct = data.sessionPct ?? null;
      usage.weeklyPct = data.weeklyPct ?? null;
      usage.extraPct = data.extraPct ?? null;

      saveUsage(usage);
      return usage;
    }
  } catch {
    // proxy not running — silent fail
  }
  return null;
}
