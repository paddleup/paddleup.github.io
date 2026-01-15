import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  Target,
  Search,
  UserPlus,
  Play,
  ArrowRight,
  CheckCircle,
  Edit3,
  Save,
  X,
  RotateCcw,
} from 'lucide-react';
import { useEvent, usePlayers } from '../hooks/firestoreHooks';
import { useAdmin } from '../hooks/useAdmin';
import { useChallengeEvent } from '../hooks/useChallengeEvent';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const decodedId = id ? decodeURIComponent(id) : '';
  const { data: event, isLoading: eventLoading } = useEvent(decodedId);
  const { data: players = [] } = usePlayers();
  const { isAdmin } = useAdmin();
  const challenge = useChallengeEvent(decodedId);

  // State for player selection
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);

  // State for score editing - simplified for auto-save
  const [editingScore, setEditingScore] = useState<{
    gameId: string;
    team: 'team1Score' | 'team2Score';
  } | null>(null);

  const formatNiceDate = (d?: Date | null) =>
    d
      ? d.toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : '';

  const formatNiceTime = (d?: Date | null) =>
    d ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

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

  const handleScoreInputChange = (
    gameId: string,
    team: 'team1Score' | 'team2Score',
    value: string,
  ) => {
    const score = parseInt(value);
    if (!isNaN(score) && score >= 0) {
      challenge.handleScoreChange(gameId, team, score);
    }
  };

  const startEditingScore = (gameId: string, team: 'team1Score' | 'team2Score') => {
    setEditingScore({ gameId, team });
  };

  const stopEditingScore = () => {
    setEditingScore(null);
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card variant="premium" padding="xl" className="max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-text-main mb-2">Loading Event</h2>
          <p className="text-text-muted">Please wait while we fetch the event details...</p>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card
          variant="gradient"
          theme="error"
          padding="xl"
          className="max-w-2xl w-full text-center"
        >
          <div className="text-6xl mb-6 opacity-50">❌</div>
          <h1 className="text-3xl font-black text-text-main mb-4">Event Not Found</h1>
          <p className="text-text-muted mb-8 leading-relaxed">
            The event ID{' '}
            <code className="bg-surface-alt px-2 py-1 rounded font-mono text-sm">
              {decodedId || '(empty)'}
            </code>{' '}
            does not match any scheduled event in our system.
          </p>
          <Link to="/schedule">
            <Button variant="primary" size="lg" icon={<ChevronLeft />} iconPosition="left">
              Back to Schedule
            </Button>
          </Link>
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
    <div className="space-y-8 pb-12 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <Link
          to="/schedule"
          className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-semibold"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Schedule</span>
        </Link>

        <Card variant="premium" padding="lg">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full shadow-lg mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-text-main mb-6">{event.name}</h1>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 p-3 bg-surface-alt/50 rounded-xl">
                <Calendar className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="text-xs text-text-muted uppercase">Date</div>
                  <div className="font-semibold text-sm">{formatNiceDate(event.startDateTime)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-alt/50 rounded-xl">
                <Clock className="h-5 w-5 text-success" />
                <div className="text-left">
                  <div className="text-xs text-text-muted uppercase">Time</div>
                  <div className="font-semibold text-sm">{formatNiceTime(event.startDateTime)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-alt/50 rounded-xl">
                <MapPin className="h-5 w-5 text-warning" />
                <div className="text-left">
                  <div className="text-xs text-text-muted uppercase">Location</div>
                  <div className="font-semibold text-sm truncate">{event.location || 'TBD'}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Admin Event Initialization */}
      {isAdmin && challenge.needsInitialization && (
        <Card variant="gradient" theme="primary" padding="lg">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full shadow-lg mb-4">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-text-main mb-2">Initialize Event</h2>
            <p className="text-text-muted">Select 8-35 players to start the event</p>
          </div>

          <div className="space-y-4">
            {/* Search */}
            <Input
              icon={<Search />}
              placeholder="Search players by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="premium"
            />

            {/* Selected Players Count */}
            <div className="text-center">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedPlayerIds.length >= 8 && selectedPlayerIds.length <= 35
                    ? 'bg-success/20 text-success'
                    : 'bg-warning/20 text-warning'
                }`}
              >
                {selectedPlayerIds.length} / 35 players selected
                {selectedPlayerIds.length < 8 && ' (minimum 8)'}
              </span>
            </div>

            {/* Player Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
              {filteredPlayers.map((player) => {
                const isSelected = selectedPlayerIds.includes(player.id || '');
                return (
                  <div
                    key={player.id}
                    onClick={() => handlePlayerToggle(player.id || '')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-border hover:border-primary/50 bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-primary bg-primary' : 'border-border'
                        }`}
                      >
                        {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-text-main">{player.name}</div>
                        {player.dupr && (
                          <div className="text-xs text-text-muted">DUPR: {player.dupr}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Initialize Button */}
            <div className="text-center pt-4">
              <Button
                variant="primary"
                size="lg"
                icon={<Play />}
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
        </Card>
      )}

      {/* Round Navigation */}
      {!challenge.needsInitialization && (
        <Card variant="flat" padding="sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[1, 2, 'standings'].map((stage) => {
                const isActive = challenge.currentView === stage;
                const isAvailable =
                  stage === 1 ||
                  (stage === 2 && challenge.round1) ||
                  (stage === 'standings' && challenge.round2);

                return (
                  <Button
                    key={stage}
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

            {/* Progress Indicator */}
            <div className="text-sm text-text-muted">
              Progress: {challenge.completedMatches}/{challenge.totalMatches} matches (
              {challenge.progressPercent}%)
            </div>
          </div>
        </Card>
      )}

      {/* Round Display */}
      {currentRound && (
        <div className="space-y-6">
          {/* Round Header */}
          <Card variant="gradient" theme="success" padding="md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-success/70 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-main">
                    Round {challenge.currentView} Courts
                  </h2>
                  <p className="text-text-muted text-sm">
                    {currentRound.courts.length} courts • Live scoring enabled
                  </p>
                </div>
              </div>

              {/* Admin Controls */}
              {isAdmin && (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<RotateCcw />}
                    onClick={challenge.resetAll}
                  >
                    Reset All
                  </Button>

                  {challenge.currentView === 1 && challenge.round1 && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<ArrowRight />}
                      onClick={handleAdvanceToRoundTwo}
                      disabled={
                        !challenge.round1.courts.every((court) =>
                          court.games.every(
                            (game) =>
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
                      icon={<Trophy />}
                      onClick={handleFinalizeEvent}
                      disabled={
                        !challenge.round2.courts.every((court) =>
                          court.games.every(
                            (game) =>
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
          </Card>

          {/* Courts Grid - Compact & Dense for Maximum Information */}
          <div className="grid grid-cols-1 gap-3">
            {currentRound.courts.map((court) => (
              <Card key={court.id} variant="premium" padding="sm" hover>
                <div className="space-y-3">
                  {/* Court Header - Compact */}
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="text-xl font-bold text-text-main">Court {court.courtNumber}</h3>
                    <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-lg font-semibold">
                      {court.games.length} games
                    </span>
                  </div>

                  {/* Games - Ultra Compact Layout */}
                  <div className="space-y-1">
                    {court.games.map((game, gameIndex) => {
                      const team1Player1 = players.find((p) => p.id === game.team1.player1Id);
                      const team1Player2 = players.find((p) => p.id === game.team1.player2Id);
                      const team2Player1 = players.find((p) => p.id === game.team2.player1Id);
                      const team2Player2 = players.find((p) => p.id === game.team2.player2Id);

                      return (
                        <div
                          key={game.id}
                          className="bg-surface-alt/20 rounded p-2 border border-border/20"
                        >
                          <div className="flex items-center justify-between">
                            {/* Team 1 - Ultra Compact */}
                            <div className="flex items-center gap-2 flex-1">
                              <div className="text-xs font-bold text-text-main min-w-0">
                                <div className="truncate">{team1Player1?.name || 'P1'}</div>
                                <div className="truncate">{team1Player2?.name || 'P2'}</div>
                              </div>
                              {/* Auto-Save Score Input */}
                              {editingScore?.gameId === game.id &&
                              editingScore?.team === 'team1Score' ? (
                                <input
                                  type="number"
                                  defaultValue={game.team1Score || ''}
                                  onChange={(e) =>
                                    handleScoreInputChange(game.id!, 'team1Score', e.target.value)
                                  }
                                  onBlur={stopEditingScore}
                                  className="w-10 px-1 py-1 text-sm font-bold border border-primary rounded bg-surface text-center"
                                  autoFocus
                                />
                              ) : (
                                <div
                                  className={`w-10 h-6 flex items-center justify-center bg-primary/10 border border-primary/30 rounded text-sm font-black cursor-pointer ${
                                    isAdmin ? 'hover:bg-primary/20' : ''
                                  }`}
                                  onClick={() =>
                                    isAdmin && startEditingScore(game.id!, 'team1Score')
                                  }
                                >
                                  {game.team1Score ?? '-'}
                                </div>
                              )}
                            </div>

                            {/* VS - Minimal */}
                            <div className="mx-2 text-xs font-bold text-text-muted">vs</div>

                            {/* Team 2 - Ultra Compact */}
                            <div className="flex items-center gap-2 flex-1 justify-end">
                              {/* Auto-Save Score Input */}
                              {editingScore?.gameId === game.id &&
                              editingScore?.team === 'team2Score' ? (
                                <input
                                  type="number"
                                  defaultValue={game.team2Score || ''}
                                  onChange={(e) =>
                                    handleScoreInputChange(game.id!, 'team2Score', e.target.value)
                                  }
                                  onBlur={stopEditingScore}
                                  className="w-10 px-1 py-1 text-sm font-bold border border-success rounded bg-surface text-center"
                                  autoFocus
                                />
                              ) : (
                                <div
                                  className={`w-10 h-6 flex items-center justify-center bg-success/10 border border-success/30 rounded text-sm font-black cursor-pointer ${
                                    isAdmin ? 'hover:bg-success/20' : ''
                                  }`}
                                  onClick={() =>
                                    isAdmin && startEditingScore(game.id!, 'team2Score')
                                  }
                                >
                                  {game.team2Score ?? '-'}
                                </div>
                              )}
                              <div className="text-xs font-bold text-text-main min-w-0 text-right">
                                <div className="truncate">{team2Player1?.name || 'P1'}</div>
                                <div className="truncate">{team2Player2?.name || 'P2'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Final Standings */}
      {challenge.currentView === 'standings' && event.standings && (
        <Card variant="gradient" theme="warning" padding="lg">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-warning to-warning/70 rounded-full shadow-lg mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-text-main mb-2">Final Standings</h2>
            <p className="text-text-muted">Official results from this event</p>
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            {event.standings.map((playerId: string, index: number) => {
              const player = players.find((p) => p.id === playerId);
              const medalColors = ['warning', 'text-accent', 'bronze'];
              const medals = ['🥇', '🥈', '🥉'];

              return (
                <div
                  key={playerId}
                  className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      index < 3
                        ? `bg-gradient-to-br from-${medalColors[index]} to-${medalColors[index]}/70 text-white`
                        : 'bg-surface-alt text-text-main'
                    }`}
                  >
                    <span className="font-bold text-lg">
                      {index < 3 ? medals[index] : `#${index + 1}`}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-text-main">
                      {player?.name || `Player ${playerId}`}
                    </div>
                    <div className="text-sm text-text-muted">
                      {index === 0
                        ? 'Champion'
                        : index === 1
                        ? 'Runner-up'
                        : index === 2
                        ? 'Third Place'
                        : `Position ${index + 1}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default EventPage;
