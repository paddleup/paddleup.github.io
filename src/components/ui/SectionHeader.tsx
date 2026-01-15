import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  iconColor?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  iconColor = 'primary',
  className = '',
}) => {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-${iconColor} to-${iconColor}/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300`}>
        <Icon className="h-10 w-10 text-white" />
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-text-main mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl text-text-muted max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
