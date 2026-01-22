// TypeScript
import React, { useMemo, useState } from 'react';
import { useEvents, usePlayers } from '../hooks/firestoreHooks';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { getMonthOptions } from '../lib/dateUtils';
import StandingsPageView from '../views/StandingsPageView';

const StandingsPage: React.FC = () => {
  const [selection, setSelection] = useState<'all' | string>('all');
  const { data: players = [] } = usePlayers();
  const { data: events = [] } = useEvents();

  const months = useMemo(() => {
    return getMonthOptions(events.map((e) => e.startDateTime));
  }, [events]);

  const leaderboard = useLeaderboard(selection);

  return (
    <StandingsPageView
      selection={selection}
      setSelection={setSelection}
      months={months}
      leaderboard={leaderboard}
      players={players}
    />
  );
};

export default StandingsPage;
