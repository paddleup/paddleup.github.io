import React from 'react';
import { cn } from '../../lib/utils';

import { Option as BaseOption } from './types';

type Option = BaseOption & {
  label: React.ReactNode;
  disabled?: boolean;
};

import { SelectProps as BaseSelectProps } from './types';

type SelectProps = BaseSelectProps & {
  error?: string;
  options: Option[];
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className, error, ...props }, ref) => {
    const base =
      'w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-primary';
    return (
      <label className="block">
        {label && <div className="mb-2 text-sm text-text-muted font-medium">{label}</div>}
        <select ref={ref} className={cn(base, className)} {...props}>
          {options.map((opt) => (
            <option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-2 text-xs text-warning">{error}</p>}
      </label>
    );
  },
);

Select.displayName = 'Select';

export default Select;
