import React from 'react';
import { Clock, MapPin, DollarSign, User, ExternalLink } from 'lucide-react';
import Card from '../ui/Card';
import { rules } from '../../data/rules';
import type { Rules } from '../../types';

interface Props {
  viewRules?: Rules;
}

const QuickInfoGrid: React.FC<Props> = ({ viewRules }) => {
  const effectiveRules = viewRules ?? rules;
  const effectivePrice =
    ('price' in effectiveRules && (effectiveRules as any).price)
      ? (effectiveRules as any).price
      : { display: rules.fee, note: rules.seasonStructure?.duration };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
      <Card className="p-4 flex flex-col items-center justify-center text-center">
        <Clock className="h-6 w-6 text-primary mb-2" />
        <span className="font-bold text-text-main">{effectiveRules.schedule?.day}</span>
        <span className="text-sm text-text-muted">{effectiveRules.schedule?.time}</span>
      </Card>

      <a href={effectiveRules.location?.url} target="_blank" rel="noopener noreferrer" className="block group">
        <Card className="p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors h-full">
          <MapPin className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-text-main">{effectiveRules.location?.name}</span>
          <span className="text-sm text-text-muted flex items-center gap-1">
            {effectiveRules.location?.city} <ExternalLink className="h-3 w-3" />
          </span>
        </Card>
      </a>

      <Card className="p-4 flex flex-col items-center justify-center text-center">
        <DollarSign className="h-6 w-6 text-primary mb-2" />
        <span className="font-bold text-text-main">{effectivePrice.display}</span>
        <span className="text-sm text-text-muted">{effectivePrice.note}</span>
      </Card>

      <Card className="p-4 flex flex-col items-center justify-center text-center">
        <User className="h-6 w-6 text-primary mb-2" />
        <span className="font-bold text-text-main">{effectiveRules.participant?.type}</span>
        <span className="text-sm text-text-muted">{effectiveRules.participant?.note}</span>
      </Card>
    </div>
  );
};

export default QuickInfoGrid;
