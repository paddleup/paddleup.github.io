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
  // If eventId is provided, always use it instead of internal state
  const effectiveEventId = eventId ?? selectedEventId;
  const { data: event } = useEventRealtime(effectiveEventId);
  const { update: updateEvent } = useUpdateEvent();

  const eventStage: ChallengeEventStage = useMemo(() => {
    return event?.ongoingStage || 'initial';
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

  const currentRoundViewData = useRoundRealtime(effectiveEventId, currentView as RoundNumber);

  const ongoingRoundNumber: RoundNumber | undefined = useMemo(
    () => (eventStage as RoundNumber) || 0,
    [eventStage],
  );
  const nextRoundNumber = useMemo(() => {
    if (eventStage === 'initial') return 1;
    if (typeof eventStage === 'number' && eventStage < 3) return (eventStage + 1) as RoundNumber;
    return undefined;
  }, [eventStage]);

  const setEventStage = useCallback(
    (stage: ChallengeEventStage) => {
      if (!event) return;
      updateEvent({ id: event.id, ongoingStage: stage });
    },
    [event, updateEvent],
  );

  const ongoingRound = useRoundRealtime(effectiveEventId, ongoingRoundNumber);
  const nextRound = useRoundRealtime(effectiveEventId, nextRoundNumber);

  const completedRounds = useMemo(() => ongoingRoundNumber - 1, [ongoingRoundNumber]);
  const { create: createCourt } = useCreateCourtForEvent(effectiveEventId);
  const { create: createGame } = useCreateGameForEvent(effectiveEventId);
  const { update: updateGame } = useUpdateGameForEvent(effectiveEventId);
  console.log('effectiveEventId:', effectiveEventId, 'updateGame:', updateGame);

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

    setEventStage('initial');
    setCurrentView('initial');
  }, [selectedEventId, setEventStage, setCurrentView, games, deleteGame, courts, deleteCourt]);

  const setupRound = useCallback(
    async (playerIds: string[], roundNumber: RoundNumber) => {
      if (completedRounds >= roundNumber) {
        console.error(`Cannot setup round: round ${roundNumber} has already been played`);
        return;
      }

      if (isValidNumberOfPlayers(playerIds.length) === false) {
        console.error(
          `Invalid number of players: ${playerIds.length}. Must be between 8 and 40 players.`,
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
    [completedRounds, createCourt, createGame, setEventStage, setCurrentView],
  );

  const initializeRoundOne = useCallback(
    async (playerIds: string[]) => await setupRound(playerIds, 1),
    [setupRound],
  );

  const advanceToRoundTwo = useCallback(async () => {
    if (![2].includes(ongoingRoundNumber || 0)) {
      alert('Can only advance to next round from rounds 1 or 2.');
      return;
    }

    if (!ongoingRound) {
      alert('No ongoing round data available to advance.');
      return;
    }

    if (ongoingRound.courts.length === 0 || ongoingRound.courts.some((c) => c.games.length === 0)) {
      alert('No courts games available in the ongoing round to advance.');
      return;
    }

    if (
      ongoingRound.courts.some((c) =>
        c.games.some((g) => g.team1Score === undefined || g.team2Score === undefined),
      )
    ) {
      alert('All match results must be entered before advancing to the next round.');
      return;
    }

    if (nextRoundNumber === undefined) {
      alert('Cannot determine the next round number.');
      return;
    }

    if (nextRound && nextRound.courts.length > 0) {
      alert('Next round courts have already been initialized.');
      return;
    }

    const playerRankings = calculatePlayerRankings(ongoingRound.courts, ongoingRoundNumber);

    await setupRound(
      playerRankings.map((p) => p.id),
      2,
    );

    setCurrentView(nextRoundNumber);
    setEventStage(nextRoundNumber);
  }, [
    nextRound,
    nextRoundNumber,
    ongoingRound,
    ongoingRoundNumber,
    setCurrentView,
    setEventStage,
    setupRound,
  ]);

  const finalizeEvent = () => {
    if (!event) {
      alert('No event selected to finalize.');
      return;
    }

    if (eventStage !== 2) {
      alert('Event can only be finalized after completing round 2.');
      return;
    }

    if (!ongoingRound?.courts || ongoingRound.courts.length === 0) {
      alert('No courts available to finalize the event.');
      return;
    }

    if (
      ongoingRound.courts.some((c) =>
        c.games.some((g) => g.team1Score === undefined || g.team2Score === undefined),
      )
    ) {
      alert('All match results must be entered before finalizing the event.');
      return;
    }

    if (
      event.standings &&
      event.standings.length > 0 &&
      window.confirm('Standings already exist. Overwrite?') === false
    ) {
      return;
    }

    updateEvent({ id: event.id, standings: ongoingRound.standings });
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

  return {
    events,
    selectedEventId: effectiveEventId,
    setSelectedEventId,

    ongoingRound,
    currentRoundViewData,

    event,
    currentView,
    setCurrentView,

    ongoingRoundNumber,
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
