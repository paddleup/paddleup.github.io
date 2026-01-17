import React from 'react';
import { cn } from '../../lib/utils';

interface RankBadgeProps {
  rank: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ordinal = (n: number) => {
  if (!n || isNaN(n)) return String(n);
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
};

const RankBadge: React.FC<RankBadgeProps> = ({ rank, className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const getRankStyles = (r: number) => {
    if (r === 1) return 'bg-warning/20 text-warning';
    if (r === 2) return 'bg-surface-alt text-text-muted';
    if (r === 3) return 'bg-bronze/20 text-bronze';
    return 'text-text-muted';
  };

  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-full font-bold',
        sizeClasses[size],
        getRankStyles(rank),
        className,
      )}
    >
      {ordinal(rank)}
    </span>
  );
};

export default RankBadge;
