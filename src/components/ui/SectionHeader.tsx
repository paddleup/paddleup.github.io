// SectionHeader.tsx
import React from 'react';

type SectionHeaderProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  subtitle?: string;
  icon?: React.ReactNode;
  iconColor?: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  children,
  className = '',
  as = 'h2',
  subtitle,
  icon,
  iconColor = 'primary',
}) => {
  const Heading = as;
  return (
    <div className={`text-center mb-8 ${className}`}>
      {icon && (
        <div
          className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-${iconColor} to-${iconColor}/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300`}
        >
          {icon}
        </div>
      )}
      <Heading className="text-2xl md:text-3xl font-black text-text-main mb-2">{children}</Heading>
      {subtitle && <div className="text-lg text-text-muted max-w-2xl mx-auto">{subtitle}</div>}
    </div>
  );
};

export default SectionHeader;
