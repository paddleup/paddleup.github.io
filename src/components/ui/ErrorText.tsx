import React from 'react';
import { cn } from '../../lib/utils';

const ErrorText = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;
    
    return (
      <p ref={ref} className={cn('text-sm text-error', className)} {...props}>
        {children}
      </p>
    );
  }
);

ErrorText.displayName = 'ErrorText';

export default ErrorText;