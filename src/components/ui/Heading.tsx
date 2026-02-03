import React from 'react';
import { cn } from '../../lib/utils';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  description?: React.ReactNode;
}

const sizeMap: Record<HeadingLevel, string> = {
  h1: 'text-3xl md:text-4xl',
  h2: 'text-2xl md:text-3xl',
  h3: 'text-xl md:text-2xl',
  h4: 'text-lg md:text-xl',
};

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Tag = 'h2', className, description, children, ...props }, ref) => {
    return (
      <div className="mb-6">
        <Tag
          ref={ref}
          className={cn('font-semibold tracking-tight text-fg', sizeMap[Tag], className)}
          {...props}
        >
          {children}
        </Tag>
        {description && <p className="mt-1 text-fg-muted">{description}</p>}
      </div>
    );
  }
);

Heading.displayName = 'Heading';

export default Heading;