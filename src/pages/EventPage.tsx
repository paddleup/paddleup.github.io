import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import { useEvent, usePlayers } from '../hooks/firestoreHooks';

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const decodedId = id ? decodeURIComponent(id) : '';
  const { data: event } = useEvent(decodedId);
  const { data: players = [] } = usePlayers();

  const formatNiceDate = (d?: Date | null) =>
    d
      ? d.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '';

  const formatNiceTime = (d?: Date | null) =>
    d ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

  if (!event) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <p>
          The event id <strong>{decodedId || '(empty)'}</strong> does not match any scheduled event.
        </p>
        <p className="mt-4">
          <Link to="/schedule" className="text-primary font-semibold">
            Back to schedule
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title={event.name} subtitle={event.label ?? ''} />

      <div className="max-w-3xl mx-auto">
        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">When & where</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> {formatNiceDate(event.startDateTime)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {formatNiceTime(event.startDateTime)}
                </span>
                {event.location && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {event.location}
                  </span>
                )}
              </div>
            </div>

            {event.link && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Registration</h2>
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-text-main rounded font-bold"
                >
                  Register on CourtReserve <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}

            {Array.isArray(event.standings) && event.standings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Final standings</h2>
                <ol className="list-decimal list-inside space-y-1 text-text-main">
                  {event.standings.map((pid) => {
                    const p = players.find((pl) => pl.id === pid);
                    return (
                      <li key={pid}>
                        {p && p.id ? (
                          <Link
                            to={`/player/${encodeURIComponent(p.id)}`}
                            className="text-primary hover:underline"
                          >
                            {p.name}
                          </Link>
                        ) : (
                          <span>Unknown Player ({pid})</span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </div>
        </Card>

        <div className="mt-6">
          <Link to="/schedule" className="text-text-muted hover:text-text-main">
            ← Back to schedule
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
