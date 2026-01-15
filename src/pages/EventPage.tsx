import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, MapPin, Trophy, Users, Target } from 'lucide-react';
import { useEvent, usePlayers } from '../hooks/firestoreHooks';
import { useAdmin } from '../hooks/useAdmin';
import { useChallengeEvent } from '../hooks/useChallengeEvent';
import RoundTabs from '../components/ui/RoundTabs';
import CourtCardsCollapsible from '../components/eventNight/CourtCardsCollapsible';

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const decodedId = id ? decodeURIComponent(id) : '';
  const { data: event, isLoading: eventLoading } = useEvent(decodedId);
  const { data: players = [] } = usePlayers();
  const { isAdmin } = useAdmin();
  const challenge = useChallengeEvent(decodedId);

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-primary/5 via-surface to-success/5 rounded-3xl p-12 border border-primary/20 shadow-2xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-text-main mb-2">Loading Event</h2>
              <p className="text-text-muted">Please wait while we fetch the event details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-error/5 via-surface to-warning/5 rounded-3xl p-12 border border-error/20 shadow-2xl max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-6xl mb-6 opacity-50">❌</div>
              <h1 className="text-3xl font-black text-text-main mb-4">Event Not Found</h1>
              <p className="text-text-muted mb-8 leading-relaxed">
                The event ID{' '}
                <code className="bg-surface-alt px-2 py-1 rounded font-mono text-sm">
                  {decodedId || '(empty)'}
                </code>{' '}
                does not match any scheduled event in our system.
              </p>
              <Link
                to="/schedule"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/20 hover:scale-105"
              >
                <ChevronLeft className="h-5 w-5" /> Back to Schedule
              </Link>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-error/10 to-transparent rounded-full blur-2xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-warning/10 to-transparent rounded-full blur-2xl -z-10"></div>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = Array.isArray(event.standings) && event.standings.length > 0;
  const isPast = event.startDateTime && new Date(event.startDateTime) < new Date();
  const showLiveBanner = !isCompleted && isPast;
  const showCurrentRound =
    challenge.currentRoundViewData?.courts && (showLiveBanner || isCompleted);

  const getEventStatus = () => {
    if (isCompleted) return { label: 'Completed', color: 'success', emoji: '✅' };
    if (isPast) return { label: 'Live', color: 'warning', emoji: '🔴' };
    return { label: 'Upcoming', color: 'primary', emoji: '📅' };
  };

  const status = getEventStatus();

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div
          className={`bg-gradient-to-br from-${status.color}/5 via-surface to-primary/5 rounded-3xl p-8 md:p-12 border border-${status.color}/20 shadow-2xl`}
        >
          {/* Navigation */}
          <div className="mb-8">
            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-semibold"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Back to Schedule</span>
            </Link>
          </div>

          {/* Header with animated icon */}
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-${status.color} to-${status.color}/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300`}
            >
              <Calendar className="h-10 w-10 text-white" />
            </div>

            {/* Status Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${status.color}/10 border border-${status.color}/20 mb-6`}
            >
              <span className="text-2xl">{status.emoji}</span>
              <span className={`text-sm font-semibold text-${status.color}`}>
                {status.label} Event
              </span>
              {status.label === 'Live' && (
                <span className={`relative flex h-2 w-2`}>
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${status.color} opacity-75`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 bg-${status.color}`}
                  ></span>
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-text-main mb-4">{event.name}</h1>
          </div>

          {/* Decorative Background Elements */}
          <div
            className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-${status.color}/10 to-transparent rounded-full blur-2xl -z-10`}
          ></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
        </div>
      </div>

      {/* Event Details */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-primary/5 via-surface to-success/5 rounded-3xl p-8 md:p-12 border border-primary/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
              <Target className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-text-main mb-4">
              📋 Event Details
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Everything you need to know about this match night
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Date Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/5 border-2 border-primary/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">
                    Date
                  </div>
                  <div className="font-bold text-text-main">
                    {formatNiceDate(event.startDateTime)}
                  </div>
                </div>
              </div>
            </div>

            {/* Time Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-success/10 via-success/5 to-success/5 border-2 border-success/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">
                    Time
                  </div>
                  <div className="font-bold text-text-main">
                    {formatNiceTime(event.startDateTime)}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-warning/10 via-warning/5 to-warning/5 border-2 border-warning/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">
                    Location
                  </div>
                  <div className="font-bold text-text-main truncate">{event.location || 'TBD'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {'description' in event && typeof event.description === 'string' && (
            <div className="mt-8 max-w-4xl mx-auto">
              <div className="bg-surface-alt/50 rounded-2xl border border-border p-6 shadow-lg">
                <h3 className="text-lg font-bold text-text-main mb-3">Event Description</h3>
                <p className="text-text-muted leading-relaxed">{event.description}</p>
              </div>
            </div>
          )}

          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-success/10 to-transparent rounded-full blur-2xl -z-10"></div>
        </div>
      </div>

      {/* Live Round / Courts */}
      {showCurrentRound && (
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-success/5 via-surface to-warning/5 rounded-3xl p-8 md:p-12 border border-success/20 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success to-success/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div className="flex items-center justify-center gap-4 mb-6">
                <h2 className="text-4xl md:text-5xl font-black text-text-main">
                  🏓 {showLiveBanner ? 'Live Action' : 'Final Results'}
                </h2>
                <RoundTabs
                  current={challenge.currentView}
                  onSelect={challenge.setCurrentView}
                  showInitialize={isAdmin}
                />
              </div>
              <p className="text-xl text-text-muted max-w-2xl mx-auto">
                {showLiveBanner
                  ? 'Follow the live action on all courts'
                  : 'Final court assignments and results'}
              </p>
            </div>

            {/* Court Cards */}
            <div className="max-w-6xl mx-auto">
              <CourtCardsCollapsible
                courts={challenge.currentRoundViewData?.courts ?? []}
                players={players}
                isAdmin={isAdmin}
                showLiveBanner={showLiveBanner}
                handleScoreChange={challenge.handleScoreChange}
              />
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-success/10 to-transparent rounded-full blur-2xl -z-10"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-warning/10 to-transparent rounded-full blur-2xl -z-10"></div>
          </div>
        </div>
      )}

      {/* Final Standings */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-warning/5 via-surface to-text-accent/5 rounded-3xl p-8 md:p-12 border border-warning/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-warning to-warning/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-text-main mb-4">
              🏆 {isCompleted ? 'Final Standings' : 'Standings'}
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              {isCompleted
                ? 'Official results from this event'
                : 'Standings will appear after the event concludes'}
            </p>
          </div>

          {isCompleted ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-surface-alt/50 to-surface/50 rounded-2xl border border-border shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-text-main mb-4 text-center">
                    Final Rankings
                  </h3>
                  <div className="space-y-3">
                    {event.standings!.map((pid: string, idx: number) => {
                      const player = players.find((p) => p.id === pid);
                      const medalColors = ['text-warning', 'text-text-accent', 'text-bronze'];
                      const medals = ['🥇', '🥈', '🥉'];

                      return (
                        <div
                          key={pid}
                          className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex-shrink-0">
                            <div
                              className={`w-12 h-12 bg-gradient-to-br ${
                                idx < 3
                                  ? `from-${medalColors[idx].split('-')[1]} to-${
                                      medalColors[idx].split('-')[1]
                                    }/80`
                                  : 'from-surface-alt to-surface-highlight'
                              } rounded-full flex items-center justify-center shadow-md`}
                            >
                              <span className="text-lg font-black text-white">
                                {idx < 3 ? medals[idx] : `#${idx + 1}`}
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <h4
                              className={`font-bold ${
                                idx < 3 ? medalColors[idx] : 'text-text-main'
                              } text-lg`}
                            >
                              {player?.name ?? `Player ${pid}`}
                            </h4>
                            <p className="text-sm text-text-muted">
                              {idx === 0
                                ? 'Champion'
                                : idx === 1
                                ? 'Runner-up'
                                : idx === 2
                                ? 'Third Place'
                                : `Position ${idx + 1}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-2xl font-black ${
                                idx < 3 ? medalColors[idx] : 'text-text-main'
                              }`}
                            >
                              #{idx + 1}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto text-center p-12">
              <div className="text-6xl mb-6 opacity-50">{status.emoji}</div>
              <h3 className="text-2xl font-bold text-text-main mb-4">
                {isPast ? 'Event In Progress' : 'Event Not Started'}
              </h3>
              <p className="text-text-muted">
                {isPast
                  ? 'Players are currently competing. Final standings will appear here when the event concludes.'
                  : 'Check back after the event starts to see live updates and final standings.'}
              </p>
            </div>
          )}

          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-warning/10 to-transparent rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-text-accent/10 to-transparent rounded-full blur-2xl -z-10"></div>
        </div>
      </div>

      {/* Admin FAB */}
      {isAdmin && showLiveBanner && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            className="bg-gradient-to-r from-primary to-primary-hover text-white rounded-full shadow-2xl p-6 text-2xl hover:scale-110 transition-all duration-300 border-2 border-primary/20"
            aria-label="Edit Scores"
            tabIndex={0}
          >
            ✏️
          </button>
        </div>
      )}
    </div>
  );
};

export default EventPage;
