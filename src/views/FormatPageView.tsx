import React from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Clock,
  Users,
  Target,
  ArrowRight,
  Check,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';

const FormatPageView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Season Overview */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Season 1 Championship
        </h2>
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">Duration</span>
              </div>
              <span className="font-medium text-slate-900 dark:text-slate-100">Feb - Apr 2026</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">Schedule</span>
              </div>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                Sundays 7-10 PM
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">Entry Fee</span>
              </div>
              <span className="font-medium text-slate-900 dark:text-slate-100">$20/night</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">Eligibility</span>
              </div>
              <span className="font-medium text-slate-900 dark:text-slate-100">DUPR 3.5+</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Prizes */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Season Prizes
        </h2>
        <div className="space-y-2">
          <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300 font-bold">
                  1
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">First Place</span>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Joola Hat + 25 pts</span>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                  2
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">Second Place</span>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Joola Bottle + 15 pts
              </span>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-200 dark:bg-orange-800/50 text-orange-700 dark:text-orange-300 font-bold">
                  3
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">Third Place</span>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Wristbands + 10 pts
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* Game Format */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Nightly Format
        </h2>
        <Card>
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <Users className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                4-5 Players
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">per court</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  2 Rounds
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">per night</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Rotating
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">partners</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">4 Players</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  3 games to 15
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">5 Players</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  4 games to 11
                </span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Round System */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Round System
        </h2>
        <div className="space-y-3">
          <Card>
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-white text-sm font-bold shrink-0">
                1
              </span>
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                  Initial Seeding
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Snake draft based on previous results (random for week 1)
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white text-sm font-bold shrink-0">
                2
              </span>
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                  Ranked Courts
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Top Round 1 finishers → Court 1, next group → Court 2, etc.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Points System */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Points System
        </h2>
        <Card>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Badge variant="warning">1st</Badge>
                <span className="text-slate-900 dark:text-slate-100">First Place</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100">1,000 pts</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Badge>2nd</Badge>
                <span className="text-slate-900 dark:text-slate-100">Second Place</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100">800 pts</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Badge>3rd</Badge>
                <span className="text-slate-900 dark:text-slate-100">Third Place</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100">600 pts</span>
            </div>
            <div className="flex justify-between py-2">
              <div className="flex items-center gap-2">
                <Badge>4th</Badge>
                <span className="text-slate-900 dark:text-slate-100">Fourth Place</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100">500 pts</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              All positions earn points. Points count toward monthly, seasonal, and all-time
              rankings.
            </p>
          </div>
        </Card>
      </section>

      {/* Key Points */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Quick Summary
        </h2>
        <Card>
          <div className="space-y-3">
            {[
              'Competitive league for DUPR 3.5+ players',
              'Sunday evenings, 7PM–10PM',
              'Two rounds each night with partner rotation',
              'Points determine standings and rankings',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* CTA */}
      <Card className="text-center">
        <Trophy className="w-10 h-10 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Ready to Compete?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Check standings and register for upcoming events.
        </p>
        <div className="flex flex-col gap-2">
          <Link to="/standings">
            <Button className="w-full">
              <Trophy className="w-4 h-4" />
              View Standings
            </Button>
          </Link>
          <Link to="/schedule">
            <Button variant="secondary" className="w-full">
              <ArrowRight className="w-4 h-4" />
              View Schedule
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default FormatPageView;
