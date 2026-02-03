import React from 'react';
import { cn } from '../../lib/utils';

interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  description?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  ({ label, value, description, trend, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('', className)} {...props}>
        <dt className="text-sm text-fg-muted">{label}</dt>
        <dd className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-fg">{value}</span>
          {trend && (
            <span
              className={cn(
                'text-sm font-medium',
                trend === 'up' && 'text-success',
                trend === 'down' && 'text-error',
                trend === 'neutral' && 'text-fg-muted'
              )}
            >
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trend === 'neutral' && '→'}
            </span>
          )}
        </dd>
        {description && <p className="mt-1 text-sm text-fg-subtle">{description}</p>}
      </div>
    );
  }
);

Stat.displayName = 'Stat';

/* Stat Group - for displaying multiple stats in a grid */
interface StatGroupProps extends React.HTMLAttributes<HTMLDListElement> {
  columns?: 2 | 3 | 4;
}

const StatGroup = React.forwardRef<HTMLDListElement, StatGroupProps>(
  ({ columns = 3, className, children, ...props }, ref) => {
    const colsMap: Record<number, string> = {
      2: 'grid-cols-2',
      3: 'grid-cols-2 md:grid-cols-3',
      4: 'grid-cols-2 md:grid-cols-4',
    };

    return (
      <dl ref={ref} className={cn('grid gap-4', colsMap[columns], className)} {...props}>
        {children}
      </dl>
    );
  }
);

StatGroup.displayName = 'StatGroup';

export default Stat;
export { Stat, StatGroup };