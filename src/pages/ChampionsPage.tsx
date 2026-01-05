import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Star, Medal } from 'lucide-react';
import { cn } from '../lib/utils';
import { players } from '../data/players';
import { challengeEvents } from '../data/challengeEvents';
import { calculateWeekFinalPositions } from '../lib/leagueUtils';
import Card from '../components/ui/Card';
import PlayerAvatar from '../components/ui/PlayerAvatar';
import PageHeader from '../components/ui/PageHeader';
import { Player } from '../types';

const ChampionsPage: React.FC = () => {
  return (
    <div className="space-y-12">
      <PageHeader
        title="Hall of Champions"
        subtitle="Celebrating the elite performers of the Paddle Up Individual Championship League."
        center
      />

      {(() => {
        const events = (challengeEvents || []).filter(
          (ev) => Array.isArray((ev as any).standings) && (ev as any).standings.length > 0,
        );
        if (events.length === 0) {
          return (
            <Card className="text-center py-16 border-dashed">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-warning/20 rounded-full mb-4">
                <Star className="h-8 w-8 text-warning" />
              </div>
              <h2 className="text-xl font-medium text-text-main mb-2">No completed events yet</h2>
              <p className="text-text-muted max-w-md mx-auto">
                No past Challenge events with results are available yet.
              </p>
            </Card>
          );
        }

        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((ev, index) => {
              const weekLike = {
                id: ev.id,
                date: ev.startDateTime ? ev.startDateTime.toISOString() : ev.id,
                isCompleted: true,
                standings: (ev as any).standings,
              } as any;
              const finals = (calculateWeekFinalPositions(weekLike) || [])
                .sort((a: any, b: any) => (a.rank || 0) - (b.rank || 0))
                .slice(0, 3);

              return (
                <Card key={index} className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <Link
                      to={`/standings?season=${encodeURIComponent(String(ev.id))}`}
                      className="bg-primary-light text-primary text-xs font-bold px-3 py-1 rounded-full hover:bg-primary-light/80 transition-colors"
                    >
                      {ev.name}
                    </Link>
                    <div className="flex items-center text-xs text-text-muted">
                      <Calendar className="h-3 w-3 mr-1" />
                      {ev.startDateTime ? ev.startDateTime.toLocaleDateString() : ev.id}
                    </div>
                  </div>

                  <div className="space-y-6 flex-1">
                    {finals.map((entry: any, i: number) => {
                      const player =
                        players.find((p) => p.id === entry.playerId) ||
                        ({ name: 'Unknown', imageUrl: '' } as Player);
                      const medalColor =
                        i === 0 ? 'text-warning' : i === 1 ? 'text-text-muted' : 'text-bronze';
                      const label = i === 0 ? 'Champion' : i === 1 ? 'Runner Up' : 'Third Place';

                      return (
                        <Link
                          key={entry.playerId}
                          to={`/player/${entry.playerId}`}
                          className="flex items-center gap-4 group"
                        >
                          <div className="relative">
                            <PlayerAvatar
                              imageUrl={player.imageUrl}
                              name={player.name}
                              size="lg"
                              className={cn(
                                i === 0 ? 'border-warning' : 'border-border',
                                'group-hover:ring-2 ring-primary transition-all',
                              )}
                              border={true}
                            />
                            <div
                              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-surface shadow-sm flex items-center justify-center border border-border`}
                            >
                              {i === 0 ? (
                                <Trophy className="h-3 w-3 text-warning" />
                              ) : (
                                <Medal className={`h-3 w-3 ${medalColor}`} />
                              )}
                            </div>
                          </div>
                          <div>
                            <p
                              className={`text-xs font-bold uppercase tracking-wider ${medalColor}`}
                            >
                              {label}
                            </p>
                            <p className="font-bold text-text-main group-hover:text-primary transition-colors">
                              {player.name}
                            </p>
                            <p className="text-xs text-text-muted">{entry.pointsEarned || 0} pts</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
};

export default ChampionsPage;
