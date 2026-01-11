// src/components/eventNight/EventSelector.tsx
import React from 'react';

export interface EventSelectorProps {
  events: { id: string; name?: string }[];
  selectedEventId?: string;
  onChange: (eventId?: string) => void;
  label?: string;
  className?: string;
}

const EventSelector: React.FC<EventSelectorProps> = ({
  events,
  selectedEventId,
  onChange,
  label = 'Select Event',
  className = '',
}) => (
  <div className={className}>
    <label className="block text-sm font-medium">{label}</label>
    <select
      value={selectedEventId ?? ''}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="mt-1 block w-full border rounded px-2 py-1 bg-surface-alt"
    >
      <option value="">(select an event)</option>
      {events.map((ev) => (
        <option key={ev.id} value={ev.id}>
          {ev.name ?? ev.id}
        </option>
      ))}
    </select>
  </div>
);

export default EventSelector;
