import React from 'react';
import { Medal } from 'lucide-react';
import { rules } from '../data/rules';

const WeeklyPoints: React.FC = () => {
  const { points } = rules;

  const courts = [
    { name: "Championship Court", data: points.championship },
    { name: "Court 2", data: points.court2 },
    { name: "Court 3", data: points.court3 },
    { name: "Court 4", data: points.court4 },
  ];

  return (
    <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
      <h3 className="font-bold text-text-main mb-4 flex items-center">
        <Medal className="h-5 w-5 text-primary mr-2" />
        Weekly Point System
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {courts.map((court) => (
          <div key={court.name} className="bg-surface-highlight p-4 rounded-lg">
            <h3 className="font-bold text-text-main mb-2 text-center text-sm md:text-base">{court.name}</h3>
            <div className="space-y-1 text-sm text-center">
              <div className="flex justify-between"><span className="text-text-muted">1st</span> <span className="font-bold text-success">+{court.data[1]}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">2nd</span> <span className="font-bold text-success">+{court.data[2]}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">3rd</span> <span className="font-bold text-success">+{court.data[3]}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">4th</span> <span className="font-bold text-success">+{court.data[4]}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyPoints;
