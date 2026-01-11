// src/components/ui/RoundTabs.tsx
import React from 'react';
import { ChallengeEventRoundNumber, ChallengeEventStage } from '../../types';
import Button from './Button';

type Props = {
  current: ChallengeEventStage;
  onSelect: (view: ChallengeEventStage) => void;
  showInitialize?: boolean;
};

const tabClass = (active: boolean) =>
  `px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
    active
      ? 'bg-primary text-white shadow'
      : 'bg-surface-alt text-text-muted hover:text-primary hover:bg-primary/10'
  }`;

const RoundTabs: React.FC<Props> = ({ current, onSelect, showInitialize }) => (
  <div className="flex gap-2 mb-2">
    {showInitialize && (
      <Button
        key="initial"
        type="button"
        onClick={() => onSelect('initial')}
        className={tabClass(current === 'initial')}
        size="sm"
        variant="ghost"
      >
        Initialize
      </Button>
    )}
    {Array.from({ length: 3 }, (_, i) => (
      <Button
        key={i}
        type="button"
        onClick={() => onSelect((i + 1) as ChallengeEventRoundNumber)}
        className={tabClass(current === i + 1)}
        size="sm"
        variant="ghost"
      >
        Round {i + 1}
      </Button>
    ))}
    <Button
      key="standings"
      type="button"
      onClick={() => onSelect('standings')}
      className={tabClass(current === 'standings')}
      size="sm"
      variant="ghost"
    >
      Standings
    </Button>
  </div>
);

export default RoundTabs;
