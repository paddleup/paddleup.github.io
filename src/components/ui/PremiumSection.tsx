import React from 'react';

interface PremiumSectionProps {
  children: React.ReactNode;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
}

const PremiumSection: React.FC<PremiumSectionProps> = ({
  children,
  primaryColor = 'primary',
  secondaryColor = 'success',
  className = '',
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className={`bg-gradient-to-br from-${primaryColor}/5 via-surface to-${secondaryColor}/5 rounded-3xl p-4 md:p-8 border border-${primaryColor}/20 shadow-2xl`}
      >
        {children}

        {/* Decorative Background Elements */}
        <div
          className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-${primaryColor}/10 to-transparent rounded-full blur-2xl -z-10`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-${secondaryColor}/10 to-transparent rounded-full blur-2xl -z-10`}
        ></div>
      </div>
    </div>
  );
};

export default PremiumSection;
