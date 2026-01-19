// src/components/ui/Input.tsx
import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = (props: InputProps) => (
  <input
    className="block w-full border border-border rounded px-2 py-1 bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
    {...props}
  />
);

export default Input;
