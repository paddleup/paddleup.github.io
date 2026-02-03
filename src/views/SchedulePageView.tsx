import React from 'react';
import { Calendar, ExternalLink, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Heading, Button, Badge } from '../components/ui';

type SchedulePageViewProps = {
  view: 'upcoming' | 'past';
  setView: (v: 'upcoming' | 'past') => void;
  displayed: any[];
};

const formatDate = (d?: Date | null) =>
  d ? d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : '';

const formatTime = (d?: Date | null) =>
  d ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

const SchedulePageView: React.FC<SchedulePageViewProps> = ({ view, setView, displayed }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Heading as="h1" description="Register for upcoming match nights or view past results">
          Schedule
        </Heading>

        {/* View Toggle */}
        <div className="flex items-center rounded-lg border border-border bg-bg-subtle p-1">
          <button
            type="button"
            onClick={() => setView('upcoming')}
            className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
              view === 'upcoming' ? 'bg-accent text-white' : 'text-fg-muted hover:text-fg'
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setView('past')}
            className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
              view === 'past' ? 'bg-accent text-white' : 'text-fg-muted hover:text-fg'
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {displayed.map((ev) => (
          <Card key={ev.id}>
            <CardContent>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Event Info */}
                <div className="flex items-start gap-4">
                  {/* Date Badge */}
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg border border-border bg-bg-muted">
                    <span className="text-xs font-medium text-fg-muted uppercase">
                      {ev.startDateTime?.toLocaleDateString(undefined, { weekday: 'short' })}
                    </span>
                    <span className="text-xl font-bold text-fg">{ev.startDateTime?.getDate()}</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-fg truncate">{ev.name}</h3>
                      {view === 'past' && (
                        <Badge variant="success">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-fg-muted">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(ev.startDateTime)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(ev.startDateTime)}
                      </div>
                      {ev.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {ev.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                  {view === 'past' ? (
                    <Link to={`/event/${encodeURIComponent(ev.id)}`}>
                      <Button variant="secondary">View Results</Button>
                    </Link>
                  ) : (
                    <>
                      <a href={ev.link} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="primary"
                          icon={<ExternalLink className="h-4 w-4" />}
                          iconPosition="right"
                        >
                          Register
                        </Button>
                      </a>
                      <Link to={`/event/${encodeURIComponent(ev.id)}`}>
                        <Button variant="ghost">Details</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {displayed.length === 0 && (
          <Card className="text-center">
            <CardContent className="py-12">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-fg-subtle" />
              <h2 className="text-xl font-semibold text-fg mb-2">
                {view === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
              </h2>
              <p className="text-fg-muted">
                {view === 'upcoming'
                  ? 'Check back soon for new match nights to register for!'
                  : 'Past events will appear here once completed.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SchedulePageView;
