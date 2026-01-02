import React from 'react';
import { cn } from '../../lib/utils';

interface RankBadgeProps {
  rank: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

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
      {rank}
    </span>
  );
};

export default RankBadge;
