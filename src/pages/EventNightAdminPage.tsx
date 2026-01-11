// src/pages/EventNightAdmin.tsx
import React, { useState, useMemo } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import type { Court } from '../types';

import { useChallengeEvent } from '../hooks/useChallengeEvent';
import RoundTabs from '../components/ui/RoundTabs';
import { usePlayers } from '../hooks/firestoreHooks';

import EventSelector from '../components/eventNight/EventSelector';
import RoundProgressBar from '../components/eventNight/RoundProgressBar';
import CourtCard from '../components/eventNight/CourtCard';
import AdminControls from '../components/eventNight/AdminControls';
import ErrorBanner from '../components/eventNight/ErrorBanner';
import Button from '../components/ui/Button';

function seedPlayersByPoints(playerIds: string[], allTimeStats: Record<string, number>) {
  return [...playerIds]
    .filter((p) => playerIds.includes(p ?? ''))
    .sort((a, b) => (allTimeStats[b ?? ''] ?? 0) - (allTimeStats[a ?? ''] ?? 0));
}

const EventNightAdmin: React.FC = () => {
  const {
    events,
    selectedEventId,
    setSelectedEventId,

    ongoingRound,
    currentRoundViewData,

    currentView,
    setCurrentView,

    ongoingRoundNumber,
    completedMatches,
    totalMatches,
    progressPercent,

    initializeCourts,
    advanceToNextRound,
    finalizeEvent,
    handleScoreChange,
    resetAll,

    apiError,
  } = useChallengeEvent();

  const { data: rawPlayers = [] } = usePlayers();
  const players = rawPlayers.map((p) => ({
    ...p,
    id: p.id ?? '',
  }));

  // Use real all-time points for seeding
  const leaderboard = useLeaderboard('all');
  const allTimeStats: Record<string, number> = useMemo(() => {
    const stats: Record<string, number> = {};
    leaderboard.forEach((row) => {
      stats[row.id ?? ''] = row.points ?? 0;
    });
    return stats;
  }, [leaderboard]);

  const [numCourts, setNumCourts] = useState(4);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);

  // Memoize filtered players for stable dependencies

  // Initial seeding and court assignment
  const seededPlayerIds = useMemo(
    () => seedPlayersByPoints(selectedPlayers, allTimeStats),
    [selectedPlayers, allTimeStats],
  );

  // Assign courts for current round
  const handleAssignCourts = async () => {
    initializeCourts(numCourts, seededPlayerIds);
    // if (rounds[roundIdx]) {
    //   // Update existing round
    //   await updateRound.update({ courts: assignedCourts });
    // } else {
    //   // Create new round
    //   await createRound.create({ courts: assignedCourts });
    // }
  };

  // // Score input for current round
  // const handleScoreChange = async (
  //   courtIdx: number,
  //   matchIdx: number,
  //   team: 'A' | 'B',
  //   value: number,
  // ) => {
  //   const round = rounds[roundIdx];
  //   if (!round) return;
  //   const courtsCopy = round.courts.map((court, ci) =>
  //     ci === courtIdx
  //       ? {
  //           ...court,
  //           matches: court.matches?.map((m, mi) =>
  //             mi === matchIdx
  //               ? team === 'A'
  //                 ? { ...m, team1Score: value }
  //                 : { ...m, team2Score: value }
  //               : m,
  //           ),
  //         }
  //       : court,
  //   );
  //   await updateRound.update({ courts: courtsCopy });
  // };

  // Advance to next round
  const handleAdvanceRound = async () => {
    advanceToNextRound();
  };

  return (
    <div className="space-y-8">
      <div className="min-h-[60vh] bg-background text-text-main p-4 sm:p-6">
        <div className="mx-auto">
          <header className="mb-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-3xl sm:text-2xl font-extrabold tracking-tight">
                Event Night Admin
              </h1>
              <div className="text-xs flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success/10 text-success">
                  Admin
                </span>
                {selectedEventId ? (
                  <span className="text-[11px] text-text-muted">Event: {selectedEventId}</span>
                ) : (
                  <span className="text-[11px] text-text-muted">No event selected</span>
                )}
              </div>
            </div>
            <p className="text-sm text-text-muted mt-1 max-w-prose mx-auto">
              Assign courts, enter scores, and manage rounds for the selected event.
            </p>
            <div className="mt-3 h-0.5 bg-gradient-to-r from-primary via-text-accent to-success rounded" />
          </header>
          <EventSelector
            events={events ?? []}
            selectedEventId={selectedEventId}
            onChange={setSelectedEventId}
            className=""
          />
        </div>

        <div className="mb-8">
          <RoundTabs current={currentView} onSelect={setCurrentView} showInitialize />
          {currentView === 'initial' && (
            <>
              <AdminControls
                numCourts={numCourts}
                setNumCourts={setNumCourts}
                players={players}
                selectedPlayers={selectedPlayers}
                setSelectedPlayers={setSelectedPlayers}
                allTimeStats={allTimeStats}
                onAssignCourts={handleAssignCourts}
                disabled={selectedPlayers.length !== numCourts * 4}
                error={
                  selectedPlayers.length !== numCourts * 4
                    ? `Select exactly ${numCourts * 4} players for ${numCourts} courts`
                    : ''
                }
              />
            </>
          )}
          <RoundProgressBar
            completedMatches={
              currentRoundViewData?.courts.reduce(
                (acc, court) =>
                  acc +
                  (court.games.filter(
                    (m) => m.team1Score !== undefined && m.team2Score !== undefined,
                  ).length ?? 0),
                0,
              ) ?? 0
            }
            totalMatches={(currentRoundViewData?.courts?.length ?? 0) * 3}
            progressPercent={
              currentRoundViewData?.courts?.length
                ? Math.round(
                    (currentRoundViewData?.courts.reduce(
                      (acc, court) =>
                        acc +
                        (court.games.filter(
                          (m) => m.team1Score !== undefined && m.team2Score !== undefined,
                        ).length ?? 0),
                      0,
                    ) /
                      (currentRoundViewData?.courts.length * 3)) *
                      100,
                  )
                : 0
            }
            numPlayers={(currentRoundViewData?.courts.length ?? 0) * 4}
            numCourts={currentRoundViewData?.courts?.length ?? 0}
          />
          <h2 className="text-lg font-semibold mb-2 text-center">Court Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentRoundViewData?.courts?.map((court, ci) => (
              <CourtCard
                key={court.id ?? ci}
                court={{
                  ...court,
                  courtNumber: ci + 1,
                }}
                players={players}
                editableScores={true}
                onScoreChange={handleScoreChange}
                roundNumber={roundIdx + 1}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <Button
            onClick={handleAdvanceRound}
            variant="secondary"
            disabled={
              (currentView !== 1 && currentView !== 2) || ongoingRoundNumber !== currentView
            }
          >
            Generate Next Round
          </Button>
          <Button onClick={resetAll} variant="secondary">
            Reset All
          </Button>
        </div>
        <ErrorBanner message={apiError ? String(apiError) : undefined} />
      </div>
    </div>
  );
};

export default EventNightAdmin;
