import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight, Calendar, MapPin, Clock, Users, ExternalLink, Info } from 'lucide-react';
import { Card, Button, Avatar, EmptyState } from '../components/ui';
import { getEventRoute } from '../config/routes';

type TopPlayer = {
  playerId: string;
  points: number;
  events: number;
  rank: number;
};

type HomePageProps = {
  players: any[];
  topPlayers: TopPlayer[];
  seriesLabel: string;
  nextEvent: any;
};

const formatNiceDate = (d?: Date | null) =>
  d ? d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : '';

const formatNiceTime = (d?: Date | null) =>
  d ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

const HomePageView: React.FC<HomePageProps> = ({ players, topPlayers, seriesLabel, nextEvent }) => {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 p-6 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white blur-2xl" />
        </div>
        
        {/* Content */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
              {seriesLabel || 'Season 1'}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Paddle Up Premier League
          </h1>
          <p className="text-sm text-white/80 mb-4">
            Competitive pickleball every Sunday. Rotating partners, rising stakes.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/standings">
              <button className="inline-flex items-center gap-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 text-sm font-medium transition-colors">
                <Trophy className="w-4 h-4" />
                Standings
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/format">
              <button className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-2 text-sm font-medium transition-colors">
                <Info className="w-4 h-4" />
                League Format
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Next Event */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Next Up
        </h2>
        {nextEvent ? (
          <Card>
            <Link to={nextEvent.eventCode ? getEventRoute(nextEvent.eventCode) : `/event/${nextEvent.id}`}>
              <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-2">
                {nextEvent.name || 'Match Night'}
              </h3>
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatNiceDate(nextEvent.startDateTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>{formatNiceTime(nextEvent.startDateTime)}</span>
                </div>
                {nextEvent.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{nextEvent.location}</span>
                  </div>
                )}
              </div>
            </Link>
            {nextEvent.courtReserveUrl && (
              <a
                href={nextEvent.courtReserveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-medium transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
                Register on CourtReserve
              </a>
            )}
          </Card>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No upcoming events"
            description="Check back later for upcoming match nights"
          />
        )}
      </section>

      {/* Current Leaders */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Season Leaders
          </h2>
          <Link
            to="/standings"
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {topPlayers.length > 0 ? (
          <Card>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {topPlayers.map((entry, index) => {
                const player = players.find((p) => p.id === entry.playerId) || {
                  name: 'Unknown',
                  imageUrl: '',
                  id: 'unknown',
                };
                return (
                  <Link
                    key={entry.playerId}
                    to={`/player/${entry.playerId}`}
                    className="flex items-center justify-between py-3 -mx-4 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400">
                        {index + 1}
                      </span>
                      <Avatar 
                        src={player.imageUrl} 
                        displayName={player.name}
                        userId={player.id}
                        alt={player.name} 
                        size="default" 
                      />
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {player.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {entry.points} pts
                      </span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">
                        {entry.events} Events
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        ) : (
          <Card>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              No standings yet
            </p>
          </Card>
        )}
      </section>

      {/* League Info */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          About the League
        </h2>
        <Card>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Schedule</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">Sundays 7-10 PM</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Players</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">16 per night</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Level</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">DUPR 3.5+</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-600 dark:text-slate-400">Format</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">Rotating Partners</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link to="/format">
              <Button variant="secondary" className="w-full">
                <Users className="w-4 h-4" />
                Learn More
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default HomePageView;