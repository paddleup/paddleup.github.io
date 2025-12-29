import React from 'react';
import { Season, Qualifier } from '../types';

interface Props {
  value: string;
  onChange: (value: string) => void;
  seasons: Season[];
  qualifiers?: Qualifier[];
  className?: string;
}

/**
 * Simple selector component that lists:
 * - All Time (value: 'all-time')
 * - Current season and past seasons (value: season.season)
 * - Qualifiers (value: `qualifier:${id}`)
 *
 * The component is intentionally presentation-light so it can be reused
 * on the Standings and Players pages.
 */
const SeasonSelector: React.FC<Props> = ({ value, onChange, seasons, qualifiers = [], className }) => {
  const currentSeason = seasons[0];
  const past = seasons.slice(1);

  return (
    <div className={className}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-surface border border-border text-text-main text-lg font-bold rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
      >
        <option value={currentSeason?.season || 'all-time'}>{currentSeason?.season || 'Current Season'}</option>
        {past.map((s) => (
          <option key={s.season} value={s.season}>
            {s.season}
          </option>
        ))}
        {qualifiers.length > 0 && <option disabled>──────────── Qualifiers ────────────</option>}
        {qualifiers.map((q) => (
          <option key={q.id} value={`qualifier:${q.id}`}>
            {`Qualifier • ${q.startDateTime instanceof Date ? q.startDateTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : q.date}`}
          </option>
        ))}
        <option value="all-time">All Time</option>
      </select>
    </div>
  );
};

export default SeasonSelector;
