import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight, Users, Calendar, ExternalLink } from 'lucide-react';
import {
  Card,
  CardContent,
  Heading,
  Badge,
  Button,
  Avatar,
  Stat,
  StatGroup,
} from '../components/ui';
import SeasonOverview from './SeasonOverview';

type HomePageProps = {
  players: any[];
  topPlayers: any[];
  seriesLabel: string;
  nextEvent: any;
};

const formatNiceDate = (d?: Date | null) =>
  d ? d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : '';

const formatNiceTime = (d?: Date | null) =>
  d ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

const HomePageView: React.FC<HomePageProps> = ({ players, topPlayers, seriesLabel, nextEvent }) => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-8">
        <Badge variant="success" className="mb-4">
          <span className="mr-2">●</span> {seriesLabel} is Live
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-fg mb-4">
          Paddle Up
          <span className="block text-accent">Premier League</span>
        </h1>

        <p className="text-lg text-fg-muted max-w-2xl mx-auto mb-8">
          Join our competitive pickleball league designed for advanced players looking to test their
          skills and climb the rankings each week.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/standings">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="h-4 w-4" />}
              iconPosition="right"
            >
              View Standings
            </Button>
          </Link>
          <Link to="/format">
            <Button variant="secondary" size="lg">
              League Format
            </Button>
          </Link>
        </div>
      </div>

      {/* League Stats */}
      <div className="space-y-6">
        <Heading as="h2" description="Weekly competitive action with structured format">
          League Overview
        </Heading>

        <Card>
          <CardContent>
            <StatGroup columns={4}>
              <Stat label="Players" value="16" description="per night" />
              <Stat label="Schedule" value="7-10 PM" description="Every Sunday" />
              <Stat label="Prize Pool" value="100" description="Club Points" />
              <Stat label="Level" value="3.5+ DUPR" description="Required" />
            </StatGroup>
          </CardContent>
        </Card>
      </div>

      {/* Season Overview */}
      <SeasonOverview />

      {/* Current Leaders & Next Event */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Leaders */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-subtle">
                  <Trophy className="h-5 w-5 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-fg">Current Leaders</h3>
              </div>
              <Link
                to="/standings"
                className="text-sm font-medium text-accent hover:underline flex items-center gap-1"
              >
                Full Standings <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {topPlayers.map((entry: any, index: number) => {
                const player =
                  players.find((p) => p.id === entry.playerId) ||
                  ({ name: 'Unknown', imageUrl: '', id: 'unknown' } as any);
                return (
                  <Link
                    key={entry.playerId}
                    to={`/player/${entry.playerId}`}
                    className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-bg-subtle transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-muted text-sm font-medium text-fg-muted">
                        {index + 1}
                      </span>
                      <Avatar src={player.imageUrl} alt={player.name} size="sm" />
                      <span className="font-medium text-fg">{player.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-fg">{entry.points} pts</span>
                      <span className="block text-xs text-fg-muted">{entry.events} Events</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Next Event */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-subtle">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-fg">Next Match Night</h3>
            </div>

            {nextEvent ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between rounded-lg border border-border p-3">
                    <span className="text-fg-muted">Date</span>
                    <span className="font-medium text-fg">
                      {formatNiceDate(nextEvent.startDateTime)}
                    </span>
                  </div>
                  <div className="flex justify-between rounded-lg border border-border p-3">
                    <span className="text-fg-muted">Time</span>
                    <span className="font-medium text-fg">
                      {formatNiceTime(nextEvent.startDateTime)}
                    </span>
                  </div>
                  <div className="flex justify-between rounded-lg border border-border p-3">
                    <span className="text-fg-muted">Location</span>
                    <span className="font-medium text-fg">{nextEvent.location}</span>
                  </div>
                </div>

                <a
                  href={nextEvent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="primary"
                    className="w-full"
                    icon={<ExternalLink className="h-4 w-4" />}
                    iconPosition="right"
                  >
                    Register on CourtReserve
                  </Button>
                </a>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-fg-subtle mx-auto mb-4" />
                <p className="text-fg-muted mb-4">No upcoming match nights are listed.</p>
                <Link to="/schedule">
                  <Button variant="secondary">View Schedule</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="text-center">
        <CardContent className="py-12">
          <Users className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-fg mb-2">Ready to Compete?</h2>
          <p className="text-fg-muted max-w-xl mx-auto mb-6">
            We are always looking for competitive players to join the roster. Check out the format
            and rules to see if you qualify for our premier league.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/format">
              <Button
                variant="primary"
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
              >
                View League Format
              </Button>
            </Link>
            <Link to="/standings">
              <Button variant="secondary">Current Standings</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePageView;
