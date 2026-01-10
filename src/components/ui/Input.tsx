import React from 'react';
import { cn } from '../../lib/utils';

import { InputProps as BaseInputProps } from './types';

type InputProps = BaseInputProps & {
  label?: string;
  textarea?: boolean;
  error?: string;
  rows?: number;
};

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, textarea = false, className, error, rows = 4, ...props }, ref) => {
    const base =
      'w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary';

    return (
      <label className={cn('block', className && undefined)}>
        {label && <div className="mb-2 text-sm text-text-muted font-medium">{label}</div>}
        {textarea ? (
          <textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            rows={rows}
            className={cn(base, 'resize-vertical min-h-[6rem]')}
            aria-invalid={!!error}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            className={cn(base)}
            aria-invalid={!!error}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && <p className="mt-2 text-xs text-warning">{error}</p>}
      </label>
    );
  },
);

Input.displayName = 'Input';

export default Input;
