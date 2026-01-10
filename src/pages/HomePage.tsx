import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight, Users, Calendar, Star } from 'lucide-react';
// import { players } from '../data/players';
import { calculateWeekFinalPositions } from '../lib/leagueUtils';
import { useEvents, usePlayers } from '../hooks/firestoreHooks';
import Card from '../components/ui/Card';
import PlayerAvatar from '../components/ui/PlayerAvatar';
import RankBadge from '../components/ui/RankBadge';
import { Player } from '../types';

const HomePage: React.FC = () => {
  const { data: challengeEvents = [] } = useEvents();
  const { data: players = [] } = usePlayers();

  // Get top 3 players derived from challengeEvents (all-time)
  const topPlayers = React.useMemo(() => {
    const pointsByPlayer = new Map<string, number>();
    const eventsByPlayer = new Map<string, number>();
    const events = (challengeEvents || []).filter(
      (ev) => Array.isArray((ev as any).standings) && (ev as any).standings.length > 0,
    );

    events.forEach((ev) => {
      const weekLike = {
        id: ev.id,
        date: ev.startDateTime ? ev.startDateTime.toISOString() : ev.id,
        isCompleted: true,
        standings: (ev as any).standings,
      } as any;
      const finals = calculateWeekFinalPositions(weekLike) || [];
      finals.forEach((f: any) => {
        const pid = f.playerId;
        const pts = f.pointsEarned || 0;
        pointsByPlayer.set(pid, (pointsByPlayer.get(pid) || 0) + pts);
        eventsByPlayer.set(pid, (eventsByPlayer.get(pid) || 0) + 1);
      });
    });

    const rows = Array.from(pointsByPlayer.entries()).map(([playerId, points]) => ({
      playerId,
      points,
    }));
    rows.sort((a, b) => b.points - a.points);

    return rows.slice(0, 3).map((r, index) => ({
      playerId: r.playerId,
      points: r.points,
      events: eventsByPlayer.get(r.playerId) || 0,
      rank: index + 1,
    }));
  }, [challengeEvents]);

  const seriesLabel = (() => {
    const parsed = (challengeEvents || []).filter(
      (ev) => ev.startDateTime instanceof Date && !isNaN(ev.startDateTime.getTime()),
    );
    if (parsed.length === 0) return 'Challenge Series';
    const years = Array.from(new Set(parsed.map((ev) => ev.startDateTime.getFullYear()))).sort();
    return years.length === 1
      ? `${years[0]} Challenge`
      : `${years[0]}–${years[years.length - 1]} Challenge`;
  })();

  // Compute the next upcoming challenge event (players can register for)
  const nextEvent = React.useMemo(() => {
    if (!challengeEvents || challengeEvents.length === 0) return null;

    // Only keep events with a valid Date object
    const parsed = challengeEvents.filter(
      (ev) => ev.startDateTime instanceof Date && !isNaN(ev.startDateTime.getTime()),
    );

    // Sort by startDateTime ascending
    parsed.sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime());

    const now = new Date();
    // Use current moment (including time) to decide upcoming events
    const nowTs = now.getTime();

    // Find events that are now or in the future
    const upcoming = parsed.filter((p) => p.startDateTime.getTime() >= nowTs);

    if (upcoming.length > 0) return upcoming[0];
    // If none upcoming, return null (show nothing)
    return null;
  }, [challengeEvents]);

  const formatNiceDate = (d?: Date | null) =>
    d ? d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : '';

  const formatNiceTime = (d?: Date | null) =>
    d ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-surface border border-border">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-surface-highlight/50 rounded-full blur-3xl"></div>

        <div className="relative z-10 px-8 py-16 md:py-24 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-highlight border border-border mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-sm font-medium text-text-main">{seriesLabel} is Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-text-main mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Paddle Up
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-text-accent">
              Advanced Challenge
            </span>
          </h1>

          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Join our competitive pickleball event designed for advanced players looking to test
            their skills and climb the rankings each week.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link
              to="/standings"
              className="w-full sm:w-auto px-8 py-4 bg-primary text-text-main rounded-xl font-bold text-lg hover:bg-primary-hover transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
            >
              View Standings <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/format"
              className="w-full sm:w-auto px-8 py-4 bg-surface-highlight text-text-main border border-border rounded-xl font-bold text-lg hover:bg-surface-alt transition-all flex items-center justify-center gap-2"
            >
              League Format
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 flex flex-col items-center justify-center text-center hover:border-primary/30 transition-colors group">
          <Users className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-3xl font-bold text-text-main mb-1">16</span>
          <span className="text-sm text-text-muted uppercase tracking-wider">
            Players per night
          </span>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center text-center hover:border-primary/30 transition-colors group">
          <Calendar className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-3xl font-bold text-text-main mb-1">7-10 PM</span>
          <span className="text-sm text-text-muted uppercase tracking-wider">Every Sunday</span>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center text-center hover:border-primary/30 transition-colors group">
          <Trophy className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-3xl font-bold text-text-main mb-1">100</span>
          <span className="text-sm text-text-muted uppercase tracking-wider">
            Club Points Prize Pool
          </span>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center text-center hover:border-primary/30 transition-colors group">
          <Star className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-3xl font-bold text-text-main mb-1">3.6+ DUPR</span>
          <span className="text-sm text-text-muted uppercase tracking-wider">Level Format</span>
        </Card>
      </div>

      {/* Prizes Summary */}
      <div className="bg-surface-highlight/50 rounded-2xl p-8 border border-border text-center">
        <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center justify-center gap-2">
          <Trophy className="h-6 w-6 text-warning" />
          Monthly Prizes
        </h2>
        <p className="text-text-muted max-w-2xl mx-auto mb-6">
          At the end of each month, the top 3 players in the monthly standings will receive club
          points as rewards for their performance.
        </p>
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-surface p-4 rounded-xl border border-border">
            <span className="block text-2xl font-bold text-warning mb-1">1st Place</span>
            <span className="text-sm text-text-muted">50 Club Pts</span>
          </div>
          <div className="bg-surface p-4 rounded-xl border border-border">
            <span className="block text-2xl font-bold text-text-main mb-1">2nd Place</span>
            <span className="text-sm text-text-muted">30 Club Pts</span>
          </div>
          <div className="bg-surface p-4 rounded-xl border border-border">
            <span className="block text-2xl font-bold text-text-main mb-1">3rd Place</span>
            <span className="text-sm text-text-muted">20 Club Pts</span>
          </div>
        </div>
      </div>

      {/* Top Players Preview */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
              <Trophy className="h-6 w-6 text-warning" />
              Current Leaders
            </h2>
            <Link
              to="/standings"
              className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1"
            >
              Full Standings <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {topPlayers.map((entry: any, index: number) => {
              const player =
                players.find((p) => p.id === entry.playerId) ||
                ({ name: 'Unknown', imageUrl: '', id: 'unknown' } as any);
              return (
                <Link
                  key={entry.playerId}
                  to={`/player/${entry.playerId}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-highlight border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <RankBadge rank={index + 1} size="sm" />
                    <div className="flex items-center gap-3">
                      <PlayerAvatar
                        imageUrl={player.imageUrl}
                        name={player.name}
                        size="md"
                        className="group-hover:ring-2 ring-primary transition-all"
                      />
                      <span className="font-bold text-text-main group-hover:text-primary transition-colors">
                        {player.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-primary">{entry.points} pts</span>
                    <span className="text-xs text-text-muted">{entry.events} Events</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="h-full flex flex-col bg-gradient-to-br from-surface to-surface-highlight relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-text-main mb-4">Next Match Night</h2>

            {nextEvent ? (
              <div className="space-y-6">
                <div>
                  <p className="text-text-muted text-sm uppercase tracking-wider mb-1">Date</p>
                  <p className="text-xl font-bold text-text-main">
                    {formatNiceDate(nextEvent.startDateTime)}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-sm uppercase tracking-wider mb-1">Time</p>
                  <p className="text-xl font-bold text-text-main">
                    {formatNiceTime(nextEvent.startDateTime)}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-sm uppercase tracking-wider mb-1">Location</p>
                  <p className="text-xl font-bold text-text-main">{nextEvent.location}</p>
                </div>

                <div className="pt-4">
                  <a
                    href={nextEvent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-surface border border-border hover:border-primary/50 rounded-xl text-text-main font-bold transition-colors"
                  >
                    Register on CourtReserve
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-text-muted">
                  No upcoming match nights are listed. Check the full schedule for details.
                </p>
                <Link
                  to="/schedule"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-surface border border-border hover:border-primary/50 rounded-xl text-text-main font-bold transition-colors"
                >
                  View Schedule
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* How to Join */}
      <div className="bg-primary-light rounded-2xl p-8 md:p-12 text-center border border-primary/50">
        <h2 className="text-3xl font-bold text-text-main mb-4">Want to Join the League?</h2>
        <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
          We are always looking for competitive players to join the roster. Check out the format and
          rules to see if you qualify.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            to="/format"
            className="bg-primary text-text-main px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            View Format <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
