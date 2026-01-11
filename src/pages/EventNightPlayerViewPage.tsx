import React from 'react';
import { useChallengeEvent } from '../hooks/useChallengeEvent';
import { Player } from '../types';
import RoundTabs from '../components/ui/RoundTabs';
import { usePlayers } from '../hooks/firestoreHooks';

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

  const { data: players = [] } = usePlayers();

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
        <label className="block text-sm font-medium">Select Event</label>
        <select
          value={selectedEventId ?? ''}
          onChange={(e) => setSelectedEventId(e.target.value || undefined)}
          className="mt-1 block w-full border rounded px-2 py-1 bg-surface-alt"
        >
          <option value="">(select an event)</option>
          {(events ?? []).map((ev: any) => (
            <option key={ev.id} value={ev.id}>
              {ev.name ?? ev.id}
            </option>
          ))}
        </select>
      </div>
      <RoundTabs current={currentView} onSelect={setCurrentView} />

      {currentRoundViewData?.courts ? (
        <>
          <div className="bg-surface p-3 rounded-lg border border-border max-w-md mx-auto mb-6">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-muted font-medium">Round Progress</span>
              <span className="text-primary font-bold">
                {completedMatches} / {totalMatches} Matches
              </span>
            </div>
            <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>
            <div className="text-[10px] text-text-muted mt-1 text-center">
              {(currentRoundViewData.courts.length ?? 0) * 4} Players •{' '}
              {currentRoundViewData.courts.length ?? 0} Courts
            </div>
          </div>
          <h2 className="text-lg font-semibold mb-2 text-center">Court Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentRoundViewData.courts.map((court) => {
              return (
                <div
                  key={court.courtNumber}
                  className="p-0 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300 border-t-4 border-primary bg-surface rounded shadow-lg"
                >
                  <div className="p-6 border-b border-border bg-surface-highlight/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <span className="font-bold text-primary">Court {court.courtNumber}</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-text-main">
                          Court {court.courtNumber}
                        </h2>
                        <p className="text-sm text-text-muted">
                          Round {(currentView as number) + 1}
                        </p>
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
                          const player = players.find((p: Player) => p.id === id);
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-3 bg-surface-alt/30 p-2 rounded-lg border border-transparent transition-colors"
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
                        {court.games.map((m, mi) => (
                          <div
                            key={mi}
                            className={`rounded-xl p-4 border transition-all duration-300 ${
                              m.team1Score !== undefined && m.team2Score !== undefined
                                ? 'bg-success/5 border-success/30 shadow-sm'
                                : 'bg-surface-alt/50 border-border'
                            }`}
                          >
                            <div className="flex justify-center mb-3">
                              <div
                                className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                                  m.team1Score !== undefined && m.team2Score !== undefined
                                    ? 'bg-success/20 text-success'
                                    : 'bg-surface text-text-muted'
                                }`}
                              >
                                Match {mi + 1}
                              </div>
                            </div>
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium truncate pr-2 w-2/3">
                                  Team 1
                                </span>
                                <span className="px-2 py-1 rounded bg-success/10 text-success font-bold w-16 text-center">
                                  {m.team1Score ?? '-'}
                                </span>
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
                                <span className="px-2 py-1 rounded bg-error/10 text-error font-bold w-16 text-center">
                                  {m.team2Score ?? '-'}
                                </span>
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
