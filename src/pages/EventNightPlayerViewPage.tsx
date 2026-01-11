import React from 'react';
import { useChallengeEvent } from '../hooks/useChallengeEvent';
import { Player } from '../types';
import RoundTabs from '../components/ui/RoundTabs';
import { usePlayers } from '../hooks/firestoreHooks';

import EventSelector from '../components/eventNight/EventSelector';
import RoundProgressBar from '../components/eventNight/RoundProgressBar';
import CourtCard from '../components/eventNight/CourtCard';

const EventNightPlayerView: React.FC = () => {
  const {
    events,
    selectedEventId,
    setSelectedEventId,

    currentRoundViewData,

    event,

    currentView,
    setCurrentView,

    ongoingRoundNumber,
    completedMatches,
    totalMatches,
    progressPercent,

    handleScoreChange,

    initializeCourts,
    advanceToNextRound,
    finalizeEvent,
  } = useChallengeEvent();

  const { data: rawPlayers = [] } = usePlayers();
  const players = rawPlayers.map((p) => ({
    ...p,
    id: p.id ?? '',
  }));

  return (
    <div className="min-h-[80vh] bg-background text-text-main px-2 py-4 sm:p-6 max-w-2xl mx-auto">
      <header className="mb-4 text-center">
        <h1 className="text-3xl sm:text-2xl font-extrabold tracking-tight mb-1">Match Night</h1>
        <div className="flex items-center justify-center gap-2 text-xs mb-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">
            Player View
          </span>
          {selectedEventId ? (
            <span className="text-[11px] text-text-muted">Event: {selectedEventId}</span>
          ) : (
            <span className="text-[11px] text-text-muted">No event selected</span>
          )}
        </div>
        <div className="mt-2 h-0.5 bg-gradient-to-r from-primary via-text-accent to-success rounded" />
      </header>
      <div className="mb-4">
        <EventSelector
          events={events ?? []}
          selectedEventId={selectedEventId}
          onChange={setSelectedEventId}
        />
      </div>
      <RoundTabs current={currentView} onSelect={setCurrentView} />

      {currentRoundViewData?.courts ? (
        <>
          <RoundProgressBar
            completedMatches={completedMatches}
            totalMatches={totalMatches}
            progressPercent={progressPercent}
            numPlayers={(currentRoundViewData.courts.length ?? 0) * 4}
            numCourts={currentRoundViewData.courts.length ?? 0}
          />
          <h2 className="text-lg font-semibold mb-2 text-center">Court Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentRoundViewData.courts.map((court, ci) => (
              <CourtCard
                key={court.id ?? ci}
                court={{
                  ...court,
                  courtNumber: court.courtNumber ?? ci + 1,
                }}
                players={players}
                editableScores={false}
                roundNumber={(currentView as number) + 1}
              />
            ))}
          </div>
          <div className="mt-6 text-center text-xs text-text-muted">
            Progress: Round {(currentView as number) + 1} of {3}
          </div>
        </>
      ) : (
        <div className="text-center text-text-muted mt-8">
          No round data available for this event.
        </div>
      )}
    </div>
  );
};

export default EventNightPlayerView;
