import React from 'react';
import PrizeGrid from './PrizeGrid';
import { rules } from '../../data/rules';

const PrizesRewards: React.FC = () => {
  const entries = [
    {
      title: `${rules.rewards.firstPlace.name}`,
      items: rules.rewards.firstPlace.items,
      accent: true
    },
    {
      title: `${rules.rewards.secondPlace.name}`,
      items: rules.rewards.secondPlace.items
    },
    {
      title: `${rules.rewards.thirdPlace.name}`,
      items: rules.rewards.thirdPlace.items
    }
  ];

  return (
    <PrizeGrid
      heading="Prizes & Rewards"
      subtitle="Top performers from each season earn court credits, club points, and guaranteed spots for the next season."
      entries={entries}
      notes={rules.rewards.notes}
    />
  );
};

export default PrizesRewards;
