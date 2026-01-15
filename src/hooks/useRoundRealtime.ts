import { useMemo } from 'react';
import { RoundNumber, CourtWithDrawAndGames, Round } from '../types';
import { useCourtsRealtimeForEvent, useGamesRealtimeForEvent } from './firestoreHooks';
import { calculatePlayerRankings, generateChallengeEventDraw } from '../lib/challengeEventUtils';

export const useRoundRealtime = (
  eventId?: string,
  roundNumber?: RoundNumber | unknown,
): Round | undefined => {
  const { data: courts } = useCourtsRealtimeForEvent(eventId);
  const { data: games } = useGamesRealtimeForEvent(eventId);

  const round = useMemo(() => {
    if (typeof roundNumber !== 'number' || ![1, 2].includes(roundNumber)) return undefined;
    if (!courts || !games || courts.length === 0) return undefined;
    const totalPlayers = courts.reduce((sum, court) => sum + court.playerIds.length, 0);
    const draws = generateChallengeEventDraw(totalPlayers, roundNumber as RoundNumber);
    const filteredCourtsWithDraws: CourtWithDrawAndGames[] = courts
      .filter((c) => c.roundNumber === roundNumber)
      .sort((a, b) => a.courtNumber - b.courtNumber)
      .map((court, index) => ({
        ...court,
        seeds: draws[index].seeds,
        games: games.filter((g) => g.courtId === court.id),
      }));

    console.log('filtererdCourtsWithDraws', filteredCourtsWithDraws);

    if (filteredCourtsWithDraws.length === 0) return undefined;

    return {
      roundNumber: roundNumber as RoundNumber,
      courts: filteredCourtsWithDraws,
      // standings: calculatePlayerRankings(filteredCourtsWithDraws, roundNumber as RoundNumber).map(
      //   (pd) => pd.id,
      // ),
    };
  }, [courts, games, roundNumber]);

  return round;
};
