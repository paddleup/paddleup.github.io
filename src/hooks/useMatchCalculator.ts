import { useCallback, useMemo, useState } from 'react';
import { defaultCourt } from './usePersistentCalculator';
import { useMatchPersistence } from './useMatchPersistence';
import {
  calculateDraws,
  calculatePlayerRankings,
  Court,
  generateNextRoundCourts,
} from '../lib/courtUtils';

type ActiveView = number | 'rankings';

export function useMatchCalculator() {
  // Optional realtime match integration (enabled via Vite env VITE_LIVE_MATCH_ID)
  const liveMatchId = (import.meta.env.VITE_LIVE_MATCH_ID as string) ?? null;

  // Persistent player count + courts + round (persisted) via adapter
  const {
    courts: localCourts,
    setCourts: setLocalCourts,
    round: localRound,
    setRound: setLocalRound,
    resetAllStorage,
    remoteData,
    writeRemote,
    connected: persistenceConnected,
    pending: persistencePending,
  } = useMatchPersistence(liveMatchId);

  // Optimistic overlay for UI updates while remote write is pending
  const [optimisticCourts, setOptimisticCourts] = useState<Court[] | null>(null);

  // Source-of-truth: optimistic -> remote -> local
  const courts = (optimisticCourts ?? remoteData?.courts ?? localCourts) as Court[];
  const round = (remoteData?.round as 1 | 2 | 3) ?? localRound;

  // Unified setters: write to remote when live mode active, but always update local storage for offline
  const setCourts = useCallback(
    (updater: Court[] | ((prev: Court[]) => Court[])) => {
      const next =
        typeof updater === 'function'
          ? (updater as (p: Court[]) => Court[])(courts)
          : (updater as Court[]);

      // Always update local storage immediately via persistence adapter
      // (debug log to help diagnose court count issues)
      // eslint-disable-next-line no-console
      console.log(
        '[useMatchCalculator] setCourts -> next courts count:',
        Array.isArray(next) ? next.length : typeof next,
      );

      // optimistic UI update
      setOptimisticCourts(next);

      // Persist via adapter (returns Promise<boolean>); clear optimistic overlay on failure
      const writeResult = setLocalCourts(next);
      if (writeResult && typeof (writeResult as any).then === 'function') {
        (writeResult as Promise<boolean>)
          .then((ok) => {
            if (!ok) setOptimisticCourts(null);
          })
          .catch(() => setOptimisticCourts(null));
      }
    },
    [setLocalCourts, courts, setOptimisticCourts],
  );

  const setRound = useCallback(
    (r: 1 | 2 | 3) => {
      // Persist via adapter which handles remote writes
      void setLocalRound(r);
    },
    [setLocalRound],
  );

  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>(0);
  const [copyFeedback] = useState(false);

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
    if (liveMatchId) {
      writeRemote?.({
        courts: Array.from({ length: courts.length }, () => defaultCourt),
        round: 1,
      });
    }

    resetAllStorage();
    setDuplicateError(null);
  }, [resetAllStorage, liveMatchId, writeRemote, courts.length]);

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

  const draws = useMemo(() => calculateDraws(courts.length, round), [courts.length, round]);

  return {
    // state
    draws,
    courts,
    setCourts,
    round,
    setRound,
    duplicateError,
    activeView,
    setActiveView,
    copyFeedback,
    // realtime info (when enabled)
    connected: !!remoteData && !!persistenceConnected,
    pending: persistencePending ?? false,
    liveMatchId,

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
  } as const;
}
