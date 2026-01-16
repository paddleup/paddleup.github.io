// EventCard.tsx
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export interface EventCardProps {
  event: {
    id: string;
    name: string;
    startDateTime: Date;
    location?: string;
    link?: string;
  };
  view: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children?: React.ReactNode;
}

const formatNiceDate = (d?: Date | null) =>
  d
    ? d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : '';

const formatNiceTime = (d?: Date | null) =>
  d ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

const EventCard: React.FC<EventCardProps> = ({ event, view, onClick, children }) => (
  <div
    className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-surface to-success/5 border border-primary/20 p-8 md:p-12 shadow-2xl hover:shadow-2xl transition-all duration-300 hover:border-primary/50 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex flex-col md:flex-row gap-8 md:gap-12">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-success/10 to-transparent rounded-full blur-2xl -z-10"></div>
      {/* Event Details */}
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-2xl font-bold text-text-main mb-2 group-hover:text-primary transition-colors">
              {event.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  view === 'past' ? 'bg-success' : 'bg-primary'
                }`}
              ></span>
              {view === 'past' ? 'Completed Event' : 'Upcoming Event'}
            </div>
          </div>
          {/* Quick Info */}
          <div className="text-right text-sm text-text-muted">
            <div className="font-semibold">{formatNiceDate(event.startDateTime)}</div>
            <div>{formatNiceTime(event.startDateTime)}</div>
          </div>
        </div>
        {/* Event Info Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {/* Date */}
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl border border-primary/20">
            <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Date
              </div>
              <div className="font-bold text-text-main truncate">
                {formatNiceDate(event.startDateTime)}
              </div>
            </div>
          </div>
          {/* Time */}
          <div className="flex items-center gap-3 p-3 bg-success/10 rounded-xl border border-success/20">
            <Clock className="h-5 w-5 text-success flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Time
              </div>
              <div className="font-bold text-text-main truncate">
                {formatNiceTime(event.startDateTime)}
              </div>
            </div>
          </div>
          {/* Location */}
          <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-xl border border-warning/20 sm:col-span-2 lg:col-span-1">
            <MapPin className="h-5 w-5 text-warning flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Location
              </div>
              <div className="font-bold text-text-main truncate">{event.location ?? 'TBD'}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Actions or children */}
      {children}
    </div>
  </div>
);

export default EventCard;
