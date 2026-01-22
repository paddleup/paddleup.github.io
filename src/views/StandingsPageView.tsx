// TypeScript
import React from 'react';
import { Target } from 'lucide-react';
import LeaderboardTable from '../components/LeaderboardTable';
import PremiumSection from '../components/ui/PremiumSection';
import SectionHeader from '../components/ui/SectionHeader';
import TimePeriodSelector from '../components/ui/TimePeriodSelector';

type StandingsPageViewProps = {
  selection: string;
  setSelection: (v: string) => void;
  months: { value: string; label: string }[];
  leaderboard: any[];
  players: any[];
};

const StandingsPageView: React.FC<StandingsPageViewProps> = ({
  selection,
  setSelection,
  months,
  leaderboard,
  players,
}) => (
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

export default StandingsPageView;
