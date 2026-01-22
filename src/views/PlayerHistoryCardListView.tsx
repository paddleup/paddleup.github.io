// TypeScript
import React from 'react';
import { Link } from 'react-router-dom';

interface PlayerHistoryEntry {
  eventId: string;
  date: string;
  rank: number;
  eventName?: string;
}

interface PlayerHistoryCardListViewProps {
  history: PlayerHistoryEntry[];
  openIdx: number | null;
  onToggle: (idx: number) => void;
}

const PlayerHistoryCardListView: React.FC<PlayerHistoryCardListViewProps> = ({
  history,
  openIdx,
  onToggle,
}) => (
  <div className="flex flex-col gap-4">
    {history.length === 0 && (
      <p className="text-text-muted text-center py-4">No event placements available.</p>
    )}
    {history
      .slice()
      .reverse()
      .map((week, idx) => (
        <div
          key={week.eventId + idx}
          className={`rounded-xl shadow-md border border-border bg-surface transition-all duration-200 ${
            openIdx === idx ? 'ring-2 ring-primary' : ''
          }`}
        >
          <button
            className="w-full flex items-center justify-between px-4 py-4 text-lg font-bold text-primary focus:outline-none"
            onClick={() => onToggle(idx)}
            aria-expanded={openIdx === idx}
            tabIndex={0}
          >
            <span>
              {week.eventName ?? week.eventId} ({week.date})
            </span>
            <span className="text-xs text-text-muted">
              {openIdx === idx ? 'Tap to collapse' : 'Tap to expand'}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIdx === idx ? 'max-h-[300px] py-2' : 'max-h-0'
            }`}
          >
            {openIdx === idx && (
              <div className="p-4">
                <div className="text-sm text-text-muted mb-2">
                  Rank: <span className="font-bold text-text-main">{week.rank}</span>
                </div>
                <Link
                  to={`/event/${week.eventId}`}
                  className="inline-block mt-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition"
                >
                  View Event
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
  </div>
);

export default PlayerHistoryCardListView;
