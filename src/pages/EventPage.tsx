import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  ChevronLeft,
  Trophy,
  Users,
  Medal,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import { useEvent, usePlayers } from '../hooks/firestoreHooks';
import LeaderboardTable, { LeaderboardRow } from '../components/LeaderboardTable';

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const decodedId = id ? decodeURIComponent(id) : '';
  const { data: event, isLoading: eventLoading } = useEvent(decodedId);
  const { data: players = [] } = usePlayers();

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

  if (eventLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-text-main">Event not found</h1>
        <p className="text-text-muted mb-8">
          The event ID <code className="bg-surface-alt px-1 rounded">{decodedId || '(empty)'}</code>{' '}
          does not match any scheduled event.
        </p>
        <Link
          to="/schedule"
          className="inline-flex items-center gap-2 bg-primary text-text-main px-6 py-3 rounded-xl font-bold"
        >
          <ChevronLeft className="h-5 w-5" /> Back to schedule
        </Link>
      </div>
    );
  }

  const isCompleted = Array.isArray(event.standings) && event.standings.length > 0;
  const isPast = event.startDateTime && new Date(event.startDateTime) < new Date();

  return (
    <div className="space-y-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          to="/schedule"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-main transition-colors mb-6 group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to schedule
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {isCompleted ? (
                  <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold uppercase tracking-wider rounded-full border border-success/20">
                    Completed
                  </span>
                ) : isPast ? (
                  <span className="px-3 py-1 bg-warning/10 text-warning text-xs font-bold uppercase tracking-wider rounded-full border border-warning/20">
                    Ongoing
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full border border-primary/20">
                    Upcoming
                  </span>
                )}
                {event.label && (
                  <span className="px-3 py-1 bg-surface-alt text-text-muted text-xs font-bold uppercase tracking-wider rounded-full border border-border">
                    {event.label}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight leading-tight">
                {event.name}
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-4 flex items-start gap-4 bg-surface/50 border-border/50">
                <div className="p-3 bg-primary/10 rounded-xl text-primary mt-1">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                    Date
                  </div>
                  <div className="text-lg font-bold text-text-main">
                    {formatNiceDate(event.startDateTime)}
                  </div>
                </div>
              </Card>

              <Card className="p-4 flex items-start gap-4 bg-surface/50 border-border/50">
                <div className="p-3 bg-primary/10 rounded-xl text-primary mt-1">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                    Time
                  </div>
                  <div className="text-lg font-bold text-text-main">
                    {formatNiceTime(event.startDateTime)}
                    {event.endDateTime ? ` - ${formatNiceTime(event.endDateTime)}` : ' - 10:00 PM'}
                  </div>
                </div>
              </Card>

              {event.location && (
                <Card className="p-4 flex items-start gap-4 bg-surface/50 border-border/50 sm:col-span-2">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary mt-1">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                      Location
                    </div>
                    <div className="text-lg font-bold text-text-main">{event.location}</div>
                  </div>
                </Card>
              )}
            </div>

            {!isCompleted && event.link && (
              <div className="pt-4">
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-primary text-text-main rounded-2xl font-black text-lg hover:shadow-xl hover:-translate-y-1 transition-all shadow-primary/20 border-b-4 border-primary-hover active:border-b-0 active:translate-y-0"
                >
                  Register on CourtReserve <ExternalLink className="h-5 w-5" />
                </a>
                <p className="mt-4 text-sm text-text-muted flex items-center gap-1.5 ml-1">
                  <Users className="h-4 w-4" /> Limited spots available. Register early!
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {isCompleted ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-2xl font-black text-text-main flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-warning" />
                    Final Standings
                  </h2>
                </div>
                <Card className="overflow-hidden border-border/50 shadow-xl">
                  <LeaderboardTable
                    data={event.standings!.map(
                      (pid, idx): LeaderboardRow => ({
                        playerId: pid,
                        rank: idx + 1,
                      }),
                    )}
                    players={players}
                    showEvents={false}
                    showPoints={false}
                  />
                </Card>
              </div>
            ) : (
              <Card className="p-6 bg-surface-alt/50 border-dashed space-y-4 flex flex-col items-center text-center justify-center min-h-[200px]">
                <div className="p-4 bg-surface rounded-full text-text-muted border border-border">
                  <Medal className="h-8 w-8 opacity-40" />
                </div>
                <div>
                  <h3 className="font-bold text-text-main">Standings TBD</h3>
                  <p className="text-sm text-text-muted">
                    Final results will appear here after the event concludes.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Rounds & Matches Section */}
        {Array.isArray(event.rounds) && event.rounds.length > 0 && (
          <div className="mt-16 space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-1 lg:h-px flex-grow bg-gradient-to-r from-transparent via-border to-transparent"></div>
              <h2 className="text-2xl font-black text-text-main uppercase tracking-widest whitespace-nowrap">
                Match Results
              </h2>
              <div className="h-1 lg:h-px flex-grow bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>

            <div className="space-y-12">
              {event.rounds.map((round, rIdx) => (
                <div key={rIdx} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-surface-highlight flex items-center justify-center font-black text-primary border border-primary/20">
                      {rIdx + 1}
                    </div>
                    <h3 className="text-xl font-bold text-text-main">Round {rIdx + 1} Results</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {round.courts.map((court, cIdx) => (
                      <Card
                        key={cIdx}
                        className="p-0 overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="bg-surface-alt px-4 py-2 border-b border-border flex justify-between items-center">
                          <span className="text-sm font-black text-text-muted uppercase tracking-wider">
                            Court {cIdx + 1}
                          </span>
                          <span className="text-xs text-text-muted font-medium px-2 py-0.5 bg-surface rounded-full border border-border">
                            Fast Format
                          </span>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-6">
                          {court.playerNames.map((name, pIdx) => (
                            <div key={pIdx} className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-primary/40"></div>
                              <span className="text-sm font-semibold truncate text-text-main">
                                {name}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-3 bg-surface-highlight/30 border-t border-border/30 flex items-center justify-center gap-6">
                          {court.matches.map((m, mIdx) => (
                            <div key={mIdx} className="text-center group">
                              <div className="text-[10px] text-text-muted uppercase font-bold tracking-tighter mb-0.5 group-hover:text-primary transition-colors">
                                G{mIdx + 1}
                              </div>
                              <div className="font-mono font-black text-sm text-text-main">
                                {m.scoreA ?? '-'}
                                <span className="text-text-muted px-0.5">:</span>
                                {m.scoreB ?? '-'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;
