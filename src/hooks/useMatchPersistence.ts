// import { useCallback } from 'react';
// import { useCalculatorPersistence } from './usePersistentCalculator';
// import { useRealtimeMatch } from './useRealtimeMatch';
// import type { Court, CourtWithDraw } from './useMatchCalculator';

// function toCourt(c: Court | CourtWithDraw): Court {
//   return { playerNames: c.playerNames, matches: c.matches };
// }

// function sanitizeForRemote(courts: Array<Court | CourtWithDraw>): Court[] {
//   return courts.map(toCourt);
// }

// /**
//  * Adapter that composes localStorage persistence + optional Firestore realtime.
//  * - Exposes the same surface used by the calculator hook.
//  * - Ensures remote writes only contain the Court shape (playerNames + matches).
//  */
// export function useMatchPersistence(matchId: string | null) {
//   const {
//     courts: localCourts,
//     setCourts: setLocalCourts,
//     round: localRound,
//     setRound: setLocalRound,
//     resetAllStorage,
//   } = useCalculatorPersistence();

//   const { data: remoteData, write: writeRemote, connected, pending } = useRealtimeMatch(matchId);

//   const setCourts = useCallback(
//     async (nextOrUpdater: Court[] | CourtWithDraw[] | ((prev: Court[]) => Court[])) => {
//       const resolved =
//         typeof nextOrUpdater === 'function'
//           ? (nextOrUpdater as (p: Court[]) => Court[])(localCourts)
//           : (nextOrUpdater as Court[]);

//       // Persist locally immediately
//       setLocalCourts(resolved);

//       // If remote available, write sanitized courts and return success boolean
//       if (writeRemote && matchId) {
//         try {
//           await writeRemote({ courts: sanitizeForRemote(resolved) });
//           return true;
//         } catch {
//           return false;
//         }
//       }

//       return true;
//     },
//     [localCourts, setLocalCourts, writeRemote, matchId],
//   );

//   const setRound = useCallback(
//     async (r: 1 | 2 | 3) => {
//       setLocalRound(r);
//       if (writeRemote && matchId) {
//         try {
//           await writeRemote({ round: r });
//         } catch {
//           // swallow
//         }
//       }
//     },
//     [setLocalRound, writeRemote, matchId],
//   );

//   return {
//     courts: localCourts,
//     setCourts,
//     round: localRound,
//     setRound,
//     resetAllStorage,
//     remoteData,
//     writeRemote,
//     connected,
//     pending,
//   } as const;
// }
