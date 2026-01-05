import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import ToggleGroup from '../components/ui/ToggleGroup';
import { useEvents } from '../hooks/firestoreHooks';

const SchedulePage: React.FC = () => {
  const { data: events } = useEvents();

  const formatNiceDate = (d?: Date | null) =>
    d ? d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : '';

  const formatNiceTime = (d?: Date | null) =>
    d ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

  const [view, setView] = React.useState<'upcoming' | 'past'>('upcoming');

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

  const displayed = view === 'upcoming' ? upcoming : past;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Season Schedule"
        subtitle="Per-night registration links for 'The Challenge' — register for any night below."
        center
      />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-end gap-2 mb-4">
          <ToggleGroup
            options={[
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'past', label: 'Past' },
            ]}
            value={view}
            onChange={(v) => setView(v as 'upcoming' | 'past')}
          />
        </div>

        <div className="grid gap-6">
          {displayed.map((ev) => (
            <Link key={ev.id} to={`/event/${encodeURIComponent(ev.id)}`} className="group">
              <Card className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group-hover:shadow-lg transition">
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-1">{ev.name}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> {formatNiceDate(ev.startDateTime)}
                    </span>

                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> {formatNiceTime(ev.startDateTime)}
                    </span>

                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {ev.location}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 w-full md:w-auto">
                  {view === 'past' ? (
                    <div className="inline-flex items-center gap-2 px-5 py-3 bg-surface border border-border rounded-xl text-text-muted font-semibold">
                      <span className="inline-block h-2 w-2 rounded-full bg-success/80"></span>
                      Completed
                    </div>
                  ) : (
                    <a
                      href={ev.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-text-main rounded-xl font-bold hover:opacity-95 transition shadow"
                    >
                      Register on CourtReserve <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
