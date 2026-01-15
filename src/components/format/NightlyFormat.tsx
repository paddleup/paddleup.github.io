import React from 'react';
import { ArrowDown, ArrowUp, Users, Trophy } from 'lucide-react';
import Card from '../ui/Card';
import { rules, challengeRules } from '../../data/rules';

interface NightlyFormatProps {
  viewRules?: typeof rules | typeof challengeRules;
}

const NightlyFormat: React.FC<NightlyFormatProps> = ({ viewRules = challengeRules }) => {
  // Use the provided viewRules or default to challengeRules
  const formatRules = viewRules.format || [];
  const isChallenge = viewRules === challengeRules;

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-text-main mb-4">The Nightly Format</h2>
        <p className="text-text-muted max-w-2xl mx-auto">
          {isChallenge
            ? 'Two rounds of structured play. Rotating partners with merit-based court advancement.'
            : 'Three rounds of intense play. Perform well to move up; struggle and you move down.'}
        </p>
      </div>

      <div className="relative">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -z-10 transform -translate-x-1/2"></div>

        <div className="space-y-12">
          {formatRules.map(
            (round: { title?: string; description?: string | string[] }, idx: number) => (
              <div key={idx} className="relative">
                <Card className="p-8 max-w-3xl mx-auto">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-text-main px-4 py-1 rounded-full text-sm font-bold">
                    {`ROUND ${idx + 1}`}
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="bg-primary-light p-4 rounded-full">
                      {idx === 0 ? (
                        <Users className="h-8 w-8 text-primary" />
                      ) : idx === 1 ? (
                        <ArrowUp className="h-8 w-8 text-primary" />
                      ) : (
                        <Trophy className="h-8 w-8 text-warning" />
                      )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold text-text-main mb-2">{round.title}</h3>
                      <div className="text-text-muted text-left">
                        {Array.isArray(round.description) ? (
                          <ul className="list-disc pl-5 space-y-1 inline-block text-left">
                            {round.description.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{round.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {idx < formatRules.length - 1 && (
                  <div className="flex justify-center">
                    <div className="bg-surface p-2 rounded-full border border-border shadow-sm">
                      <ArrowDown className="h-6 w-6 text-text-muted" />
                    </div>
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default NightlyFormat;
