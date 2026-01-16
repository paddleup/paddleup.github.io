// TimePeriodSelector.tsx
import React from 'react';

export interface TimePeriodOption {
  key: string;
  label: string;
}

interface TimePeriodSelectorProps {
  value: string;
  options: TimePeriodOption[];
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  value,
  options,
  onChange,
  label = 'View:',
  className = '',
}) => (
  <div
    className={`inline-flex items-center gap-4 p-2 bg-surface-alt rounded-2xl border border-border shadow-lg ${className}`}
  >
    <span className="text-sm font-semibold text-text-muted px-3">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-primary text-white text-sm font-bold rounded-xl px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      <option value="all">All Time</option>
      {options.map((opt) => (
        <option key={opt.key} value={opt.key}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default TimePeriodSelector;
