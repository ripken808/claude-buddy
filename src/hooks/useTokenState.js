import { useState, useEffect, useCallback, useRef } from "react";
import {
  loadUsage,
  saveUsage,
  getTokenState,
  fetchRealUsage,
} from "../utils/tokenTracker";
import { resolveState } from "../utils/stateEngine";

export function useTokenState() {
  const [usage, setUsage] = useState(loadUsage);
  const [displayState, setDisplayState] = useState("IDLE");
  const [prevState, setPrevState] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [justFinished, setJustFinished] = useState(false);
  const [devLocked, setDevLocked] = useState(false);

  const prevThinkingRef = useRef(false);
  const justFinishedTimerRef = useRef(null);
  const pendingStateRef = useRef(null);
  const pendingTimerRef = useRef(null);
  const eatingTimerRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const currentDisplayRef = useRef("IDLE");
  const isEatingRef = useRef(false);
  const devLockedRef = useRef(false);
  const devLockTimerRef = useRef(null);

  function setIsEatingSync(val) {
    isEatingRef.current = val;
    setIsEating(val);
  }

  function triggerEating(onDone) {
    if (isEatingRef.current) {
      if (onDone) onDone();
      return;
    }
    setIsEatingSync(true);
    if (eatingTimerRef.current) clearTimeout(eatingTimerRef.current);
    eatingTimerRef.current = setTimeout(() => {
      setIsEatingSync(false);
      if (onDone) onDone();
    }, 1500);
  }

  function devLock(ms = 8000) {
    devLockedRef.current = true;
    setDevLocked(true);
    if (devLockTimerRef.current) clearTimeout(devLockTimerRef.current);
    devLockTimerRef.current = setTimeout(() => {
      devLockedRef.current = false;
      setDevLocked(false);
    }, ms);
  }

  function transitionToState(newState) {
    const current = currentDisplayRef.current;
    if (newState === current) return;
    setPrevState(current);
    setIsTransitioning(true);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      currentDisplayRef.current = newState;
      setDisplayState(newState);
      setIsTransitioning(false);
      setPrevState(null);
    }, 400);
  }

  function forceState(newState) {
    devLock();
    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current);
      pendingStateRef.current = null;
      pendingTimerRef.current = null;
    }
    transitionToState(newState);
  }

  function forceEat() {
    devLock();
    triggerEating();
  }

  function applyStateSmooth(newState) {
    if (newState === currentDisplayRef.current) {
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
        pendingStateRef.current = null;
        pendingTimerRef.current = null;
      }
      return;
    }
    if (newState === pendingStateRef.current) return;
    if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    pendingStateRef.current = newState;
    const hungerStates = [
      "PECKISH",
      "HUNGRY",
      "BEGGING",
      "DESPERATE",
      "ANGRY_1",
      "ANGRY_2",
      "TANTRUM",
      "WITHDRAWN",
      "FERAL",
    ];
    const delay = hungerStates.includes(newState) ? 800 : 1500;
    pendingTimerRef.current = setTimeout(() => {
      transitionToState(newState);
      pendingStateRef.current = null;
      pendingTimerRef.current = null;
    }, delay);
  }

  const refresh = useCallback(async () => {
    if (devLockedRef.current) return;
    const real = await fetchRealUsage();
    const latest = real ?? loadUsage();
    const freshData = latest.sessionPct != null || latest.sessionTokens > 0;
    setIsConnected(!!real || freshData);
    setUsage(latest);

    const newState = resolveState(getTokenState(latest));
    applyStateSmooth(newState);

    const currentlyThinking = latest.isThinking ?? false;

    if (prevThinkingRef.current === false && currentlyThinking === true) {
      prevThinkingRef.current = true;
      // Force state IMMEDIATELY before eating so the correct state
      // (especially ENERGY_DRINK) is shown during the eating animation
      if (newState !== currentDisplayRef.current) {
        if (pendingTimerRef.current) {
          clearTimeout(pendingTimerRef.current);
          pendingStateRef.current = null;
          pendingTimerRef.current = null;
        }
        currentDisplayRef.current = newState;
        setDisplayState(newState);
        setIsTransitioning(false);
      }
      triggerEating(() => setIsThinking(true));
      return;
    }

    if (prevThinkingRef.current === true && currentlyThinking === false) {
      prevThinkingRef.current = false;
      setIsThinking(false);
      if (justFinishedTimerRef.current)
        clearTimeout(justFinishedTimerRef.current);
      setJustFinished(true);
      justFinishedTimerRef.current = setTimeout(() => {
        setJustFinished(false);
        justFinishedTimerRef.current = null;
      }, 4000);
      return;
    }

    setIsThinking(currentlyThinking);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const stored = loadUsage();
        if (stored.isThinking) {
          stored.isThinking = false;
          saveUsage(stored);
        }
      } catch {}
      const real = await fetchRealUsage();
      const latest = real ?? loadUsage();
      latest.isThinking = false;
      prevThinkingRef.current = false;
      setIsThinking(false);
      const initial = resolveState(getTokenState(latest));
      currentDisplayRef.current = initial;
      setDisplayState(initial);
      const freshData = latest.sessionPct != null || latest.sessionTokens > 0;
      setIsConnected(!!real || freshData);
      setUsage(latest);
    };
    init();
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, 1000);
    return () => {
      clearInterval(interval);
      if (justFinishedTimerRef.current)
        clearTimeout(justFinishedTimerRef.current);
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      if (eatingTimerRef.current) clearTimeout(eatingTimerRef.current);
      if (devLockTimerRef.current) clearTimeout(devLockTimerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [refresh]);

  return {
    usage,
    buddyState: displayState,
    prevState,
    isTransitioning,
    refresh,
    isConnected,
    isThinking,
    isEating,
    justFinished,
    devLocked,
    forceState,
    forceEat,
  };
}
