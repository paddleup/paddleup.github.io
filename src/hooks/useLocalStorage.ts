import { useCallback, useEffect, useState } from 'react';

/**
 * useLocalStorageState
 * - Generic hook that syncs state with localStorage.
 * - Returns [state, setState, remove] where `remove` deletes the key from localStorage.
 */
export function useLocalStorageState<T>(key: string, initial: T | (() => T)) {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved) as T;
      } catch {
        // fall through to default
      }
    }
    return typeof initial === 'function' ? (initial as () => T)() : initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [key, state]);

  const resetState = useCallback(() => {
    setState(typeof initial === 'function' ? (initial as () => T)() : initial);
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }, [key, initial]);

  return [state, setState, resetState] as const;
}
