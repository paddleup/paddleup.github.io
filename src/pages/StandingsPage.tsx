import React, { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { useEvents, usePlayers } from '../hooks/firestoreHooks';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { getMonthOptions } from '../lib/dateUtils';
import LeaderboardTable from '../components/LeaderboardTable';

const StandingsPage: React.FC = () => {
  const [selection, setSelection] = useState<'all' | string>('all');
  const { data: players = [] } = usePlayers();
  const { data: events = [] } = useEvents();

  const months = useMemo(() => {
    return getMonthOptions(events.map((e) => e.startDateTime));
  }, [events]);

  const leaderboard = useLeaderboard(selection);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Challenge Leaderboard"
        subtitle="Leaderboard derived from Challenge events (month or all time)"
      >
        <div className="flex items-center gap-4">
          <select
            value={selection}
            onChange={(e) => setSelection(e.target.value === 'all' ? 'all' : e.target.value)}
            className="appearance-none bg-surface border border-border text-text-main text-sm rounded-lg pl-3 pr-8 py-2"
          >
            <option value="all">All Time</option>
            {months.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </PageHeader>

      <LeaderboardTable data={leaderboard} players={players} />
    </div>
  );
};

export default StandingsPage;
