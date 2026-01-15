import React from 'react';

interface FeatureCardProps {
  badgeContent: string | React.ReactNode;
  title: string;
  description: string | React.ReactNode;
  emoji?: string;
  color?: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  badgeContent,
  title,
  description,
  emoji,
  color = 'primary',
  className = '',
}) => {
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r from-${color}/20 via-${color}/10 to-${color}/5 border-2 border-${color}/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 bg-gradient-to-br from-${color} to-${color}/80 rounded-full flex items-center justify-center shadow-lg`}>
            <span className="text-2xl font-black text-white">{badgeContent}</span>
          </div>
        </div>
        <div className="flex-grow">
          <div className="text-lg font-bold text-text-main mb-1">{title}</div>
          <div className="text-text-muted">{description}</div>
        </div>
        {emoji && <div className="text-3xl opacity-50">{emoji}</div>}
      </div>
    </div>
  );
};

export default FeatureCard;
