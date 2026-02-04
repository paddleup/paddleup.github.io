import React from 'react';
import { cn } from '../../lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Background variant */
  variant?: 'default' | 'subtle' | 'muted';
}

const variantMap: Record<NonNullable<SectionProps['variant']>, string> = {
  default: 'bg-bg',
  subtle: 'bg-bg-subtle',
  muted: 'bg-bg-muted',
};

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('py-8 md:py-12', variantMap[variant], className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';

export default Section;