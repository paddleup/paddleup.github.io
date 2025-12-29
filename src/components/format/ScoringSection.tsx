import React from 'react';
import Card from '../ui/Card';
import { rules } from '../../data/rules';

const ScoringSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto mt-6">
      <Card className="p-4">
        <h3 className="font-bold text-text-main mb-2">Scoring</h3>
        <ul className="text-text-muted list-disc pl-5 space-y-1">
          {Array.isArray(rules.scoring) && rules.scoring.length > 0 ? (
            rules.scoring.map((s: string, i: number) => <li key={i}>{s}</li>)
          ) : (
            <li className="text-text-muted">No scoring details available.</li>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default ScoringSection;
