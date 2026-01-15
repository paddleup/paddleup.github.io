import React from 'react';
import { cn } from '../../lib/utils';
import { InputProps as BaseInputProps } from './types';

type InputProps = BaseInputProps & {
  label?: string;
  textarea?: boolean;
  error?: string;
  success?: string;
  rows?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'premium' | 'outlined';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      textarea = false,
      className,
      error,
      success,
      rows = 4,
      size = 'md',
      variant = 'default',
      icon,
      iconPosition = 'left',
      ...props
    },
    ref,
  ) => {
    const base =
      'w-full rounded-xl border transition-all duration-300 text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';

    const sizes: Record<string, string> = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg',
    };

    const variants: Record<string, string> = {
      default:
        'bg-surface border-border focus:border-primary focus:ring-primary/30 shadow-sm hover:shadow-md',
      premium:
        'bg-gradient-to-br from-surface via-surface-alt to-surface border-border focus:border-primary focus:ring-primary/30 shadow-lg hover:shadow-xl',
      outlined:
        'bg-transparent border-2 border-border focus:border-primary focus:ring-primary/30 hover:border-primary/50',
    };

    const getStateClasses = () => {
      if (error) return 'border-error focus:border-error focus:ring-error/30 shadow-error/10';
      if (success)
        return 'border-success focus:border-success focus:ring-success/30 shadow-success/10';
      return '';
    };

    const iconSizes: Record<string, string> = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    const renderIcon = () => {
      if (!icon) return null;

      if (React.isValidElement(icon)) {
        const existingClassName = (icon.props as any)?.className || '';
        return React.cloneElement(icon, {
          className: cn(iconSizes[size], 'text-text-muted', existingClassName),
        } as any);
      }

      return icon;
    };

    const inputClasses = cn(
      base,
      variants[variant],
      sizes[size],
      getStateClasses(),
      icon && iconPosition === 'left' ? 'pl-10' : '',
      icon && iconPosition === 'right' ? 'pr-10' : '',
      textarea ? 'resize-vertical min-h-[6rem]' : '',
    );

    return (
      <label className={cn('block', className && undefined)}>
        {label && (
          <div className="mb-3 text-sm font-semibold text-text-main flex items-center gap-2">
            {label}
            {error && <span className="text-error">*</span>}
            {success && <span className="text-success">✓</span>}
          </div>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {renderIcon()}
            </div>
          )}

          {textarea ? (
            <textarea
              ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
              rows={rows}
              className={inputClasses}
              aria-invalid={!!error}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              className={inputClasses}
              aria-invalid={!!error}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}

          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {renderIcon()}
            </div>
          )}
        </div>

        {error && (
          <div className="mt-2 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-error/20 flex items-center justify-center">
              <span className="text-xs text-error font-bold">!</span>
            </div>
            <p className="text-sm text-error font-medium">{error}</p>
          </div>
        )}

        {success && !error && (
          <div className="mt-2 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center">
              <span className="text-xs text-success font-bold">✓</span>
            </div>
            <p className="text-sm text-success font-medium">{success}</p>
          </div>
        )}
      </label>
    );
  },
);

Input.displayName = 'Input';

export default Input;
