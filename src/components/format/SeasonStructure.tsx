import React from 'react';
import Card from '../ui/Card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { rules } from '../../data/rules';

const SeasonStructure: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-text-main mb-4">Season Structure</h2>
        <p className="text-text-muted max-w-2xl mx-auto">
          {rules.seasonStructure.duration} • {rules.seasonStructure.when} • {rules.seasonStructure.rosterSize} Players
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="p-6 border-success/20 bg-success/5">
          <h3 className="text-xl font-bold text-success mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            The Safe Zone
          </h3>
          <p className="text-text-main font-medium mb-2">
            {`Top ${Math.max(0, Number(rules.seasonStructure.rosterSize) - 4)} Players`}
          </p>
          <p className="text-text-muted">{rules.seasonStructure.safeZone}</p>
        </Card>

        <Card className="p-6 border-error/20 bg-error/5">
          <h3 className="text-xl font-bold text-error mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            The Drop Zone
          </h3>
          <p className="text-text-main font-medium mb-2">Bottom 4 Players</p>
          <p className="text-text-muted">{rules.seasonStructure.dropZone}</p>
        </Card>
      </div>
    </div>
  );
};

export default SeasonStructure;
