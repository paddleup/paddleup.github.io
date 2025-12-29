import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rules } from '../data/rules';
import { Users, CheckCircle, AlertCircle, MapPin, ExternalLink } from 'lucide-react';
import WeeklyPoints from '../components/WeeklyPoints';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import ToggleGroup from '../components/ui/ToggleGroup';
import QuickInfoGrid from '../components/format/QuickInfoGrid';
import ScoringSection from '../components/format/ScoringSection';
import SeasonStructure from '../components/format/SeasonStructure';
import PrizesRewards from '../components/format/PrizesRewards';
import PrizeGrid from '../components/format/PrizeGrid';
import PreSeasonQualifiers from '../components/format/PreSeasonQualifiers';
import NightlyFormat from '../components/format/NightlyFormat';
import FAQSection from '../components/format/FAQSection';
import ContactCard from '../components/format/ContactCard';
import { leagueRules, challengeRules } from '../data/rules';

const Format: React.FC = () => {
  const [view, setView] = useState<'current' | 'future'>('current');
  const selected = view === 'current' ? challengeRules : leagueRules;
  const price =
    view === 'current'
      ? (challengeRules.price as { display: string; note?: string })
      : { display: leagueRules.fee, note: leagueRules.seasonStructure?.duration };
  const showSections =
    view === 'current'
      ? challengeRules.showSections ?? { seasonStructure: false, prizes: false, qualifiers: false }
      : { seasonStructure: true, prizes: true, qualifiers: true };

  useEffect(() => {
    document.title = `${rules.title} — ${selected.title}`;
  }, [selected.title]);

  return (
    <div className="space-y-16 pb-12">
      <PageHeader
        title={selected.title}
        subtitle="Rotating partners, weekly standings with promotion/relegation, weekly points, open qualifiers, and season prizes."
        center
      />

      <div className="flex justify-center mt-6">
        <ToggleGroup
          options={[
            { value: 'current', label: 'The Challenge (Current)' },
            { value: 'future', label: 'Championship League (Future)' },
          ]}
          value={view}
          onChange={(v) => setView(v as 'current' | 'future')}
          className="bg-surface-highlight p-1 rounded-xl inline-flex border border-border"
        />
      </div>

      {/* Hero banner for the selected view */}
      <div className="max-w-5xl mx-auto mt-6 rounded-3xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-primary to-primary-light p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-extrabold mb-2">{selected.title}</h3>
            <p className="text-lg md:text-xl opacity-90">{selected.summary}</p>
          </div>

          <div className="flex-shrink-0 text-center md:text-right">
            <div className="text-2xl font-bold">{price.display}</div>
            <div className="text-sm opacity-90 mb-4">{price.note}</div>
            {view === 'current' ? (
              <Link
                to="/schedule"
                className="inline-block bg-white text-primary px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
              >
                Register for Tonight
              </Link>
            ) : (
              <a
                href={rules.register.url}
                className="inline-block bg-white text-primary px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
              >
                Register for Season
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Quick Info Grid */}
      <QuickInfoGrid viewRules={selected} />

      {/* Scoring */}
      <ScoringSection />

      {/* Season Structure */}
      {showSections.seasonStructure && <SeasonStructure />}

      {/* Prizes & Rewards */}
      {showSections.prizes && <PrizesRewards />}

      {/* Monthly Prizes (Challenge) */}
      {view === 'current' && (
        <div className="max-w-4xl mx-auto">
          <PrizeGrid
            heading="Monthly Prizes"
            subtitle="At the end of each month, the top 3 players in the monthly standings will receive club points as rewards for their performance."
            entries={[
              { title: '1st', items: ['50 Club Pts'], accent: true },
              { title: '2nd', items: ['30 Club Pts'] },
              { title: '3rd', items: ['20 Club Pts'] },
            ]}
          />
        </div>
      )}

      {/* Pre-Season Qualifiers */}
      {showSections.qualifiers && <PreSeasonQualifiers />}

      {/* Seeding & Assignments */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-main mb-4">Seeding & Assignments</h2>
          <p className="text-text-muted max-w-2xl mx-auto">{rules.seeding?.overview}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Initial Seeding
            </h3>
            <p className="text-text-muted mb-4">{rules.seeding?.week1}</p>
            <div className="bg-surface-highlight p-4 rounded-lg border border-border">
              <h4 className="font-bold text-sm text-text-main mb-2">Why Seeding Matters</h4>
              <p className="text-sm text-text-muted">
                Higher seeds are placed in groups with lower-seeded opponents in Round 1, giving top
                players a statistical advantage to finish Top 2 and advance.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              The Snake Draw
            </h3>
            <p className="text-text-muted mb-4">{rules.seeding?.draw}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-surface-highlight p-2 rounded border border-border">
                <span className="font-bold block text-primary">Court 1</span>
                <span className="text-text-muted">Seeds 1, 8, 9, 16</span>
              </div>
              <div className="bg-surface-highlight p-2 rounded border border-border">
                <span className="font-bold block text-primary">Court 2</span>
                <span className="text-text-muted">Seeds 2, 7, 10, 15</span>
              </div>
              <div className="bg-surface-highlight p-2 rounded border border-border">
                <span className="font-bold block text-primary">Court 3</span>
                <span className="text-text-muted">Seeds 3, 6, 11, 14</span>
              </div>
              <div className="bg-surface-highlight p-2 rounded border border-border">
                <span className="font-bold block text-primary">Court 4</span>
                <span className="text-text-muted">Seeds 4, 5, 12, 13</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Nightly Format */}
      <NightlyFormat />

      {/* Weekly Points */}
      <div className="max-w-4xl mx-auto">
        <WeeklyPoints />
        <p className="text-center text-sm text-text-muted mt-4 italic">{rules.missedWeekNote}</p>
      </div>

      {/* How to Join */}
      <div className="bg-primary-light rounded-2xl p-8 md:p-12 text-center border border-primary/50">
        <h2 className="text-3xl font-bold text-text-main mb-4">Ready to Compete?</h2>
        <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
          Registration is open for the upcoming season. Secure your spot now.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <a
            href={rules.register.url}
            className="bg-primary text-text-main px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            {rules.register.text}
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
        <p className="text-sm text-text-muted mt-6">
          *Future seasons may require participation in qualifying nights to earn a roster spot.
        </p>
      </div>

      {/* Rules & Policies Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Eligibility */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-success" />
            <h2 className="text-xl font-bold text-text-main">Eligibility</h2>
          </div>
          <ul className="space-y-3">
            {Array.isArray(rules.general) && rules.general.length > 0 ? (
              rules.general.map((rule: string, index: number) => (
                <li key={index} className="flex items-start text-text-muted">
                  <span className="mr-2">•</span>
                  {rule}
                </li>
              ))
            ) : (
              <li className="text-text-muted">No eligibility rules provided.</li>
            )}
          </ul>
        </Card>

        {/* Substitutes */}
        {view !== 'current' && (
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-warning" />
              <h2 className="text-xl font-bold text-text-main">Substitute Policy</h2>
            </div>
            <ul className="space-y-3">
              {Array.isArray(rules.subs) && rules.subs.length > 0 ? (
                rules.subs.map((rule: string, index: number) => (
                  <li key={index} className="flex items-start text-text-muted">
                    <span className="mr-2">•</span>
                    {rule}
                  </li>
                ))
              ) : (
                <li className="text-text-muted">No substitute policy provided.</li>
              )}
            </ul>
          </Card>
        )}
      </div>

      {/* FAQ & Contact Section */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="md:col-span-2 space-y-8">
          <FAQSection hideChallengeFAQs={view === 'current'} />
        </div>

        <div className="md:col-span-1">
          <ContactCard />
        </div>
      </div>
    </div>
  );
};

export default Format;
