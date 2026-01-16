import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import ToggleGroup from '../components/ui/ToggleGroup';
import EventCard from '../components/ui/EventCard';
import { useEvents } from '../hooks/firestoreHooks';
import { useQueryState } from '../hooks/useQueryState';

const SchedulePage: React.FC = () => {
  const { data: events } = useEvents();

  const formatNiceDate = (d?: Date | null) =>
    d ? d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : '';

  const formatNiceTime = (d?: Date | null) =>
    d ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

  // Normalize and sort events
  const parsed = (events || [])
    .filter((ev) => ev.startDateTime instanceof Date && !isNaN(ev.startDateTime.getTime()))
    .slice()
    .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime());

  const now = new Date();

  const upcoming = parsed.filter((p) => p.startDateTime.getTime() >= now.getTime());
  const past = parsed
    .filter((p) => p.startDateTime.getTime() < now.getTime())
    .slice()
    .reverse();

  const [view, setView] = useQueryState('view', 'upcoming');
  const displayed = view === 'upcoming' ? upcoming : past;

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-primary/5 via-surface to-success/5 rounded-3xl p-8 md:p-12 border border-primary/20 shadow-2xl">
          {/* Header with animated icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
              <Calendar className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-text-main mb-4">
              📅 Season Schedule
            </h1>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Per-night registration links for &apos;The Challenge&apos; — register for any night
              below
            </p>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-success/10 to-transparent rounded-full blur-2xl -z-10"></div>
        </div>
      </div>

      {/* Toggle Section */}
      <div className="flex justify-center mb-8">
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"> */}
        <ToggleGroup
          options={[
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'past', label: 'Past' },
          ]}
          value={view}
          onChange={(v) => setView(v as 'upcoming' | 'past')}
        />
        {/* </div>
        </div> */}
      </div>

      {/* Events List */}
      <div className="max-w-6xl mx-auto space-y-8 px-2 md:px-0">
        {displayed.map((ev) => (
          <EventCard
            key={ev.id}
            event={ev}
            view={view}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('a,button')) return;
              window.location.href = `/#/event/${encodeURIComponent(ev.id)}`;
            }}
          >
            <div className="flex-shrink-0 flex flex-col gap-3 lg:w-48">
              {view === 'past' ? (
                <>
                  <div className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-success/20 border-2 border-success/30 rounded-xl text-success font-bold">
                    <span className="inline-block h-3 w-3 rounded-full bg-success"></span>
                    Completed
                  </div>
                  <Link
                    to={`/event/${encodeURIComponent(ev.id)}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-surface-highlight border border-border text-text-main rounded-xl font-semibold hover:bg-surface-alt transition-colors"
                  >
                    View Results
                  </Link>
                </>
              ) : (
                <>
                  <a
                    href={ev.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Register Now
                  </a>
                  <Link
                    to={`/#/event/${encodeURIComponent(ev.id)}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-surface-highlight border border-border text-text-main rounded-xl font-semibold hover:bg-surface-alt transition-colors"
                  >
                    Event Details
                  </Link>
                </>
              )}
            </div>
          </EventCard>
        ))}

        {/* Empty State */}
        {displayed.length === 0 && (
          <div className="text-center p-12 bg-surface rounded-2xl border border-border">
            <div className="text-6xl mb-6 opacity-50">{view === 'upcoming' ? '📅' : '🏁'}</div>
            <h3 className="text-2xl font-bold text-text-main mb-4">
              {view === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
            </h3>
            <p className="text-text-muted">
              {view === 'upcoming'
                ? 'Check back soon for new match nights to register for!'
                : "Past events will appear here once they're completed."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
