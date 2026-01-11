// src/pages/EventNightAdmin.tsx
import React, { useState, useMemo } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import type { Court } from '../types';

import { useChallengeEvent } from '../hooks/useChallengeEvent';
type Round = { courts: Court[] };
/** Returns ordinal string for a number (e.g. 1 -> "1st") */
function ordinal(n: number) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
import Button from '../components/ui/Button';
import RoundTabs from '../components/ui/RoundTabs';
import { usePlayers } from '../hooks/firestoreHooks';

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

  const { data: players = [] } = usePlayers();

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
          <label className="block text-sm font-medium">Select Event</label>
          <select
            value={selectedEventId ?? ''}
            onChange={(e) => setSelectedEventId(e.target.value || undefined)}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="">(select an event)</option>
            {events?.map((ev: any) => (
              <option key={ev.id} value={ev.id}>
                {ev.name ?? ev.id}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <RoundTabs current={currentView} onSelect={setCurrentView} showInitialize />
          {currentView === 'initial' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium">Number of Courts</label>
                <select
                  value={numCourts}
                  onChange={(e) => setNumCourts(Number(e.target.value))}
                  className="mt-1 block w-full border rounded px-2 py-1"
                >
                  {[2, 3, 4, 5, 6, 7].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Select Players</label>
                <div className="grid grid-cols-2 gap-2">
                  {players.map((p) => (
                    <label key={p.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPlayers.includes(p.id ?? '')}
                        onChange={(e) => {
                          setSelectedPlayers((prev) =>
                            e.target.checked
                              ? [...prev, p.id ?? '']
                              : prev.filter((id) => id !== p.id),
                          );
                        }}
                      />
                      {p.name} ({allTimeStats[p.id ?? ''] ?? 0} pts)
                    </label>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => {
                  try {
                    handleAssignCourts();
                  } catch (err: any) {
                    alert(err.message);
                  }
                }}
                className="mb-4"
                disabled={selectedPlayers.length !== numCourts * 4}
              >
                Assign Courts (Snake Draw)
              </Button>
              <div className="text-xs text-error mb-2">
                {selectedPlayers.length !== numCourts * 4
                  ? `Select exactly ${numCourts * 4} players for ${numCourts} courts`
                  : ''}
              </div>
            </>
          )}
          <div className="bg-surface p-3 rounded-lg border border-border max-w-md mx-auto mb-6">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-muted font-medium">Round Progress</span>
              <span className="text-primary font-bold">
                {currentRoundViewData?.courts.reduce(
                  (acc, court) =>
                    acc +
                    (court.games.filter(
                      (m) => m.team1Score !== undefined && m.team2Score !== undefined,
                    ).length ?? 0),
                  0,
                )}{' '}
                / {(currentRoundViewData?.courts?.length ?? 0) * 3} Matches
              </span>
            </div>
            <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{
                  width: `${
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
                  }%`,
                }}
              />
            </div>
            <div className="text-[10px] text-text-muted mt-1 text-center">
              {(currentRoundViewData?.courts.length ?? 0) * 4} Players •{' '}
              {currentRoundViewData?.courts?.length ?? 0} Courts
            </div>
          </div>
          <h2 className="text-lg font-semibold mb-2 text-center">Court Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentRoundViewData?.courts?.map((court, ci) => {
              return (
                <div
                  key={ci}
                  className="p-0 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300 border-t-4 border-primary bg-surface rounded shadow-lg"
                >
                  <div className="p-6 border-b border-border bg-surface-highlight/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <span className="font-bold text-primary">Court {ci + 1}</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-text-main">Court {ci + 1}</h2>
                        <p className="text-sm text-text-muted">Round {roundIdx + 1}</p>
                        <span className="inline-block mt-1 text-xs font-semibold text-accent bg-surface-alt/60 rounded px-2 py-0.5">
                          Tier: {court.tier}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider">
                        Players
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {court.playerIds.map((id, i) => {
                          const player = players.find((p) => p.id === id);
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-3 bg-surface-alt/30 p-2 rounded-lg border border-transparent focus-within:border-primary/30 transition-colors"
                            >
                              <div className="w-8 text-xs text-text-muted font-mono font-bold">
                                P{i + 1}
                              </div>
                              <div className="flex-1">{player?.name ?? 'Unknown'}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-warning uppercase tracking-wider">
                        Matches
                      </div>
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        {court.games
                          .filter((g) => g.courtId === court.id)
                          .map((game, gameIndex) => (
                            <div
                              key={gameIndex}
                              className={`rounded-xl p-4 border transition-all duration-300 ${
                                game.team1Score !== undefined && game.team2Score !== undefined
                                  ? 'bg-success/5 border-success/30 shadow-sm'
                                  : 'bg-surface-alt/50 border-border hover:border-warning/30'
                              }`}
                            >
                              <div className="flex justify-center mb-3">
                                <div
                                  className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                                    game.team1Score !== undefined && game.team2Score !== undefined
                                      ? 'bg-success/20 text-success'
                                      : 'bg-surface text-text-muted'
                                  }`}
                                >
                                  Match {gameIndex + 1}
                                </div>
                              </div>
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium truncate pr-2 w-2/3">
                                    Team 1
                                  </span>
                                  <div className="w-20">
                                    <input
                                      type="number"
                                      min={0}
                                      max={11}
                                      value={game.team1Score ?? ''}
                                      onChange={(e) =>
                                        handleScoreChange(
                                          game.id!,
                                          'team1Score',
                                          Number(e.target.value),
                                        )
                                      }
                                      className="w-full bg-surface border border-border rounded px-2 py-1.5 text-center text-sm font-bold focus:ring-2 ring-warning/50 outline-none"
                                      placeholder="Team 1"
                                    />
                                  </div>
                                </div>
                                <div className="relative flex items-center py-1">
                                  <div className="flex-grow border-t border-border" />
                                  <span className="flex-shrink-0 mx-2 text-[10px] font-bold text-text-muted uppercase">
                                    VS
                                  </span>
                                  <div className="flex-grow border-t border-border" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium truncate pr-2 w-2/3">
                                    Team 2
                                  </span>
                                  <div className="w-20">
                                    <input
                                      type="number"
                                      min={0}
                                      max={11}
                                      value={game.team2Score ?? ''}
                                      onChange={(e) =>
                                        handleScoreChange(
                                          game.id!,
                                          'team2Score',
                                          Number(e.target.value),
                                        )
                                      }
                                      className="w-full bg-surface border border-border rounded px-2 py-1.5 text-center text-sm font-bold focus:ring-2 ring-warning/50 outline-none"
                                      placeholder="Team 2"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
        {apiError && <p className="text-sm text-red-600 mt-2">Error saving: {String(apiError)}</p>}
      </div>
    </div>
  );
};

export default EventNightAdmin;
