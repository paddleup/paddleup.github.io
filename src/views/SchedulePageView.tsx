import React from 'react';
import { Calendar, ExternalLink, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge, EmptyState } from '../components/ui';
import { getEventRoute } from '../config/routes';

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
      {/* View Toggle */}
      <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1">
        <button
          type="button"
          onClick={() => setView('upcoming')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            view === 'upcoming'
              ? 'bg-primary-600 text-white dark:bg-primary-500'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Upcoming
        </button>
        <button
          type="button"
          onClick={() => setView('past')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            view === 'past'
              ? 'bg-primary-600 text-white dark:bg-primary-500'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Past
        </button>
      </div>

      {/* Events List */}
      {displayed.length > 0 ? (
        <div className="space-y-3">
          {displayed.map((ev) => (
            <Card
              key={ev.id}
              className="hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
                  {ev.name}
                </h3>
                {view === 'past' && (
                  <Badge variant="success">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Done
                  </Badge>
                )}
              </div>

              {/* Event Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(ev.startDateTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(ev.startDateTime)}</span>
                </div>
                {ev.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {view === 'past' ? (
                  <Link to={ev.eventCode ? getEventRoute(ev.eventCode) : `/event/${ev.id}`} className="flex-1">
                    <Button variant="secondary" className="w-full">
                      View Results
                    </Button>
                  </Link>
                ) : (
                  <>
                    {(ev.courtReserveUrl || ev.link) && (
                      <a 
                        href={ev.courtReserveUrl || ev.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1"
                      >
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                          <ExternalLink className="w-4 h-4" />
                          Register on CourtReserve
                        </Button>
                      </a>
                    )}
                    <Link to={ev.eventCode ? getEventRoute(ev.eventCode) : `/event/${ev.id}`}>
                      <Button variant="secondary">Details</Button>
                    </Link>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title={view === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
          description={
            view === 'upcoming'
              ? 'Check back soon for new match nights'
              : 'Past events will appear here once completed'
          }
        />
      )}
    </div>
  );
};

export default SchedulePageView;