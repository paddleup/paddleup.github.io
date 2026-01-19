// InfoCard.tsx
import React from 'react';
import { cn } from '../../lib/utils';

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'text-accent' | 'bronze';
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  label,
  value,
  color = 'primary',
  className = '',
}) => (
  <div
    className={cn(
      'flex items-center gap-3 p-3 rounded-xl border',
      `bg-${color}/10 border-${color}/20`,
      className,
    )}
  >
    <div className={`flex-shrink-0 text-${color}`}>{icon}</div>
    <div className="min-w-0">
      <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</div>
      <div className="font-bold text-text-main truncate">{value}</div>
    </div>
  </div>
);

export default InfoCard;
