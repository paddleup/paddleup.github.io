/* eslint-disable react/prop-types */
// src/components/ui/ErrorText.tsx
import React from 'react';

export type ErrorTextProps = React.HTMLAttributes<HTMLParagraphElement>;

const ErrorText = React.forwardRef<HTMLParagraphElement, ErrorTextProps>(
  ({ className = '', children, ...props }, ref) => (
    <p ref={ref} className={`text-sm text-error mt-1 ${className}`} {...props}>
      {children}
    </p>
  ),
);

ErrorText.displayName = 'ErrorText';
export default ErrorText;
