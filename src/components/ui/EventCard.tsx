// EventCard.tsx
import React from 'react';
import PremiumSection from './PremiumSection';
import InfoCard from './InfoCard';
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
  <PremiumSection
    primaryColor="primary"
    secondaryColor="success"
    className="group rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-2xl transition-all duration-300 hover:border-primary/50 cursor-pointer"
  >
    <div className="flex flex-col md:flex-row gap-8 md:gap-12" onClick={onClick}>
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
          <InfoCard
            icon={<Calendar className="h-5 w-5" />}
            label="Date"
            value={formatNiceDate(event.startDateTime)}
            color="primary"
          />
          <InfoCard
            icon={<Clock className="h-5 w-5" />}
            label="Time"
            value={formatNiceTime(event.startDateTime)}
            color="success"
          />
          <InfoCard
            icon={<MapPin className="h-5 w-5" />}
            label="Location"
            value={event.location ?? 'TBD'}
            color="warning"
            className="sm:col-span-2 lg:col-span-1"
          />
        </div>
      </div>
      {/* Actions or children */}
      {children}
    </div>
  </PremiumSection>
);

export default EventCard;
