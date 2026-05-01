const SESSION_LIMIT = 50000;
const WEEK_LIMIT = 500000;
const STORAGE_KEY = "claude_buddy_usage";
const PROXY_URL = "http://localhost:7821/usage";

function getDefaultUsage() {
  return {
    sessionTokens: 0,
    weekTokens: 0,
    lastUsedAt: null,
    history: [],
    isThinking: false,
    sessionPct: null,
    weeklyPct: null,
    extraPct: null,
    dataUpdatedAt: null,
  };
}

export function loadUsage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultUsage();
    return { ...getDefaultUsage(), ...JSON.parse(raw) };
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
  // If data is older than 10 minutes, treat extraPct as 0
  // Prevents stale energy drink state when extension isn't running
  const dataAge = usage.dataUpdatedAt
    ? (Date.now() - new Date(usage.dataUpdatedAt)) / 1000 / 60
    : 999;
  const freshData = dataAge < 10;

  return {
    sessionTokens: usage.sessionTokens || 0,
    sessionLimit: SESSION_LIMIT,
    weekTokens: usage.weekTokens || 0,
    weekLimit: WEEK_LIMIT,
    hoursSinceLastUse: getHoursSinceLastUse(usage),
    sessionPct: usage.sessionPct ?? null,
    weeklyPct: usage.weeklyPct ?? null,
    // Only use extraPct if data was recently updated by extension
    extraPct: freshData ? (usage.extraPct ?? null) : null,
  };
}

export function getSessionPercent(usage) {
  return Math.min((usage.sessionTokens || 0) / SESSION_LIMIT, 1);
}

export async function fetchRealUsage() {
  try {
    const res = await fetch(PROXY_URL, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      if (data.sessionTokens != null || data.sessionPct != null) {
        const usage = loadUsage();
        usage.sessionTokens = data.sessionTokens ?? usage.sessionTokens;
        usage.weekTokens = data.weekTokens ?? usage.weekTokens;
        usage.sessionPct = data.sessionPct ?? null;
        usage.weeklyPct = data.weeklyPct ?? null;
        usage.extraPct = data.extraPct ?? null;
        usage.isThinking = data.isThinking ?? false;
        usage.dataUpdatedAt = new Date().toISOString();

        // Update lastUsedAt — prevents hunger states firing during active sessions
        if (data.lastUsedAt) {
          usage.lastUsedAt = data.lastUsedAt;
        } else if ((usage.sessionPct ?? 0) > 0 && !usage.lastUsedAt) {
          usage.lastUsedAt = new Date().toISOString();
        }

        saveUsage(usage);
        return usage;
      }
    }
  } catch {}

  const usage = loadUsage();
  if (usage.sessionPct != null || usage.sessionTokens > 0) return usage;
  return null;
}
