import React from 'react';
import { Trophy } from 'lucide-react';
import LeaderboardTable from '../components/LeaderboardTable';
import { Card, CardContent, Heading, Select } from '../components/ui';

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
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Heading as="h1" description="Complete standings with detailed statistics for all players">
        Standings
      </Heading>

      {/* Time Period Selector */}
      <div className="flex items-center gap-3">
        <label htmlFor="period" className="text-sm font-medium text-fg-muted">
          Period:
        </label>
        <Select
          id="period"
          value={selection}
          onChange={(e) => setSelection(e.target.value)}
          className="min-w-[160px]"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </Select>
      </div>
    </div>

    {/* Leaderboard */}
    {leaderboard.length > 0 ? (
      <Card padding="none">
        <CardContent>
          <LeaderboardTable data={leaderboard} players={players} />
        </CardContent>
      </Card>
    ) : (
      <Card className="text-center">
        <CardContent className="py-12">
          <Trophy className="mx-auto mb-4 h-12 w-12 text-fg-subtle" />
          <h2 className="text-xl font-semibold text-fg mb-2">No Standings Yet</h2>
          <p className="text-fg-muted">
            Standings will appear here once events have been completed.
          </p>
        </CardContent>
      </Card>
    )}
  </div>
);

export default StandingsPageView;