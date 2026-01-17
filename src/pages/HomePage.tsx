import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight, Users, Calendar, Target, ExternalLink, Clock } from 'lucide-react';
// import { players } from '../data/players';
import { calculateWeekFinalPositions } from '../lib/leagueUtils';
import { useEvents, usePlayers } from '../hooks/firestoreHooks';
import PlayerAvatar from '../components/ui/PlayerAvatar';
import PremiumSection from '../components/ui/PremiumSection';
import SectionHeader from '../components/ui/SectionHeader';
import StatsCard from '../components/ui/StatsCard';
import { FeatureCard } from '../components/ui';
import SeasonOverview from '../components/ui/SeasonOverview';

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
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-primary/5 via-surface to-text-accent/5 rounded-3xl p-8 md:p-12 border border-primary/20 shadow-2xl">
          {/* Header with animated icon */}
          <div className="text-center mb-8">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="text-sm font-semibold text-success">{seriesLabel} is Live</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-text-main mb-6 tracking-tight leading-tight">
              Paddle Up
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-text-accent">
                Premier League
              </span>
            </h1>

            <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our competitive pickleball league designed for advanced players looking to test
              their skills and climb the rankings each week.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/standings"
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105"
              >
                View Standings <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/format"
                className="bg-surface border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2"
              >
                League Format
              </Link>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-text-accent/10 to-transparent rounded-full blur-2xl -z-10"></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-success/5 rounded-full blur-xl -z-10"></div>
        </div>
      </div>

      {/* League Stats */}
      <PremiumSection primaryColor="primary" secondaryColor="success">
        <SectionHeader
          icon={Users}
          title="League Overview"
          subtitle="Weekly competitive action with structured format and player advancement"
          iconColor="primary"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            emoji="👥"
            title="Players"
            value="16"
            description="per night"
            color="primary"
          />

          <StatsCard
            emoji="📅"
            title="Schedule"
            value="7-10 PM"
            description="Every Sunday"
            color="success"
          />

          <StatsCard
            emoji="🏆"
            title="Prize Pool"
            value="100"
            description="Club Points"
            color="warning"
          />

          <StatsCard
            emoji="⭐"
            title="Level"
            value="3.5+ DUPR"
            description="Required"
            color="text-accent"
          />
        </div>
      </PremiumSection>

      {/* Season Overview */}
      <SeasonOverview />

      {/* Current Leaders & Next Event */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Current Leaders */}
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-success/10 via-surface to-text-accent/10 rounded-3xl p-8 md:p-10 border border-success/20 shadow-2xl h-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-success to-success/70 rounded-full shadow-lg mb-4 transform hover:scale-110 transition-all duration-300">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-black text-text-main mb-2">Current Leaders</h2>
              <div className="flex items-center justify-center gap-2">
                <Link
                  to="/standings"
                  className="text-success hover:text-success font-semibold text-sm flex items-center gap-1"
                >
                  Full Standings <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {topPlayers.map((entry: any, index: number) => {
                const player =
                  players.find((p) => p.id === entry.playerId) ||
                  ({ name: 'Unknown', imageUrl: '', id: 'unknown' } as any);
                return (
                  <Link
                    key={entry.playerId}
                    to={`/player/${entry.playerId}`}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-success/10 to-success/5 border-2 border-success/20 p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] block"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-lg font-black text-white">{index + 1}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <PlayerAvatar
                            imageUrl={player.imageUrl}
                            name={player.name}
                            size="md"
                            className="group-hover:ring-2 ring-success transition-all"
                          />
                          <span className="font-bold text-text-main group-hover:text-success transition-colors">
                            {player.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-success">{entry.points} pts</span>
                        <span className="text-xs text-text-muted">{entry.events} Events</span>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-success/5 rounded-full blur-xl"></div>
                  </Link>
                );
              })}
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-success/10 to-transparent rounded-full blur-xl -z-10"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-text-accent/10 to-transparent rounded-full blur-2xl -z-10"></div>
          </div>
        </div>

        {/* Next Event */}
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 via-surface to-warning/10 rounded-3xl p-8 md:p-10 border border-primary/20 shadow-2xl h-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full shadow-lg mb-4 transform hover:scale-110 transition-all duration-300">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-black text-text-main mb-2">📅 Next Match Night</h2>
            </div>

            {nextEvent ? (
              <div className="space-y-6">
                {/* Date Card */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-lg font-black text-white">📅</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">
                        Date
                      </div>
                      <div className="text-lg font-bold text-text-main">
                        {formatNiceDate(nextEvent.startDateTime)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Card */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-warning/10 to-warning/5 border-2 border-warning/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-lg font-black text-white">🕖</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">
                        Time
                      </div>
                      <div className="text-lg font-bold text-text-main">
                        {formatNiceTime(nextEvent.startDateTime)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-success/10 to-success/5 border-2 border-success/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-lg font-black text-white">📍</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">
                        Location
                      </div>
                      <div className="text-lg font-bold text-text-main">{nextEvent.location}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href={nextEvent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-primary text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    Register on CourtReserve
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4 opacity-50">📅</div>
                  <p className="text-text-muted mb-6">
                    No upcoming match nights are listed. Check the full schedule for details.
                  </p>
                  <Link
                    to="/schedule"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl font-bold transition-colors hover:bg-primary-hover"
                  >
                    View Schedule
                  </Link>
                </div>
              </div>
            )}

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-warning/10 to-transparent rounded-full blur-2xl -z-10"></div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-text-accent/5 via-surface to-primary/5 rounded-3xl p-8 md:p-12 border border-text-accent/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-text-accent to-text-accent/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
              <Target className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-text-main mb-4">
              Ready to Compete?
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto mb-8">
              We are always looking for competitive players to join the roster. Check out the format
              and rules to see if you qualify for our premier league.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link
                to="/format"
                className="bg-text-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-text-accent/80 transition-colors shadow-lg shadow-text-accent/20 flex items-center gap-2"
              >
                View League Format <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/standings"
                className="bg-surface border-2 border-text-accent text-text-accent px-8 py-4 rounded-xl font-bold text-lg hover:bg-text-accent hover:text-white transition-colors"
              >
                Current Standings
              </Link>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-text-accent/10 to-transparent rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
