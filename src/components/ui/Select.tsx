import React from 'react';
import { cn } from '../../lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-lg border px-3 py-2 text-sm',
          'bg-white dark:bg-slate-900',
          'text-slate-900 dark:text-slate-100',
          'focus:outline-none focus:border-primary-600 dark:focus:border-primary-400',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-red-500'
            : 'border-slate-200 dark:border-slate-800',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = 'Select';

export default Select;