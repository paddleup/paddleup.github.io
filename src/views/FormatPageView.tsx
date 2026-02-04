import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Clock,
  Users,
  Swords,
  Star,
  ExternalLink,
  Award,
  Target,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Card, CardContent, Heading, Badge, Button, Stat, StatGroup } from '../components/ui';

const FormatPageView: React.FC = () => {
  useEffect(() => {
    document.title = 'Paddle Up — League Format';
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <Heading as="h1" description="Everything you need to know about how the league works">
        League Format
      </Heading>

      {/* Season Overview */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-subtle">
              <Trophy className="h-5 w-5 text-warning" />
            </div>
            <h2 className="text-xl font-semibold text-fg">Season 1 Championship</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Duration */}
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-fg-muted" />
                <span className="font-medium text-fg">Season Duration</span>
              </div>
              <div className="text-3xl font-bold text-fg mb-1">4 Weeks</div>
              <div className="text-sm text-fg-muted">Every Sunday • 7PM-10PM</div>
            </div>

            {/* Prizes */}
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-4 w-4 text-fg-muted" />
                <span className="font-medium text-fg">Championship Rewards</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">1st</Badge>
                    <span className="text-sm text-fg">Joola Hat + 25 Points</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">2nd</Badge>
                    <span className="text-sm text-fg">Joola Bottle + 15 Points</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">3rd</Badge>
                    <span className="text-sm text-fg">Joola Wristbands + 10 Points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nightly Format Stats */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-subtle">
              <Clock className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-xl font-semibold text-fg">Nightly Format</h2>
          </div>

          <StatGroup columns={4}>
            <Stat label="Schedule" value="7-10 PM" description="Every Sunday" />
            <Stat label="Entry Fee" value="$20" description="Free for members" />
            <Stat label="Eligibility" value="3.5+" description="DUPR Required" />
            <Stat label="Format" value="2 Rounds" description="per night" />
          </StatGroup>
        </CardContent>
      </Card>

      {/* Game Format */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-subtle">
              <Swords className="h-5 w-5 text-success" />
            </div>
            <h2 className="text-xl font-semibold text-fg">Game Format</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border p-4 text-center">
              <Users className="mx-auto mb-3 h-8 w-8 text-fg-muted" />
              <div className="text-2xl font-bold text-fg mb-1">4-5</div>
              <div className="text-sm text-fg-muted">Players per Court</div>
            </div>

            <div className="rounded-lg border border-border p-4 text-center">
              <Target className="mx-auto mb-3 h-8 w-8 text-fg-muted" />
              <div className="text-lg font-semibold text-fg mb-1">Rotate Partners</div>
              <div className="text-sm text-fg-muted">Partner once per round</div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="text-center mb-3">
                <Trophy className="mx-auto h-8 w-8 text-fg-muted" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between rounded bg-bg-muted px-2 py-1">
                  <span className="text-fg-muted">4 Players</span>
                  <span className="font-medium text-fg">3 games to 15</span>
                </div>
                <div className="flex justify-between rounded bg-bg-muted px-2 py-1">
                  <span className="text-fg-muted">5 Players</span>
                  <span className="font-medium text-fg">4 games to 11</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Round Details */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Round 1 */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-fg">Round 1: Initial Seeding</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-subtle">
                  <span className="text-xs">🎲</span>
                </div>
                <div>
                  <div className="font-medium text-fg">Court Assignment</div>
                  <div className="text-sm text-fg-muted">Snake draft (back-and-forth order)</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-success-subtle">
                  <span className="text-xs">📊</span>
                </div>
                <div>
                  <div className="font-medium text-fg">Seeding Basis</div>
                  <div className="text-sm text-fg-muted">
                    Based on previous weeks (random for week 1)
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Round 2 */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning text-white font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-fg">Round 2: Ranked Courts</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-warning-subtle">
                  <span className="text-xs">🏆</span>
                </div>
                <div>
                  <div className="font-medium text-fg">Court Placement</div>
                  <div className="text-sm text-fg-muted">Ranked by Round 1 performance</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-subtle">
                  <span className="text-xs">🎯</span>
                </div>
                <div>
                  <div className="font-medium text-fg">Court Assignment</div>
                  <div className="text-sm text-fg-muted">
                    Top finishers → Court 1, next → Court 2, etc.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Points System */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-subtle">
              <Star className="h-5 w-5 text-warning" />
            </div>
            <h2 className="text-xl font-semibold text-fg">Points & Prizes</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Finisher Points */}
            <div>
              <h3 className="font-medium text-fg mb-3">Top Finisher Points</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-warning bg-warning-subtle px-3 py-2">
                  <span className="font-medium text-fg">1st Place</span>
                  <span className="font-bold text-fg">1,000 pts</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <span className="font-medium text-fg">2nd Place</span>
                  <span className="font-bold text-fg">800 pts</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <span className="font-medium text-fg">3rd Place</span>
                  <span className="font-bold text-fg">600 pts</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <span className="font-medium text-fg">4th Place</span>
                  <span className="font-bold text-fg">500 pts</span>
                </div>
              </div>
            </div>

            {/* Point System Info */}
            <div>
              <h3 className="font-medium text-fg mb-3">Point System</h3>
              <div className="space-y-3">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-sm text-fg-muted">
                    <strong className="text-fg">All positions earn points</strong> — points halve
                    approximately every 3 ranks.
                  </p>
                </div>
                <div className="rounded-lg border border-accent bg-accent-subtle p-3">
                  <p className="text-sm text-fg">
                    Points count toward <strong>monthly, seasonal, and all-time rankings</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Takeaways */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-subtle">
              <Check className="h-5 w-5 text-success" />
            </div>
            <h2 className="text-xl font-semibold text-fg">Key Takeaways</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Check className="h-4 w-4 text-success" />
              <span className="text-sm text-fg">Competitive league for DUPR 3.5+ players</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Check className="h-4 w-4 text-success" />
              <span className="text-sm text-fg">Sunday evenings, 7PM–10PM</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Check className="h-4 w-4 text-success" />
              <span className="text-sm text-fg">Two rounds each night with partner rotation</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Check className="h-4 w-4 text-success" />
              <span className="text-sm text-fg">Points determine standings and rankings</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="text-center">
        <CardContent className="py-8">
          <Trophy className="mx-auto mb-4 h-12 w-12 text-accent" />
          <h2 className="text-2xl font-bold text-fg mb-2">Ready to Compete?</h2>
          <p className="text-fg-muted max-w-xl mx-auto mb-6">
            Check your standings online and track points for this season and all-time rankings.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/standings">
              <Button
                variant="primary"
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
              >
                View Standings
              </Button>
            </Link>
            <Link to="/schedule">
              <Button
                variant="secondary"
                icon={<ExternalLink className="h-4 w-4" />}
                iconPosition="right"
              >
                Register for Event
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormatPageView;
