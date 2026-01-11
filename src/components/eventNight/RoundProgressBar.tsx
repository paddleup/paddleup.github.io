// src/components/eventNight/RoundProgressBar.tsx
import React from 'react';

export interface RoundProgressBarProps {
  completedMatches: number;
  totalMatches: number;
  progressPercent: number;
  numPlayers: number;
  numCourts: number;
  className?: string;
}

const RoundProgressBar: React.FC<RoundProgressBarProps> = ({
  completedMatches,
  totalMatches,
  progressPercent,
  numPlayers,
  numCourts,
  className = '',
}) => (
  <div
    className={`bg-surface p-3 rounded-lg border border-border max-w-md mx-auto mb-6 ${className}`}
  >
    <div className="flex justify-between text-xs mb-1">
      <span className="text-text-muted font-medium">Round Progress</span>
      <span className="text-primary font-bold">
        {completedMatches} / {totalMatches} Matches
      </span>
    </div>
    <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-500 ease-out"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
    <div className="text-[10px] text-text-muted mt-1 text-center">
      {numPlayers} Players • {numCourts} Courts
    </div>
  </div>
);

export default RoundProgressBar;
