import React from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'default' | 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      loading,
      icon,
      iconPosition = 'left',
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variants: Record<ButtonVariant, string> = {
      default: 'bg-bg-subtle border border-border text-fg hover:bg-bg-muted',
      primary: 'bg-accent text-white hover:opacity-90',
      secondary: 'bg-bg-muted border border-border text-fg hover:bg-bg-subtle',
      ghost: 'text-fg hover:bg-bg-subtle',
      destructive: 'bg-error text-white hover:opacity-90',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          'disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        ) : (
          icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
