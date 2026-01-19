/* eslint-disable react/prop-types */
// src/components/ui/Label.tsx
import React from 'react';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', ...props }, ref) => (
    <label
      ref={ref}
      className={`block text-sm font-medium text-text-main mb-1 ${className}`}
      {...props}
    />
  ),
);

Label.displayName = 'Label';
export default Label;
