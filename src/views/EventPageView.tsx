import {
  Calendar,
  MapPin,
  Trophy,
  Play,
  ArrowRight,
  CheckCircle,
  Plus,
  Clock,
  Search,
  Target,
} from 'lucide-react';
import { Button, Card, Input, Badge, Avatar, EmptyState, Spinner } from '../components/ui';
import { formatNiceDate, formatNiceTime } from '../utils/format';

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
  setHighlightedPlayerId?: React.Dispatch<React.SetStateAction<string | null>>;
  filteredPlayers: any[];
  handlePlayerToggle: (playerId: string) => void;
  handleInitializeRound: () => void;
  handleAdvanceToRoundTwo: () => void;
  handleFinalizeEvent: () => void;
  calculatePlayerRankings?: (courts: any[], roundNumber: 1 | 2) => any[];
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
  setHighlightedPlayerId: _setHighlightedPlayerId,
  filteredPlayers,
  handlePlayerToggle,
  handleInitializeRound,
  handleAdvanceToRoundTwo,
  handleFinalizeEvent,
  calculatePlayerRankings: _calculatePlayerRankings,
  getPointsForRank,
}) => {
  // Loading state
  if (eventLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  // Event not found
  if (!event) {
    return (
      <EmptyState
        icon={Calendar}
        title="Event Not Found"
        description="This event doesn't exist or has been removed"
        action={{
          label: 'View Schedule',
          onClick: () => window.location.href = '/schedule',
        }}
      />
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
      {/* Event Header */}
      <Card>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {event.name}
        </h1>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600 dark:text-slate-400">
              {formatNiceDate(event.startDateTime)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600 dark:text-slate-400">
              {formatNiceTime(event.startDateTime)}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">{event.location}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Admin Event Initialization */}
      {isAdmin && challenge.needsInitialization && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Initialize Event
          </h2>
          <Card>
            <div className="space-y-4">
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />

              <div className="text-center py-2">
                <Badge variant={selectedPlayerIds.length >= 8 ? 'success' : 'warning'}>
                  {selectedPlayerIds.length} players selected
                  {selectedPlayerIds.length < 8 && ' (min 8)'}
                </Badge>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 max-h-64 overflow-y-auto">
                {filteredPlayers.map((player) => {
                  const isSelected = selectedPlayerIds.includes(player.id || '');
                  return (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => handlePlayerToggle(player.id || '')}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${
                          isSelected
                            ? 'bg-primary-600'
                            : 'border-2 border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {player.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <Button
                className="w-full"
                onClick={handleInitializeRound}
                disabled={selectedPlayerIds.length < 8 || selectedPlayerIds.length > 35 || isInitializing}
                loading={isInitializing}
              >
                <Play className="w-4 h-4" />
                Start Round 1
              </Button>
            </div>
          </Card>
        </section>
      )}

      {/* Round Navigation */}
      {!challenge.needsInitialization && (
        <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1">
          {[1, 2, 'standings'].map((stage) => {
            const isActive = challenge.currentView === stage;
            const isAvailable =
              stage === 1 ||
              (stage === 2 && challenge.round1) ||
              (stage === 'standings' && challenge.round2);

            return (
              <button
                key={String(stage)}
                type="button"
                onClick={() => challenge.setCurrentView(stage as any)}
                disabled={!isAvailable}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                  isActive
                    ? 'bg-primary-600 text-white dark:bg-primary-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {stage === 'standings' ? 'Results' : `Round ${stage}`}
              </button>
            );
          })}
        </div>
      )}

      {/* Progress */}
      {!challenge.needsInitialization && currentRound && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            {challenge.completedMatches} of {challenge.totalMatches} matches
          </span>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {challenge.progressPercent}%
          </span>
        </div>
      )}

      {/* Courts Display */}
      {currentRound && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Round {challenge.currentView} Courts
            </h2>
            {isAdmin && (
              <div className="flex gap-2">
                {challenge.currentView === 1 && (
                  <Button
                    size="small"
                    onClick={handleAdvanceToRoundTwo}
                    disabled={challenge.progressPercent < 100}
                  >
                    <ArrowRight className="w-4 h-4" />
                    Round 2
                  </Button>
                )}
                {challenge.currentView === 2 && (
                  <Button
                    size="small"
                    onClick={handleFinalizeEvent}
                    disabled={challenge.progressPercent < 100}
                  >
                    <Trophy className="w-4 h-4" />
                    Finalize
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {currentRound.courts.map((court: any, courtIndex: number) => (
              <Card key={court.id} id={`court-${court.id}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Court {courtIndex + 1}
                  </h3>
                  <Badge>{court.playerIds.length} players</Badge>
                </div>
                
                {/* Game format indicator */}
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {court.playerIds.length === 5 ? (
                    <span>First to 11, win by 1</span>
                  ) : (
                    <span>First to 15, win by 1</span>
                  )}
                </div>

                {/* Players on this court */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {court.playerIds.map((playerId: string) => {
                    const player = players.find((p) => p.id === playerId);
                    return (
                      <div
                        key={playerId}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1 text-sm ${
                          highlightedPlayerId === playerId
                            ? 'bg-primary-100 dark:bg-primary-900/30'
                            : 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        <Avatar
                          src={player?.imageUrl}
                          displayName={player?.name}
                          userId={playerId}
                          size="small"
                        />
                        <span className="text-slate-700 dark:text-slate-300">
                          {player?.name || 'Unknown'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Games */}
                <div className="space-y-2">
                  {court.games
                    .filter((g: any) => g.roundNumber === challenge.currentView)
                    .map((game: any, gameIndex: number) => {
                      const team1Player1 = players.find((p) => p.id === game.team1.player1Id);
                      const team1Player2 = players.find((p) => p.id === game.team1.player2Id);
                      const team2Player1 = players.find((p) => p.id === game.team2.player1Id);
                      const team2Player2 = players.find((p) => p.id === game.team2.player2Id);
                      const _hasScore = game.team1Score !== undefined && game.team2Score !== undefined;

                      return (
                        <div
                          key={game.id || gameIndex}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 p-3"
                        >
                          <div className="flex items-center justify-between">
                            {/* Team 1 */}
                            <div className="flex-1 text-right pr-3">
                              <div className="text-sm text-slate-700 dark:text-slate-300">
                                {team1Player1?.name?.split(' ')[0]} &amp; {team1Player2?.name?.split(' ')[0]}
                              </div>
                            </div>

                            {/* Score */}
                            <div className="flex items-center gap-2 px-3">
                              {isAdmin ? (
                                <>
                                  <input
                                    type="number"
                                    min="0"
                                    max="21"
                                    className="w-12 h-8 text-center rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    value={game.team1Score ?? ''}
                                    onChange={(e) =>
                                      challenge.handleScoreChange(game.id, 'team1Score', parseInt(e.target.value) || 0)
                                    }
                                  />
                                  <span className="text-slate-400">-</span>
                                  <input
                                    type="number"
                                    min="0"
                                    max="21"
                                    className="w-12 h-8 text-center rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    value={game.team2Score ?? ''}
                                    onChange={(e) =>
                                      challenge.handleScoreChange(game.id, 'team2Score', parseInt(e.target.value) || 0)
                                    }
                                  />
                                </>
                              ) : (
                                <span className="font-bold text-slate-900 dark:text-slate-100">
                                  {game.team1Score ?? '-'} - {game.team2Score ?? '-'}
                                </span>
                              )}
                            </div>

                            {/* Team 2 */}
                            <div className="flex-1 text-left pl-3">
                              <div className="text-sm text-slate-700 dark:text-slate-300">
                                {team2Player1?.name?.split(' ')[0]} &amp; {team2Player2?.name?.split(' ')[0]}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Final Standings */}
      {challenge.currentView === 'standings' && event.standings && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Final Standings
          </h2>
          <Card>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {event.standings.map((playerId: string, index: number) => {
                const player = players.find((p) => p.id === playerId);
                const rank = index + 1;
                const points = getPointsForRank(rank);

                return (
                  <div
                    key={playerId}
                    className="flex items-center justify-between py-3 -mx-4 px-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                          rank === 1
                            ? 'bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300'
                            : rank === 2
                              ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                              : rank === 3
                                ? 'bg-orange-200 dark:bg-orange-800/50 text-orange-700 dark:text-orange-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {rank}
                      </span>
                      <Avatar
                        src={player?.imageUrl}
                        displayName={player?.name}
                        userId={playerId}
                        size="default"
                      />
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {player?.name || 'Unknown'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                        <Plus className="w-4 h-4" />
                        {points.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">points</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>
      )}
    </div>
  );
};

export default EventPageView;