import React from 'react';
import { Card, CardContent, Heading, Badge } from '../components/ui';
import { Trophy, Clock, Award } from 'lucide-react';

const SeasonOverview: React.FC = () => (
  <div className="space-y-6">
    <Heading as="h2" description="Compete for exclusive prizes in our inaugural competitive season">
      Season 1 Championship
    </Heading>

    <div className="grid gap-6 lg:grid-cols-2">
      {/* Duration Section */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-subtle">
              <Clock className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-fg">Season Duration</h3>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-fg">4 Weeks</div>
            <p className="text-fg-muted">Every Sunday • 7PM-10PM</p>
          </div>
        </CardContent>
      </Card>

      {/* Prizes Section */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-subtle">
              <Trophy className="h-5 w-5 text-warning" />
            </div>
            <h3 className="text-lg font-semibold text-fg">Championship Rewards</h3>
          </div>
          <p className="mb-4 text-sm text-fg-muted">
            Top 3 finishers earn exclusive Joola gear and club points:
          </p>

          <div className="space-y-3">
            {/* 1st Place */}
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <Badge variant="warning">1st</Badge>
                <div>
                  <div className="font-medium text-fg">Champion</div>
                  <div className="text-sm text-fg-muted">Joola Hat + 25 Club Points</div>
                </div>
              </div>
              <Award className="h-5 w-5 text-warning" />
            </div>

            {/* 2nd Place */}
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <Badge variant="default">2nd</Badge>
                <div>
                  <div className="font-medium text-fg">Runner-up</div>
                  <div className="text-sm text-fg-muted">Joola Water Bottle + 15 Club Points</div>
                </div>
              </div>
              <Award className="h-5 w-5 text-fg-subtle" />
            </div>

            {/* 3rd Place */}
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <Badge variant="default">3rd</Badge>
                <div>
                  <div className="font-medium text-fg">Third Place</div>
                  <div className="text-sm text-fg-muted">Joola Wristbands + 10 Club Points</div>
                </div>
              </div>
              <Award className="h-5 w-5 text-fg-subtle" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default SeasonOverview;
