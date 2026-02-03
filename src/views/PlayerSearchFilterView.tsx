import React from 'react';
import { Search, X } from 'lucide-react';
import { Avatar } from '../components/ui';
import { Player } from '../types';
import { cn } from '../lib/utils';

interface PlayerSearchFilterViewProps {
  searchTerm: string;
  onInputChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
  isOpen: boolean;
  filteredPlayers: Player[];
  onPlayerClick: (playerId: string) => void;
}

const PlayerSearchFilterView: React.FC<PlayerSearchFilterViewProps> = ({
  searchTerm,
  onInputChange,
  onClear,
  placeholder = 'Find your name...',
  className = '',
  isOpen,
  filteredPlayers,
  onPlayerClick,
}) => (
  <div className={cn('relative', className)}>
    {/* Search Input */}
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-10 rounded-md border border-border bg-bg-subtle text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-bg-muted hover:bg-bg text-fg-muted hover:text-fg transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>

    {/* Search Results Dropdown */}
    {isOpen && filteredPlayers.length > 0 && (
      <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-border bg-bg-subtle shadow-lg max-h-64 overflow-y-auto">
        <div className="py-1">
          {filteredPlayers.map((player) => (
            <button
              key={player.id}
              type="button"
              onClick={() => onPlayerClick(player.id || '')}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-bg-muted transition-colors"
            >
              <Avatar
                src={player.imageUrl}
                alt={player.name}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-fg truncate">{player.name}</div>
                {player.dupr && (
                  <div className="text-xs text-fg-muted">DUPR: {player.dupr}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    )}

    {/* No Results */}
    {isOpen && searchTerm && filteredPlayers.length === 0 && (
      <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-border bg-bg-subtle shadow-lg p-4 text-center">
      <p className="text-sm text-fg-muted">
        No players found matching &ldquo;{searchTerm}&rdquo;
      </p>
      </div>
    )}
  </div>
);

export default PlayerSearchFilterView;