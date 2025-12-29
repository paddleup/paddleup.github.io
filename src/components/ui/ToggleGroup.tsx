import React from 'react';
import { cn } from '../../lib/utils';

interface Option {
  value: string;
  label: React.ReactNode;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Generic toggle group for two-or-more options rendered as buttons.
 * Matches visual style used in Schedule and can be reused elsewhere.
 */
const ToggleGroup: React.FC<Props> = ({ options, value, onChange, className }) => {
  return (
    <div className={className}>
      <div className="inline-flex">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
              value === opt.value
                ? "bg-primary text-text-main shadow-md"
                : "text-text-muted hover:text-text-main hover:bg-surface"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToggleGroup;
