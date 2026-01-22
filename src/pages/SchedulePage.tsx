// TypeScript
import React from 'react';
import { useEvents } from '../hooks/firestoreHooks';
import { useQueryState } from '../hooks/useQueryState';
import SchedulePageView from '../views/SchedulePageView';

const SchedulePage: React.FC = () => {
  const { data: events } = useEvents();

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
    <SchedulePageView
      view={view as 'upcoming' | 'past'}
      setView={(v) => setView(v)}
      displayed={displayed}
    />
  );
};

export default SchedulePage;
