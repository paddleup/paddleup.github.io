import React from 'react';
import { cn } from '../../lib/utils';
import { ButtonProps as BaseButtonProps } from './types';

type ButtonProps = BaseButtonProps & {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'premium';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: React.ReactNode;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const base =
      'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<string, string> = {
      primary:
        'bg-primary text-white hover:bg-primary-hover focus:ring-primary/50 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105',
      secondary:
        'bg-surface-highlight text-text-main border-2 border-border hover:border-primary/50 hover:bg-surface-alt focus:ring-primary/30 shadow-lg hover:shadow-xl',
      success:
        'bg-success text-white hover:bg-success/90 focus:ring-success/50 shadow-lg shadow-success/20 hover:shadow-xl hover:shadow-success/30 hover:scale-105',
      warning:
        'bg-warning text-white hover:bg-warning/90 focus:ring-warning/50 shadow-lg shadow-warning/20 hover:shadow-xl hover:shadow-warning/30 hover:scale-105',
      error:
        'bg-error text-white hover:bg-error/90 focus:ring-error/50 shadow-lg shadow-error/20 hover:shadow-xl hover:shadow-error/30 hover:scale-105',
      ghost:
        'bg-transparent text-text-main hover:bg-surface-highlight border-2 border-transparent hover:border-border focus:ring-primary/30',
      premium:
        'bg-gradient-to-r from-primary to-primary-hover text-white hover:from-primary-hover hover:to-primary focus:ring-primary/50 shadow-2xl hover:shadow-3xl transform hover:scale-110',
    };

    const sizes: Record<string, string> = {
      sm: 'px-3 py-2 text-sm gap-2 min-h-[2.25rem]',
      md: 'px-4 py-3 text-base gap-2 min-h-[2.75rem]',
      lg: 'px-6 py-4 text-lg gap-3 min-h-[3.25rem]',
      xl: 'px-8 py-5 text-xl gap-3 min-h-[3.75rem]',
    };

    const iconSizes: Record<string, string> = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-7 w-7',
    };

    const LoadingSpinner = () => (
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent',
          iconSizes[size],
        )}
      />
    );

    const renderIcon = () => {
      if (loading) return <LoadingSpinner />;
      if (!icon) return null;

      if (React.isValidElement(icon)) {
        const existingClassName = (icon.props as any)?.className || '';
        return React.cloneElement(icon, {
          className: cn(iconSizes[size], existingClassName),
        } as any);
      }

      return icon;
    };

    return (
      <button
        ref={ref}
        className={cn(
          base,
          variants[variant] ?? variants.primary,
          sizes[size] ?? sizes.md,
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {iconPosition === 'left' && renderIcon()}
        {loading ? 'Loading...' : children}
        {iconPosition === 'right' && renderIcon()}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
