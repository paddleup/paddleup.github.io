import React from 'react';
import Card from '../ui/Card';
import { Trophy, CheckCircle } from 'lucide-react';

type Entry = {
  title: string;
  items: readonly string[];
  accent?: boolean;
};

type Props = {
  heading?: string;
  subtitle?: string;
  entries: Entry[];
  notes?: string;
};

const PrizeGrid: React.FC<Props> = ({ heading, subtitle, entries, notes }) => {
  return (
    <div className="space-y-8">
      {heading && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-main mb-4">{heading}</h2>
          {subtitle && <p className="text-text-muted max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {entries.map((e, idx) => (
          <Card
            key={idx}
            className={`p-6 relative overflow-hidden ${e.accent ? 'border-warning/50 bg-warning/10' : 'border-border'}`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy className="h-24 w-24 text-warning" />
            </div>

            <div className="relative z-10">

              <div className="flex items-center gap-3 mb-4">
                <div className="bg-surface-highlight text-text-muted p-2 rounded-lg border border-border">
                  <span className="font-bold text-lg">{e.title}</span>
                </div>
                <h3 className="text-xl font-bold text-text-main">{`${e.title} Place`}</h3>
              </div>

              <ul className="space-y-3">
                {e.items.map((it, i) => (
                  <li key={i} className={`flex items-start gap-2 ${e.accent ? 'text-text-main font-medium' : 'text-text-muted'}`}>
                    <CheckCircle className={`h-5 w-5 ${e.accent ? 'text-warning' : 'text-text-muted'} shrink-0`} />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      {notes && (
        <div className="text-center">
          <p className="text-sm text-text-muted italic">{notes}</p>
        </div>
      )}
    </div>
  );
};

export default PrizeGrid;
