import React from 'react';
import Card from '../ui/Card';
import { Users, Trophy } from 'lucide-react';
import { rules } from '../../data/rules';

const PreSeasonQualifiers: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-text-main mb-4">Pre-Season Qualifiers</h2>
        <p className="text-text-muted max-w-2xl mx-auto">Before each season begins, we host two Open Qualifier events to fill the open roster spots.</p>
      </div>

      <Card className="max-w-4xl mx-auto p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Who Can Play
            </h3>
            <ul className="space-y-2">
              {rules.qualification.who.map((item, i) => (
                <li key={i} className="flex items-start text-text-muted">
                  <span className="mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Advancement
            </h3>
            <ul className="space-y-2">
              {rules.qualification.advancement.map((item, i) => (
                <li key={i} className="flex items-start text-text-muted">
                  <span className="mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-text-muted italic">
            <span className="font-bold text-primary">Note:</span> {rules.qualification?.note}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PreSeasonQualifiers;
