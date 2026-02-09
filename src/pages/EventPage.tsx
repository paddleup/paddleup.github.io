import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useEventByCode, usePlayers } from '../hooks/firestoreHooks';
import { useAdmin } from '../hooks/useAdmin';
import { useChallengeEvent } from '../hooks/useChallengeEvent';
import { calculatePlayerRankings } from '../lib/challengeEventUtils';
import { getPointsForRank } from '../lib/points';
import EventPageView from '../views/EventPageView';

const EventPage: React.FC = () => {
  const { eventCode } = useParams<{ eventCode: string }>();
  const decodedCode = eventCode ? decodeURIComponent(eventCode) : '';
  const { data: event, isLoading: eventLoading } = useEventByCode(decodedCode);
  const { data: players = [] } = usePlayers();
  const { isAdmin } = useAdmin();
  // useChallengeEvent needs the Firestore document ID, which we get from the fetched event
  const challenge = useChallengeEvent(event?.id);

  // State for player selection
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);

  // State for player search and highlighting
  const [highlightedPlayerId, setHighlightedPlayerId] = useState<string | null>(null);

  // Filter and sort players for selection
  const filteredPlayers = useMemo(() => {
    return players
      .filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [players, searchTerm]);

  const handlePlayerToggle = (playerId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId],
    );
  };

  const handleInitializeRound = async () => {
    if (selectedPlayerIds.length < 8 || selectedPlayerIds.length > 35) {
      alert('Please select between 8-35 players');
      return;
    }

    setIsInitializing(true);
    try {
      await challenge.initializeRoundOne(selectedPlayerIds);
      setSelectedPlayerIds([]);
    } catch (error) {
      console.error('Failed to initialize round:', error);
      alert('Failed to initialize round. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleAdvanceToRoundTwo = async () => {
    if (!window.confirm('Are you sure you want to advance to Round 2? This cannot be undone.')) {
      return;
    }

    try {
      await challenge.advanceToRoundTwo();
    } catch (error) {
      console.error('Failed to advance to round 2:', error);
      alert('Failed to advance to Round 2. Please try again.');
    }
  };

  const handleFinalizeEvent = () => {
    if (
      !window.confirm(
        'Are you sure you want to finalize this event? Final standings will be published.',
      )
    ) {
      return;
    }

    challenge.finalizeEvent();
  };

  return (
    <EventPageView
      event={event}
      eventLoading={eventLoading}
      players={players}
      isAdmin={isAdmin}
      challenge={challenge}
      selectedPlayerIds={selectedPlayerIds}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      isInitializing={isInitializing}
      highlightedPlayerId={highlightedPlayerId}
      setHighlightedPlayerId={setHighlightedPlayerId}
      filteredPlayers={filteredPlayers}
      handlePlayerToggle={handlePlayerToggle}
      handleInitializeRound={handleInitializeRound}
      handleAdvanceToRoundTwo={handleAdvanceToRoundTwo}
      handleFinalizeEvent={handleFinalizeEvent}
      calculatePlayerRankings={calculatePlayerRankings}
      getPointsForRank={getPointsForRank}
    />
  );
};

export default EventPage;
