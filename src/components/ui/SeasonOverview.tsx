// src/components/ui/SeasonOverview.tsx
import React from 'react';
import PremiumSection from './PremiumSection';
import SectionHeader from './SectionHeader';
import FeatureCard from './FeatureCard';
import { Trophy, Clock } from 'lucide-react';

const SeasonOverview: React.FC = () => (
  <PremiumSection primaryColor="warning" secondaryColor="primary">
    <SectionHeader
      icon={Trophy}
      title="Season 1 Championship"
      subtitle="Compete for exclusive prizes and eternal glory in our inaugural competitive season"
      iconColor="warning"
    />

    <div className="grid lg:grid-cols-2 gap-12 items-start">
      {/* Duration Section */}
      <div className="text-center lg:text-left">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20 shadow-lg">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <Clock className="h-8 w-8 text-primary" />
            <h3 className="text-2xl font-bold text-text-main">Season Duration</h3>
          </div>
          <div className="space-y-4">
            <div className="text-center lg:text-left">
              <div className="text-4xl font-black text-primary mb-2">4</div>
              <div className="text-xl font-semibold text-text-main">Weeks of Competition</div>
              <div className="text-text-muted mt-2">Every Sunday • 7PM-10PM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Prizes Section */}
      <div>
        <h3 className="text-2xl font-bold text-text-main mb-6 text-center lg:text-left">
          Championship Rewards
        </h3>
        <p className="text-text-muted mb-6 text-center lg:text-left">
          Top 3 finishers earn exclusive Joola gear and club points:
        </p>

        <div className="space-y-4">
          <FeatureCard
            badgeContent="1st"
            title="Champion"
            description={
              <>
                <span className="font-semibold text-warning">Joola Hat</span> +
                <span className="font-semibold text-primary ml-1">25 Club Points</span>
              </>
            }
            emoji="🧢"
            color="warning"
          />

          <FeatureCard
            badgeContent="2nd"
            title="Runner-up"
            description={
              <>
                <span className="font-semibold text-text-accent">Joola Water Bottle</span> +
                <span className="font-semibold text-primary ml-1">15 Club Points</span>
              </>
            }
            emoji="🍶"
            color="text-accent"
          />

          <FeatureCard
            badgeContent="3rd"
            title="Third Place"
            description={
              <>
                <span className="font-semibold text-bronze">Joola Wristbands</span> +
                <span className="font-semibold text-primary ml-1">10 Club Points</span>
              </>
            }
            emoji="⌚"
            color="bronze"
          />
        </div>
      </div>
    </div>
  </PremiumSection>
);

export default SeasonOverview;
