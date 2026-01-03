import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

type MovementIconProps = {
  isUp?: boolean;
  isDown?: boolean;
};

export default function MovementIcon({ isUp, isDown }: MovementIconProps): React.ReactElement {
  if (isUp) {
    return (
      <span className="inline-flex items-center">
        <ArrowUp className="mx-1 h-4 w-4 text-success" />
      </span>
    );
  }

  if (isDown) {
    return (
      <span className="inline-flex items-center">
        <ArrowDown className="mx-1 h-4 w-4 text-error" />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center">
      <span className="mx-2 h-2 w-2 bg-text-muted rounded-full" />
    </span>
  );
}
