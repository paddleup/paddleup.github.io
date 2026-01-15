import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PlayerAvatarProps {
  imageUrl?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  border?: boolean;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ 
  imageUrl, 
  name, 
  size = 'md', 
  className, 
  border = true 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-xs',
    lg: 'h-12 w-12 text-sm',
    xl: 'h-16 w-16 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  };

  const baseClasses = cn(
    "rounded-full object-cover flex-shrink-0",
    sizeClasses[size],
    border && "border border-border",
    className
  );

  if (imageUrl) {
    // Handle relative paths for GitHub Pages deployment
    const finalUrl = imageUrl.startsWith('/') 
      ? `${import.meta.env.BASE_URL}${imageUrl.slice(1)}` 
      : imageUrl;

    return (
      <img 
        src={finalUrl} 
        alt={name} 
        className={baseClasses}
      />
    );
  }

  // Fallback to initials or user icon
  return (
    <div className={cn(baseClasses, "bg-surface-highlight flex items-center justify-center")}>
      {name ? (
        <span className="font-bold text-text-muted">
          {name.charAt(0)}
        </span>
      ) : (
        <User className={cn("text-text-muted", iconSizes[size])} />
      )}
    </div>
  );
};

export default PlayerAvatar;
