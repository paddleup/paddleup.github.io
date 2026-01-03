import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCalculatorPersistence } from './usePersistentCalculator';
import { computeStandingsReturningStats, getSeedLayout, range } from '../lib/matchCalculatorLogic';
import {
  calculateCourtDetails,
  calculatePlayerRankings,
  generateNextRoundCourts,
  getTierRangeLabel,
} from './useCalculator';
import { rules } from '../data/rules';

type ActiveView = number | 'rankings';

export function useMatchCalculator() {
  // Persistent player count + courts + round (persisted)
  const { courts, setCourts, round, setRound, resetAllStorage } = useCalculatorPersistence();

  const [results, setResults] = useState<any[] | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>(0);
  const [copyFeedback, setCopyFeedback] = useState(false);

  /* Persistence handled by useLocalStorageState hook */

  /* Actions */

  const setPlayerName = useCallback(
    (courtIdx: number, slotIdx: number, name: string | null) => {
      const nm = (name ?? '').toString();
      const used = new Set<string>();

      courts.forEach((c, ci) =>
        c.playerNames.forEach((p, pi) => {
          if (ci === courtIdx && pi === slotIdx) return;
          if (p) used.add(p);
        }),
      );

      if (!nm || !used.has(nm) || courts[courtIdx].playerNames[slotIdx] === nm) {
        setDuplicateError(null);
        setCourts((prev) =>
          prev.map((c, ci) =>
            ci !== courtIdx
              ? c
              : {
                  ...c,
                  playerNames: c.playerNames.map((p, pi) => (pi === slotIdx ? nm : p)),
                },
          ),
        );
      } else {
        setDuplicateError(`${nm} is already selected in another slot`);
      }
    },
    [courts, setCourts],
  );

  const setScore = useCallback(
    (courtIdx: number, matchIdx: number, team: 'scoreA' | 'scoreB', value?: number) => {
      setCourts((prev) =>
        prev.map((c, ci) =>
          ci !== courtIdx
            ? c
            : {
                ...c,
                matches: c.matches.map((m, mi) => (mi === matchIdx ? { ...m, [team]: value } : m)),
              },
        ),
      );
    },
    [setCourts],
  );

  const playerRankings = useMemo(() => calculatePlayerRankings(courts, round), [courts, round]);

  const advanceToNextRound = useCallback(() => {
    const nextCourts = generateNextRoundCourts(playerRankings, round);

    setRound((round + 1) as 2 | 3);
    setCourts(nextCourts);
  }, [playerRankings, round, setCourts, setRound]);

  const resetAll = useCallback(() => {
    if (!window.confirm('Are you sure you want to clear all data and start over?')) return;

    resetAllStorage();
    setDuplicateError(null);
  }, [resetAllStorage]);

  const copyRankingsToClipboard = useCallback(() => {
    // TODO
  }, []);

  /* Derived values */
  const totalMatches = courts.length * 3;
  const completedMatches = courts.reduce(
    (acc, c) =>
      acc + c.matches.filter((m) => m.scoreA !== undefined && m.scoreB !== undefined).length,
    0,
  );
  const progressPercent = Math.round((completedMatches / Math.max(1, totalMatches)) * 100);

  const activeTierLabel = useMemo(() => {
    const labels = new Set<string>();
    for (let ci = 1; ci <= courts.length; ci++) {
      const label = getTierRangeLabel(courts.length, round, ci);
      labels.add(`Tier ${label}`);
    }
    return Array.from(labels).join(', ');
  }, [courts.length, round]);

  const courtDetails = useMemo(() => calculateCourtDetails(courts, round), [courts, round]);

  return {
    // state
    courtDetails,
    setCourts,
    round,
    setRound,
    results,
    duplicateError,
    snapshots,
    activeView,
    setActiveView,
    copyFeedback,

    // actions
    setPlayerName,
    setScore,
    advanceToNextRound,
    resetAll,
    copyRankingsToClipboard,

    // derived
    playerRankings,
    totalMatches,
    completedMatches,
    progressPercent,
    activeTierLabel,
  } as const;
}
