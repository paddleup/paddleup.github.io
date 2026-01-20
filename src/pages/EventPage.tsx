import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  Search,
  UserPlus,
  Play,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { useEvent, usePlayers } from '../hooks/firestoreHooks';
import { useAdmin } from '../hooks/useAdmin';
import { useChallengeEvent } from '../hooks/useChallengeEvent';
import { calculatePlayerRankings } from '../lib/challengeEventUtils';
import { getPointsForRank } from '../lib/points';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import {
  RoundRankingsPanel,
  CourtStatsPanel,
  MobileScoreInput,
  PlayerSearchFilter,
  PlayerAvatar,
} from '../components/ui';
import DetailCard from '../components/ui/DetailCard';
import TeamRow from '../components/ui/TeamRow';
import CourtCard from '../components/ui/CourtCard';
import PremiumSection from '../components/ui/PremiumSection';
import { formatNiceDate, formatNiceTime } from '../utils/format';
import RankBadge, { ordinal } from '../components/ui/RankBadge';
import LeaderboardTable, { LeaderboardRow } from '../components/LeaderboardTable';

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

        <PremiumSection primaryColor="primary" secondaryColor="success">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
              <Calendar className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-text-main mb-4">{event.name}</h1>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {/* Date */}
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl border border-primary/20">
              <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Date
                </div>
                <div className="font-bold text-text-main truncate">
                  {formatNiceDate(event.startDateTime)}
                </div>
              </div>
            </div>
            {/* Time */}
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-xl border border-success/20">
              <Clock className="h-5 w-5 text-success flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Time
                </div>
                <div className="font-bold text-text-main truncate">
                  {formatNiceTime(event.startDateTime)}
                </div>
              </div>
            </div>
            {/* Location */}
            <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-xl border border-warning/20 sm:col-span-2 lg:col-span-1">
              <MapPin className="h-5 w-5 text-warning flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Location
                </div>
                <div className="font-bold text-text-main truncate">{event.location ?? 'TBD'}</div>
              </div>
            </div>
          </div>
          {/* <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <DetailCard
              icon={<Calendar className="h-5 w-5 text-primary" />}
              label="Date"
              value={formatNiceDate(event.startDateTime)}
            />
            <DetailCard
              icon={<Clock className="h-5 w-5 text-success" />}
              label="Time"
              value={formatNiceTime(event.startDateTime)}
            />
            <DetailCard
              icon={<MapPin className="h-5 w-5 text-warning" />}
              label="Location"
              value={event.location || 'TBD'}
            />
          </div> */}
        </PremiumSection>
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
              placeholder="Search players by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        <div className="mb-6">
          {/* <PremiumSection primaryColor="primary" secondaryColor="surface"> */}
          <button
            // onClick={() => setIsExpanded(!isExpanded)}
            className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30 rounded-xl p-4 hover:bg-primary/15 transition-all duration-200"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
              <div className="text-sm text-text-muted">
                Progress: {challenge.completedMatches}/{challenge.totalMatches} matches (
                {challenge.progressPercent}%)
              </div>
            </div>
            {/* </PremiumSection> */}
          </button>
        </div>
      )}

      {/* Player Search */}
      {!challenge.needsInitialization && currentRound && (
        <PlayerSearchFilter
          players={players.filter((p) =>
            currentRound.courts.some((court) => court.playerIds.includes(p.id || '')),
          )}
          onPlayerSelect={(playerId) => {
            setHighlightedPlayerId(playerId);
            // Scroll to the court containing this player
            const court = currentRound.courts.find((c) => c.playerIds.includes(playerId));
            if (court) {
              const courtElement = document.getElementById(`court-${court.id}`);
              if (courtElement) {
                courtElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }
          }}
          onClear={() => setHighlightedPlayerId(null)}
          placeholder="Find a player on the courts..."
          className="mb-6"
        />
      )}

      {/* Round Display */}
      {currentRound && (
        <div className="space-y-6">
          {/* Round Rankings Panel */}
          {(() => {
            const playerRankings = calculatePlayerRankings(
              currentRound.courts,
              challenge.currentView as 1 | 2,
            );
            const previousRoundRankings =
              challenge.currentView === 2 && challenge.round1
                ? calculatePlayerRankings(challenge.round1.courts, 1)
                : undefined;

            // Only count games for the current round
            const roundGames = currentRound.courts.flatMap((court) =>
              court.games.filter((g) => g.roundNumber === challenge.currentView),
            );
            const completedRoundGames = roundGames.filter(
              (g) => g.team1Score !== undefined && g.team2Score !== undefined,
            ).length;

            return (
              <RoundRankingsPanel
                roundNumber={challenge.currentView as number}
                playerRankings={playerRankings}
                players={players}
                completedGames={completedRoundGames}
                totalGames={roundGames.length}
                previousRoundRankings={previousRoundRankings}
              />
            );
          })()}
          {/* Round Header */}
          <Card variant="gradient" theme="success" padding="sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-success to-success/70 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-text-main">Round {challenge.currentView} Courts</h2>
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

          {/* Mobile-Optimized Courts Grid */}
          <div className="grid grid-cols-1 gap-4">
            {currentRound.courts.map((court) => (
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
        <LeaderboardTable
          data={event.standings.map((playerId: string, index: number) => ({
            playerId,
            rank: index + 1,
            points: getPointsForRank(index + 1),
          }))}
          players={players}
          showEvents={false}
          showPoints={true}
          className="rounded-xl border border-border"
          pointsRenderer={(_row: LeaderboardRow, _player, index: number) => (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-1 text-l font-bold text-success">
                <Plus className="h-5 w-5" />
                {getPointsForRank(index + 1).toLocaleString()}
              </div>
              <div className="text-sm text-text-muted">points</div>
            </div>
          )}
          rowClassName={(_row: LeaderboardRow, index: number) =>
            index === 0
              ? 'bg-warning/5 hover:bg-warning/10'
              : index === 1
              ? 'bg-text-accent/5 hover:bg-text-accent/10'
              : index === 2
              ? 'bg-bronze/5 hover:bg-bronze/10'
              : 'hover:bg-surface-highlight'
          }
        />
      )}
    </div>
  );
};

export default EventPage;
