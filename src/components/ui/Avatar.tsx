import React from 'react';
import { cn } from '../../lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
}

const sizeMap: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, fallback, size = 'md', className, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);

    const initials = React.useMemo(() => {
      if (fallback) return fallback.slice(0, 2).toUpperCase();
      if (alt) {
        return alt
          .split(' ')
          .map((word) => word[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();
      }
      return '?';
    }, [fallback, alt]);

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-muted',
          sizeMap[size],
          className
        )}
        {...props}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt || ''}
            className="h-full w-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <span className="font-medium text-fg-muted">{initials}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;