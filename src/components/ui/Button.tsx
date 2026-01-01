import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants: Record<string, string> = {
      primary:
        'bg-primary text-text-main hover:bg-primary-hover border border-transparent shadow-sm',
      secondary: 'bg-surface-highlight text-text-main border border-border hover:border-primary/50',
      ghost: 'bg-transparent text-text-main hover:bg-surface-highlight',
    };
    const sizes: Record<string, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
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
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
