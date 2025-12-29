import React from 'react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  center?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children, className, center = false }) => {
  return (
    <div className={cn("space-y-4", center && "text-center", className)}>
      <div className={cn(
        "flex flex-col gap-4",
        center ? "items-center" : "md:flex-row md:items-center justify-between"
      )}>
        <div className={center ? "w-full" : ""}>
          <h1 className="text-3xl font-bold text-text-main">{title}</h1>
          {subtitle && (
            <p className={cn("text-text-muted mt-1", center ? "max-w-2xl mx-auto" : "")}>
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
