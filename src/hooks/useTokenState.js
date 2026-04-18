import { useState, useEffect, useCallback } from "react";
import {
  loadUsage,
  getTokenState,
  fetchRealUsage,
} from "../utils/tokenTracker";
import { resolveState } from "../utils/stateEngine";

export function useTokenState() {
  const [usage, setUsage] = useState(loadUsage);
  const [buddyState, setBuddyState] = useState("IDLE");
  const [isConnected, setIsConnected] = useState(false);

  const refresh = useCallback(async () => {
    // Try real usage first, fall back to localStorage
    const real = await fetchRealUsage();
    const latest = real ?? loadUsage();
    setIsConnected(!!real);
    setUsage(latest);
    setBuddyState(resolveState(getTokenState(latest)));
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { usage, buddyState, refresh, isConnected };
}
