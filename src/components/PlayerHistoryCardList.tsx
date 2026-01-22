// TypeScript
import React, { useState } from 'react';
import PlayerHistoryCardListView from '../views/PlayerHistoryCardListView';

interface PlayerHistoryEntry {
  eventId: string;
  date: string;
  rank: number;
  eventName?: string;
}

interface PlayerHistoryCardListProps {
  history: PlayerHistoryEntry[];
}

const PlayerHistoryCardList: React.FC<PlayerHistoryCardListProps> = ({ history }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return <PlayerHistoryCardListView history={history} openIdx={openIdx} onToggle={handleToggle} />;
};

export default PlayerHistoryCardList;
