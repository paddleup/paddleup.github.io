import React, { useMemo, useState } from 'react';
import { Trophy, Target, Crown } from 'lucide-react';
import { useEvents, usePlayers } from '../hooks/firestoreHooks';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { getMonthOptions } from '../lib/dateUtils';
import LeaderboardTable from '../components/LeaderboardTable';
import PremiumSection from '../components/ui/PremiumSection';
import SectionHeader from '../components/ui/SectionHeader';
import TimePeriodSelector from '../components/ui/TimePeriodSelector';

const StandingsPage: React.FC = () => {
  const [selection, setSelection] = useState<'all' | string>('all');
  const { data: players = [] } = usePlayers();
  const { data: events = [] } = useEvents();

  const months = useMemo(() => {
    return getMonthOptions(events.map((e) => e.startDateTime));
  }, [events]);

  const leaderboard = useLeaderboard(selection);

  return (
    <div className="space-y-16 pb-12">
      {/* Full Leaderboard */}
      <PremiumSection primaryColor="primary" secondaryColor="success">
        {/* Header */}
        <SectionHeader
          icon={<Target className="h-10 w-10 text-white" />}
          subtitle="Complete standings with detailed statistics for all players"
          className="mb-8"
        >
          Standings
        </SectionHeader>
        {/* Time Period Selector */}
        <div className="flex justify-center mb-8">
          <TimePeriodSelector
            value={selection}
            options={months}
            onChange={(v) => setSelection(v === 'all' ? 'all' : v)}
          />
        </div>

        {/* Leaderboard Table */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-surface-alt/50 to-surface/50 rounded-2xl border border-border shadow-lg overflow-hidden">
            <LeaderboardTable data={leaderboard} players={players} />
          </div>
        </div>
      </PremiumSection>
    </div>
  );
};

export default StandingsPage;
