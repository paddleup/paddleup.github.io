// Redesigned EventPage.tsx — Mobile-first, aesthetic, court-focused

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
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
  const showLiveBanner = !isCompleted && isPast;
  const showCurrentRound =
    challenge.currentRoundViewData?.courts && (showLiveBanner || isCompleted);

  // --- Mobile-first sticky header ---
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-surface/95 border-b border-border shadow-sm px-4 py-3 flex items-center gap-2">
        <Link
          to="/schedule"
          className="flex items-center gap-1 text-sm text-text-muted hover:text-text-main transition-colors font-semibold"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Schedule</span>
        </Link>
        <div className="flex-1 flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {isCompleted ? 'Completed' : isPast ? 'Ongoing' : 'Upcoming'}
          </span>
          <span className="text-lg font-extrabold text-text-main truncate">{event.name}</span>
        </div>
        <span className="text-xs text-text-muted font-semibold">
          {formatNiceDate(event.startDateTime)}
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-2 sm:px-4 py-4 space-y-6">
        {/* Event Info Card */}
        <section className="bg-surface rounded-xl shadow border border-border p-4 flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-text-main font-bold text-xl">{event.name}</span>
            <span className="text-xs text-text-muted ml-1">
              {formatNiceDate(event.startDateTime)} &middot; {formatNiceTime(event.startDateTime)}
            </span>
          </div>
          {event.location && (
            <div className="text-sm text-text-muted flex items-center gap-2">
              <span className="font-semibold">Location:</span>
              <span>{event.location}</span>
            </div>
          )}
          {'description' in event && typeof event.description === 'string' && (
            <div className="text-sm text-text-muted">{event.description}</div>
          )}
        </section>

        {/* Round Selector */}
        {showCurrentRound && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-text-main">
                {showLiveBanner ? 'Current Round' : 'Final Round'}
              </span>
              <RoundTabs
                current={challenge.currentView}
                onSelect={challenge.setCurrentView}
                showInitialize={isAdmin}
              />
            </div>
            {/* Court Assignments */}
            <CourtCardsCollapsible
              courts={challenge.currentRoundViewData?.courts ?? []}
              players={players}
              isAdmin={isAdmin}
              showLiveBanner={showLiveBanner}
              handleScoreChange={challenge.handleScoreChange}
            />
          </section>
        )}

        {/* Standings or Info */}
        <section>
          {isCompleted ? (
            <div className="bg-surface-alt rounded-xl border border-border p-4 shadow flex flex-col items-center">
              <span className="text-lg font-bold text-text-main mb-2">Final Standings</span>
              {/* Standings table or summary can be added here */}
              <ul className="w-full">
                {event.standings!.map((pid: string, idx: number) => {
                  const player = players.find((p) => p.id === pid);
                  return (
                    <li
                      key={pid}
                      className="flex items-center gap-2 py-1 border-b border-border last:border-b-0"
                    >
                      <span className="font-mono text-xs text-text-muted w-6">{idx + 1}</span>
                      <span className="font-semibold text-text-main">{player?.name ?? pid}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="bg-surface-alt rounded-xl border border-border p-4 shadow text-center text-text-muted">
              Standings will appear here after the event concludes.
            </div>
          )}
        </section>
      </main>

      {/* Admin FAB */}
      {isAdmin && showLiveBanner && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-primary text-white rounded-full shadow-lg p-5 text-2xl hover:bg-primary-hover transition-all"
          aria-label="Edit Scores"
          tabIndex={0}
        >
          ✏️
        </button>
      )}
    </div>
  );
};

export default EventPage;
