import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** @deprecated Use className for custom styling instead */
  variant?: string;
  /** @deprecated Use className for custom styling instead */
  theme?: string;
}

const paddingMap: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'lg', children, variant: _variant, theme: _theme, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-border bg-bg-subtle',
          paddingMap[padding],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

/* Card Header */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5 pb-4', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

/* Card Title */
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Tag = 'h3', ...props }, ref) => (
    <Tag ref={ref} className={cn('text-lg font-semibold text-fg', className)} {...props} />
  ),
);
CardTitle.displayName = 'CardTitle';

/* Card Description */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-fg-muted', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

/* Card Content */
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('', className)} {...props} />,
);
CardContent.displayName = 'CardContent';

/* Card Footer */
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

export default Card;
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
