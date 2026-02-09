import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Avatar, Badge } from '../components/ui';
import { Trophy, TrendingUp, Calendar, Activity } from 'lucide-react';

type WeeklyHistory = { eventId: string; date: string; rank: number };
type PlayerProfilePageViewProps = {
  player: any;
  overallRank: number | null;
  currentStats: { points: number; events: number; champWins: number };
  weeklyHistory: WeeklyHistory[];
  challengeEvents: any[];
};

const getRankBadgeStyles = (rank: number) => {
  if (rank === 1) return 'bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300';
  if (rank === 2) return 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
  if (rank === 3) return 'bg-orange-200 dark:bg-orange-800/50 text-orange-700 dark:text-orange-300';
  return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
};

const PlayerProfilePageView: React.FC<PlayerProfilePageViewProps> = ({
  player,
  overallRank,
  currentStats,
  weeklyHistory,
  challengeEvents,
}) => {
  if (!player) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Player Not Found
        </h2>
        <Link to="/standings" className="text-primary-600 dark:text-primary-400 hover:underline">
          Back to Standings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Player Header Card */}
      <Card>
        <div className="flex items-center gap-4">
          <Avatar
            src={player.imageUrl}
            displayName={player.name}
            userId={player.id}
            size="large"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">
              {player.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {player.dupr && (
                <Badge variant="default">DUPR {player.dupr}</Badge>
              )}
              {overallRank && (
                <Badge variant="warning">Rank #{overallRank}</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <Trophy className="h-6 w-6 text-amber-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {currentStats.points.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Points
          </div>
        </Card>
        <Card className="text-center">
          <TrendingUp className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {currentStats.champWins}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Top Finishes
          </div>
        </Card>
        <Card className="text-center">
          <Activity className="h-6 w-6 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {weeklyHistory.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Events
          </div>
        </Card>
        <Card className="text-center">
          <Calendar className="h-6 w-6 text-slate-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {currentStats.events}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Appearances
          </div>
        </Card>
      </div>

      {/* Event History */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Event History
        </h2>
        <Card>
          {weeklyHistory.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {weeklyHistory
                .slice()
                .reverse()
                .map((week, idx) => {
                  const eventName = challengeEvents.find((e) => e.id === week.eventId)?.name;
                  return (
                    <Link
                      key={idx}
                      to={`/event/${week.eventId}`}
                      className="flex items-center justify-between py-3 hover:bg-slate-50 dark:hover:bg-slate-800 -mx-4 px-4 transition-colors"
                    >
                      <div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {eventName || week.eventId}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {week.date}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${getRankBadgeStyles(week.rank)}`}
                        >
                          {week.rank}
                        </span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          ) : (
            <p className="text-center py-6 text-slate-500 dark:text-slate-400">
              No event history yet.
            </p>
          )}
        </Card>
      </section>
    </div>
  );
};

export default PlayerProfilePageView;