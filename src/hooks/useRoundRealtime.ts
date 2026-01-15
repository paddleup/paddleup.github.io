import { useMemo } from 'react';
import { calculatePlayerRankings, useDraws } from '../lib/courtUtils';
import { RoundNumber, ChallengeEventStage, CourtWithDrawAndGames, Round } from '../types';
import { useCourtsRealtimeForEvent, useGamesRealtimeForEvent } from './firestoreHooks';

export const useRoundRealtime = (
  eventId?: string,
  roundNumber?: ChallengeEventStage,
): Round | undefined => {
  const { data: courts } = useCourtsRealtimeForEvent(eventId);
  const draws = useDraws(courts?.length, roundNumber as RoundNumber | undefined);

  const { data: games } = useGamesRealtimeForEvent(eventId);

  const round = useMemo(() => {
    if (!courts || !draws || !games) return undefined;
    const filteredCourtsWithDraws: CourtWithDrawAndGames[] = courts
      .filter((c) => c.roundNumber === roundNumber)
      .sort((a, b) => a.courtNumber - b.courtNumber)
      .map((court, index) => ({
        ...court,
        seeds: draws[index].seeds,
        tier: draws[index].tier,
        games: games.filter((g) => g.courtId === court.id),
      }));
    return {
      roundNumber: roundNumber as RoundNumber,
      courts: filteredCourtsWithDraws,
      standings: calculatePlayerRankings(filteredCourtsWithDraws, roundNumber as RoundNumber).map(
        (pd) => pd.id,
      ),
    };
  }, [courts, draws, games, roundNumber]);

  return round;
};
