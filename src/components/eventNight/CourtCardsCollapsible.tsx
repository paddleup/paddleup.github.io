// Redesigned CourtCardsCollapsible — mobile-first, semantic, accessible

import React, { useState } from 'react';
import type { Court, CourtWithDrawAndGames } from '../../types';
import CourtCard from './CourtCard';

interface CourtCardsCollapsibleProps {
  courts: CourtWithDrawAndGames[];
  players: any[];
  isAdmin: boolean;
  showLiveBanner: boolean;
  handleScoreChange: any;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

const CourtCardsCollapsible: React.FC<CourtCardsCollapsibleProps> = ({
  courts,
  players,
  isAdmin,
  showLiveBanner,
  handleScoreChange,
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4 mt-4">
      {courts.map((court, ci) => (
        <div
          key={court.id ?? ci}
          className={`rounded-xl shadow border border-border bg-surface transition-all duration-200 ${
            openIdx === ci ? 'ring-2 ring-primary' : ''
          }`}
        >
          <button
            className="w-full flex items-center justify-between px-4 py-5 text-lg font-bold text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            onClick={() => setOpenIdx(openIdx === ci ? null : ci)}
            aria-expanded={openIdx === ci}
            tabIndex={0}
          >
            <span className="flex flex-col items-start gap-1">
              <span className="flex items-center gap-2">
                <span className="font-bold text-text-main">
                  Court {court.courtNumber ?? ci + 1}
                </span>
                {court.tier && (
                  <span className="bg-surface-alt text-text-muted px-2 py-0.5 rounded-full text-xs font-semibold border border-border ml-1">
                    Tier {court.tier}
                  </span>
                )}
              </span>
              <span className="flex flex-wrap gap-2 mt-1">
                {court.playerIds.map((pid) => {
                  const player = players.find((p) => p.id === pid);
                  return (
                    <span
                      key={pid}
                      className="flex items-center gap-1 px-2 py-1 bg-surface-alt rounded-full text-xs font-semibold text-text-main border border-border"
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold">
                        {player?.name ? getInitials(player.name) : '?'}
                      </span>
                      <span className="truncate max-w-[80px]">{player?.name ?? pid}</span>
                    </span>
                  );
                })}
              </span>
            </span>
            <span className="text-xs text-text-muted ml-2">
              {openIdx === ci ? 'Collapse' : 'Expand'}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIdx === ci ? 'max-h-[1000px] py-2' : 'max-h-0'
            }`}
          >
            {openIdx === ci && (
              <CourtCard
                court={court}
                players={players}
                editableScores={isAdmin && showLiveBanner}
                onScoreChange={isAdmin && showLiveBanner ? handleScoreChange : undefined}
                roundNumber={ci + 1}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourtCardsCollapsible;
