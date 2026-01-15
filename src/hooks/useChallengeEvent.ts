import { useCallback, useMemo, useState } from 'react';
import { RoundNumber, ChallengeEventStage } from '../types';
import {
  useCourtsRealtimeForEvent,
  useCreateCourtForEvent,
  useCreateGameForEvent,
  useDeleteCourtForEvent,
  useDeleteGameForEvent,
  useEventRealtime,
  useEvents,
  useGamesRealtimeForEvent,
  useUpdateEvent,
  useUpdateGameForEvent,
} from './firestoreHooks';
import { useRoundRealtime } from './useRoundRealtime';
import { useQueryState } from './useQueryState';
import {
  calculatePlayerRankings,
  generateCourts,
  generateGames,
  isValidNumberOfPlayers,
} from '../lib/challengeEventUtils';

// export type ChallengeEventView = ChallengeEventRoundNumber | 'standings' | 'initialize';

export const useChallengeEvent = (eventId?: string) => {
  const { data: events } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(eventId);
  const effectiveEventId = eventId ?? selectedEventId;
  const { data: event } = useEventRealtime(effectiveEventId);
  const { update: updateEvent } = useUpdateEvent();

  const round1 = useRoundRealtime(effectiveEventId, 1);
  const round2 = useRoundRealtime(effectiveEventId, 2);

  const isRoundCreated = useCallback(
    (roundNumber: RoundNumber) => {
      const round = roundNumber === 1 ? round1 : round2;
      return round !== undefined && round.courts.length > 0;
    },
    [round1, round2],
  );

  const isRoundComplete = useCallback(
    (roundNumber: RoundNumber) => {
      const round = roundNumber === 1 ? round1 : round2;
      if (!round) return false;
      return round.courts.every((court) =>
        court.games.every((game) => game.team1Score !== undefined && game.team2Score !== undefined),
      );
    },
    [round1, round2],
  );

  const eventStage: ChallengeEventStage = useMemo(() => {
    return event?.ongoingStage || 1;
  }, [event]);

  const [view, setView] = useQueryState('stage', eventStage as string);
  const setCurrentView = useCallback(
    (stage: ChallengeEventStage) => {
      setView(typeof stage === 'string' ? stage : stage.toString());
    },
    [setView],
  );

  const currentView = useMemo<ChallengeEventStage>(() => {
    if (view === 'initial' || view === 'standings') {
      return view as ChallengeEventStage;
    }

    const roundNumber = parseInt(view, 10);
    if ([1, 2, 3].includes(roundNumber)) {
      return roundNumber as RoundNumber;
    }
    return eventStage;
  }, [view, eventStage]);

  const setEventStage = useCallback(
    (stage: ChallengeEventStage) => {
      if (!event) return;
      updateEvent({ id: event.id, ongoingStage: stage });
    },
    [event, updateEvent],
  );

  const { create: createCourt } = useCreateCourtForEvent(effectiveEventId);
  const { create: createGame } = useCreateGameForEvent(effectiveEventId);
  const { update: updateGame } = useUpdateGameForEvent(effectiveEventId);

  const { data: games = [] } = useGamesRealtimeForEvent(effectiveEventId);
  const { remove: deleteGame } = useDeleteGameForEvent(effectiveEventId);
  const { data: courts = [] } = useCourtsRealtimeForEvent(effectiveEventId);
  const { remove: deleteCourt } = useDeleteCourtForEvent(effectiveEventId);

  const resetAll = useCallback(async () => {
    if (!window.confirm('Are you sure you want to clear all data and start over?')) return;
    if (!selectedEventId) return;

    // Delete all rounds, courts, and games for the event
    // Note: Implement the deletion logic here as needed
    for (const game of games || []) {
      await deleteGame(game.id!);
    }

    for (const court of courts || []) {
      await deleteCourt(court.id!);
    }

    setEventStage(1);
    setCurrentView(1);
  }, [selectedEventId, setEventStage, setCurrentView, games, deleteGame, courts, deleteCourt]);

  const setupRound = useCallback(
    async (playerIds: string[], roundNumber: RoundNumber) => {
      if (isRoundCreated(roundNumber)) {
        console.error(`Round ${roundNumber} has already been created.`);
        return;
      }

      if (isValidNumberOfPlayers(playerIds.length) === false) {
        console.error(
          `Invalid number of players: ${playerIds.length}. Must be between 8 and 35 players.`,
        );
        return;
      }

      const courts = generateCourts(playerIds, roundNumber);
      for (const court of courts) {
        const courtId = await createCourt(court);

        const games = generateGames(court);
        for (const game of games) {
          await createGame({ courtId, ...game });
        }

        setEventStage(roundNumber);
        setCurrentView(roundNumber);
      }
    },
    [isRoundCreated, createCourt, setEventStage, setCurrentView, createGame],
  );

  const initializeRoundOne = useCallback(
    async (playerIds: string[]) => await setupRound(playerIds, 1),
    [setupRound],
  );

  const advanceToRoundTwo = useCallback(async () => {
    if (!isRoundComplete(1)) {
      alert('Cannot advance to round 2: round 1 is not complete.');
      return;
    }

    if (isRoundCreated(2)) {
      alert('Round 2 has already been created.');
      return;
    }

    if (!round1?.courts || round1.courts.length === 0) {
      alert('No courts available from round 1 to advance to round 2.');
      return;
    }

    const playerRankings = calculatePlayerRankings(round1.courts, 1);

    await setupRound(
      playerRankings.map((p) => p.id),
      2,
    );

    setCurrentView(2);
    setEventStage(2);
  }, [isRoundComplete, isRoundCreated, round1, setCurrentView, setEventStage, setupRound]);

  const finalizeEvent = () => {
    if (!event) {
      alert('No event selected to finalize.');
      return;
    }

    if (!round2) {
      alert('Cannot finalize event: round 2 data is missing.');
      return;
    }

    if (!isRoundComplete(2)) {
      alert('Cannot finalize event: round 2 is not complete.');
      return;
    }

    if (
      event.standings &&
      event.standings.length > 0 &&
      window.confirm('Standings already exist. Overwrite?') === false
    ) {
      return;
    }

    updateEvent({ id: event.id, standings: round2.standings });
    setCurrentView('standings');
  };

  const completedMatches = useMemo(
    () =>
      games?.filter((g) => g.team1Score !== undefined && g.team2Score !== undefined).length || 0,
    [games],
  );
  const totalMatches = useMemo(() => games?.length || 1, [games]);
  const progressPercent = Math.round((completedMatches / Math.max(1, totalMatches)) * 100);

  const handleScoreChange = useCallback(
    (gameId: string, team: 'team1Score' | 'team2Score', score: number) => {
      console.log('updateGame called with:', gameId, team, score, updateGame);
      updateGame({ id: gameId, [team]: score });
    },
    [updateGame],
  );

  const needsInitialization = useMemo(() => isRoundCreated(1) === false, [isRoundCreated]);
  return {
    events,
    selectedEventId: effectiveEventId,
    setSelectedEventId,
    round1,
    round2,

    needsInitialization,

    event,
    currentView,
    setCurrentView,

    completedMatches,
    totalMatches,
    progressPercent,

    handleScoreChange,

    initializeRoundOne,
    advanceToRoundTwo,
    finalizeEvent,
    resetAll,

    apiError: null,
  };
};
