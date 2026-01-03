import { useCallback } from 'react';
import { useLocalStorageState } from './useLocalStorage';
import { Court } from './useMatchCalculator';

export const defaultCourt: Court = {
  playerNames: ['', '', '', ''],
  matches: [{}, {}, {}],
};

const defaultCourts: Court[] = [defaultCourt, defaultCourt, defaultCourt, defaultCourt];

/**
 * useCalculatorPersistence
 * Consolidates localStorage-backed state used by the match calculator UI.
 * Exposes the same tuple-style setters/removers from useLocalStorageState plus
 * a convenience removeAll to clear all persisted keys for this calculator.
 */
export function useCalculatorPersistence() {
  const [courts, setCourts, resetCourts] = useLocalStorageState<Court[]>(
    'paddleup_courts',
    defaultCourts,
  );

  const [round, setRound, resetRound] = useLocalStorageState<1 | 2 | 3>('paddleup_round', 1);
  const resetAllStorage = useCallback(() => {
    resetCourts();
    resetRound();
  }, [resetCourts, resetRound]);

  return {
    courts,
    setCourts,
    resetCourts,
    round,
    setRound,
    resetRound,
    resetAllStorage,
  } as const;
}
