import React from 'react';

interface StatsCardProps {
  emoji: string | React.ReactNode;
  title: string;
  value: string | React.ReactNode;
  description?: string | React.ReactNode;
  color?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  emoji,
  title,
  value,
  description,
  color = 'primary',
  className = '',
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-${color}/10 to-${color}/5 border-2 border-${color}/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${className}`}
    >
      <div className="text-center">
        <div className="mb-4">{emoji}</div>
        <h3 className="text-xl font-bold text-text-main mb-3">{title}</h3>
        <div className="space-y-2">
          <div className={`text-2xl font-black text-${color}`}>{value}</div>
          {description && <div className="text-text-muted font-medium">{description}</div>}
        </div>
      </div>
      <div className={`absolute top-0 right-0 w-16 h-16 bg-${color}/5 rounded-full blur-xl`}></div>
    </div>
  );
};

export default StatsCard;
