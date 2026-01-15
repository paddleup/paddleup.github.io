import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'premium' | 'gradient' | 'outlined' | 'flat' | 'stat' | 'info';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'primary' | 'success' | 'warning' | 'error' | 'text-accent' | 'bronze';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      variant = 'default',
      hover = false,
      padding = 'md',
      theme = 'primary',
      ...props
    },
    ref,
  ) => {
    const base = 'rounded-xl border transition-all duration-300';

    const paddings: Record<string, string> = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-12',
    };

    const themes: Record<string, { bg: string; border: string }> = {
      primary: { bg: 'from-primary/10 to-primary/5', border: 'border-primary/20' },
      success: { bg: 'from-success/10 to-success/5', border: 'border-success/20' },
      warning: { bg: 'from-warning/10 to-warning/5', border: 'border-warning/20' },
      error: { bg: 'from-error/10 to-error/5', border: 'border-error/20' },
      'text-accent': {
        bg: 'from-text-accent/10 to-text-accent/5',
        border: 'border-text-accent/20',
      },
      bronze: { bg: 'from-bronze/10 to-bronze/5', border: 'border-bronze/20' },
    };

    const variants: Record<string, string> = {
      default: 'bg-surface border-border shadow-sm',

      premium: `bg-gradient-to-br from-surface via-surface-alt to-surface border-border shadow-2xl ${
        hover ? 'hover:shadow-3xl hover:scale-[1.02] hover:border-primary/50' : ''
      }`,

      gradient: `bg-gradient-to-br ${themes[theme].bg} ${themes[theme].border} shadow-lg ${
        hover ? 'hover:shadow-xl hover:scale-[1.02]' : ''
      }`,

      outlined: 'bg-transparent border-border hover:border-primary/50',

      flat: 'bg-surface-alt border-transparent shadow-none',

      stat: `bg-gradient-to-br ${themes[theme].bg} border-2 ${themes[theme].border} shadow-lg ${
        hover ? 'hover:shadow-xl hover:scale-105' : ''
      }`,

      info: `bg-gradient-to-r ${themes[theme].bg} border-2 ${themes[theme].border} shadow-lg ${
        hover ? 'hover:shadow-xl hover:scale-[1.02]' : ''
      }`,
    };

    const hoverEffects = hover ? 'cursor-pointer group' : '';

    return (
      <div
        ref={ref}
        className={cn(
          base,
          variants[variant] ?? variants.default,
          paddings[padding],
          hoverEffects,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export default Card;
