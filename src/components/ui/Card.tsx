import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'flat';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    const base = 'bg-surface p-6 rounded-xl shadow-sm border border-border';
    const variants: Record<string, string> = {
      default: base,
      outlined: 'bg-transparent p-6 rounded-xl border border-border',
      flat: 'bg-surface p-4 rounded-lg',
    };

    return (
      <div ref={ref} className={cn(variants[variant] ?? base, className)} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export default Card;
