// src/components/ui/Select.tsx
import React from 'react';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = (props: SelectProps) => (
  <select
    className="block w-full border border-border rounded px-2 py-1 bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
    {...props}
  >
    {props.children}
  </select>
);

export default Select;
