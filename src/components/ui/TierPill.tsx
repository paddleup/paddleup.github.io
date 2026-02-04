import { cn } from '../../lib/utils';

interface TierPillProps {
  tierId: string;
  label?: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const tierTones: Record<string, string> = {
  A: 'bg-yellow-300 text-yellow-900 ring-yellow-400',
  B: 'bg-slate-100 text-slate-900 ring-slate-200',
  C: 'bg-amber-400 text-amber-900 ring-amber-500',
  D: 'bg-teal-100 text-teal-900 ring-teal-200',
  Default: 'bg-surface-alt text-text-muted',
};

const sizeClasses: Record<string, string> = {
  xs: 'px-2 py-0.5 text-[10px] rounded',
  sm: 'px-2.5 py-0.5 text-xs rounded-lg',
  md: 'px-3 py-0.5 text-sm rounded-lg',
};

export default function TierPill({ tierId, size = 'sm', className }: TierPillProps) {
  const pillText = `Tier ${tierId}`;

  const tone = tierTones[tierId.charAt(0)] || tierTones['Default'];

  return (
    <span
      role="status"
      aria-label={pillText}
      className={cn(
        'inline-flex items-center font-semibold shadow-sm',
        sizeClasses[size],
        'ring-1 ring-border/10',
        tone,
        className,
      )}
    >
      {pillText}
    </span>
  );
}
