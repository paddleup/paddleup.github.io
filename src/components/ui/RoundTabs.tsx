// src/components/ui/RoundTabs.tsx
import React from 'react';
import { ChallengeEventRoundNumber, ChallengeEventStage } from '../../types';

type Props = {
  current: ChallengeEventStage;
  onSelect: (view: ChallengeEventStage) => void;
  showInitialize?: boolean;
};

const RoundTabs: React.FC<Props> = ({ current, onSelect, showInitialize }) => (
  <div className="flex p-1 bg-surface-alt rounded-lg mb-4 gap-2 justify-center">
    {showInitialize && (
      <button
        key={'initial'}
        onClick={() => onSelect('initial')}
        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
          current === 'initial'
            ? 'bg-surface-highlight text-text-main shadow-sm'
            : 'text-text-muted hover:text-text-main'
        }`}
      >
        Initialize
      </button>
    )}
    {Array.from({ length: 3 }, (_, i) => (
      <button
        key={i}
        onClick={() => onSelect((i + 1) as ChallengeEventRoundNumber)}
        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
          current === i + 1
            ? 'bg-surface-highlight text-text-main shadow-sm'
            : 'text-text-muted hover:text-text-main'
        }`}
      >
        Round {i + 1}
      </button>
    ))}

    <button
      key={'standings'}
      onClick={() => onSelect('standings')}
      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
        current === 'standings'
          ? 'bg-surface-highlight text-text-main shadow-sm'
          : 'text-text-muted hover:text-text-main'
      }`}
    >
      Standings
    </button>
  </div>
);

export default RoundTabs;
