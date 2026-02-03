import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Trophy,
  Users,
  UserPlus,
  Play,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  Plus,
  Clock,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  Input,
  Heading,
  Badge,
  RoundRankingsPanel,
  PlayerSearchFilter,
} from '../components/ui';
import CourtCard from '../components/ui/CourtCard';
import { formatNiceDate, formatNiceTime } from '../utils/format';
import LeaderboardTable, { LeaderboardRow } from '../components/LeaderboardTable';

type EventPageProps = {
  event: any;
  eventLoading: boolean;
  players: any[];
  isAdmin: boolean;
  challenge: any;
  selectedPlayerIds: string[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  isInitializing: boolean;
  highlightedPlayerId: string | null;
  setHighlightedPlayerId: React.Dispatch<React.SetStateAction<string | null>>;
  filteredPlayers: any[];
  handlePlayerToggle: (playerId: string) => void;
  handleInitializeRound: () => void;
  handleAdvanceToRoundTwo: () => void;
  handleFinalizeEvent: () => void;
  calculatePlayerRankings: (courts: any[], roundNumber: 1 | 2) => any[];
  getPointsForRank: (rank: number, halfEvery?: 2 | 3 | 5) => number;
};

const EventPageView: React.FC<EventPageProps> = ({
  event,
  eventLoading,
  players,
  isAdmin,
  challenge,
  selectedPlayerIds,
  searchTerm,
  setSearchTerm,
  isInitializing,
  highlightedPlayerId,
  setHighlightedPlayerId,
  filteredPlayers,
  handlePlayerToggle,
  handleInitializeRound,
  handleAdvanceToRoundTwo,
  handleFinalizeEvent,
  calculatePlayerRankings,
  getPointsForRank,
}) => {
  // Loading state
  if (eventLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="max-w-md text-center">
          <CardContent className="py-12">
            <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-border border-t-accent"></div>
            <h2 className="text-xl font-semibold text-fg mb-2">Loading Event</h2>
            <p className="text-fg-muted">Please wait while we fetch the event details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Event not found
  if (!event) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="max-w-lg text-center">
          <CardContent className="py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error-subtle">
              <span className="text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-fg mb-2">Event Not Found</h1>
            <p className="text-fg-muted mb-6">
              The event ID{' '}
              <code className="rounded bg-bg-muted px-2 py-1 font-mono text-sm">
                {challenge?.eventId || '(empty)'}
              </code>{' '}
              does not match any scheduled event.
            </p>
            <Link to="/schedule">
              <Button variant="primary" icon={<ChevronLeft className="h-4 w-4" />}>
                Back to Schedule
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentRound =
    challenge.currentView === 1
      ? challenge.round1
      : challenge.currentView === 2
      ? challenge.round2
      : null;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/schedule"
        className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Schedule
      </Link>

      {/* Event Header */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-subtle">
              <Calendar className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-fg">{event.name}</h1>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Calendar className="h-4 w-4 text-fg-muted" />
              <div>
                <div className="text-xs text-fg-muted">Date</div>
                <div className="font-medium text-fg">{formatNiceDate(event.startDateTime)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Clock className="h-4 w-4 text-fg-muted" />
              <div>
                <div className="text-xs text-fg-muted">Time</div>
                <div className="font-medium text-fg">{formatNiceTime(event.startDateTime)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <MapPin className="h-4 w-4 text-fg-muted" />
              <div>
                <div className="text-xs text-fg-muted">Location</div>
                <div className="font-medium text-fg">{event.location ?? 'TBD'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Event Initialization */}
      {isAdmin && challenge.needsInitialization && (
        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-subtle">
                <UserPlus className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-fg">Initialize Event</h2>
                <p className="text-sm text-fg-muted">Select 8-35 players to start</p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Search players by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="text-center">
                <Badge
                  variant={
                    selectedPlayerIds.length >= 8 && selectedPlayerIds.length <= 35
                      ? 'success'
                      : 'warning'
                  }
                >
                  {selectedPlayerIds.length} / 35 players selected
                  {selectedPlayerIds.length < 8 && ' (minimum 8)'}
                </Badge>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 max-h-80 overflow-y-auto">
                {filteredPlayers.map((player) => {
                  const isSelected = selectedPlayerIds.includes(player.id || '');
                  return (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => handlePlayerToggle(player.id || '')}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                        isSelected
                          ? 'border-accent bg-accent-subtle'
                          : 'border-border hover:bg-bg-subtle'
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          isSelected ? 'border-accent bg-accent' : 'border-border'
                        }`}
                      >
                        {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-fg truncate">{player.name}</div>
                        {player.dupr && (
                          <div className="text-xs text-fg-muted">DUPR: {player.dupr}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-center pt-4">
                <Button
                  variant="primary"
                  icon={<Play className="h-4 w-4" />}
                  onClick={handleInitializeRound}
                  disabled={
                    selectedPlayerIds.length < 8 || selectedPlayerIds.length > 35 || isInitializing
                  }
                  loading={isInitializing}
                >
                  Initialize Round 1
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Round Navigation */}
      {!challenge.needsInitialization && (
        <Card padding="sm">
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                {[1, 2, 'standings'].map((stage) => {
                  const isActive = challenge.currentView === stage;
                  const isAvailable =
                    stage === 1 ||
                    (stage === 2 && challenge.round1) ||
                    (stage === 'standings' && challenge.round2);

                  return (
                    <Button
                      key={String(stage)}
                      variant={isActive ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => challenge.setCurrentView(stage as any)}
                      disabled={!isAvailable}
                    >
                      {stage === 'standings' ? 'Final Standings' : `Round ${stage}`}
                    </Button>
                  );
                })}
              </div>
              <div className="text-sm text-fg-muted">
                {challenge.completedMatches}/{challenge.totalMatches} matches (
                {challenge.progressPercent}%)
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Player Search */}
      {!challenge.needsInitialization && currentRound && (
        <PlayerSearchFilter
          players={players.filter((p) =>
            currentRound.courts.some((court: any) => court.playerIds.includes(p.id || '')),
          )}
          onPlayerSelect={(playerId) => {
            setHighlightedPlayerId(playerId);
            const court = currentRound.courts.find((c: any) => c.playerIds.includes(playerId));
            if (court) {
              const courtElement = document.getElementById(`court-${court.id}`);
              courtElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          onClear={() => setHighlightedPlayerId(null)}
          placeholder="Find a player on the courts..."
          className="mb-4"
        />
      )}

      {/* Round Display */}
      {currentRound && (
        <div className="space-y-4">
          {/* Round Rankings Panel */}
          {(() => {
            const playerRankings = calculatePlayerRankings(
              currentRound.courts,
              challenge.currentView as 1 | 2,
            );

            const roundGames = currentRound.courts.flatMap((court: any) =>
              court.games.filter((g: any) => g.roundNumber === challenge.currentView),
            );
            const completedRoundGames = roundGames.filter(
              (g: any) => g.team1Score !== undefined && g.team2Score !== undefined,
            ).length;

            return (
              <RoundRankingsPanel
                roundNumber={challenge.currentView as number}
                playerRankings={playerRankings}
                players={players}
                completedGames={completedRoundGames}
                totalGames={roundGames.length}
              />
            );
          })()}

          {/* Round Header with Admin Controls */}
          <Card padding="sm">
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-subtle">
                    <Users className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-fg">Round {challenge.currentView} Courts</h2>
                    <p className="text-sm text-fg-muted">{currentRound.courts.length} courts</p>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<RotateCcw className="h-4 w-4" />}
                      onClick={challenge.resetAll}
                    >
                      Reset
                    </Button>

                    {challenge.currentView === 1 && challenge.round1 && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<ArrowRight className="h-4 w-4" />}
                        iconPosition="right"
                        onClick={handleAdvanceToRoundTwo}
                        disabled={
                          !challenge.round1.courts.every((court: any) =>
                            court.games.every(
                              (game: any) =>
                                game.team1Score !== undefined && game.team2Score !== undefined,
                            ),
                          )
                        }
                      >
                        Advance to Round 2
                      </Button>
                    )}

                    {challenge.currentView === 2 && challenge.round2 && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<Trophy className="h-4 w-4" />}
                        onClick={handleFinalizeEvent}
                        disabled={
                          !challenge.round2.courts.every((court: any) =>
                            court.games.every(
                              (game: any) =>
                                game.team1Score !== undefined && game.team2Score !== undefined,
                            ),
                          )
                        }
                      >
                        Finalize Event
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Courts Grid */}
          <div className="grid gap-4">
            {currentRound.courts.map((court: any) => (
              <CourtCard
                key={court.id}
                court={court}
                players={players}
                roundNumber={challenge.currentView as 1 | 2}
                highlightedPlayerId={highlightedPlayerId}
                isAdmin={isAdmin}
                handleScoreChange={challenge.handleScoreChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Final Standings */}
      {challenge.currentView === 'standings' && event.standings && (
        <Card>
          <CardContent>
            <Heading as="h2">Final Standings</Heading>
            <LeaderboardTable
              data={event.standings.map((playerId: string, index: number) => ({
                playerId,
                rank: index + 1,
                points: getPointsForRank(index + 1),
              }))}
              players={players}
              showEvents={false}
              showPoints={true}
              className="rounded-lg border border-border"
              pointsRenderer={(_row: LeaderboardRow, _player, index: number) => (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 font-semibold text-success">
                    <Plus className="h-4 w-4" />
                    {getPointsForRank(index + 1).toLocaleString()}
                  </div>
                  <div className="text-xs text-fg-muted">points</div>
                </div>
              )}
              rowClassName={(_row: LeaderboardRow, index: number) =>
                index === 0
                  ? 'bg-warning-subtle'
                  : index === 1
                  ? 'bg-bg-muted'
                  : index === 2
                  ? 'bg-bg-subtle'
                  : ''
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventPageView;
