import React, { useState, useMemo } from 'react';
import { Search, X, User } from 'lucide-react';
import { Player } from '../../types';

interface PlayerSearchFilterProps {
  players: Player[];
  onPlayerSelect: (playerId: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
}

const PlayerSearchFilter: React.FC<PlayerSearchFilterProps> = ({
  players,
  onPlayerSelect,
  onClear,
  placeholder = "Find your name...",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredPlayers = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    return players
      .filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 8) // Limit results to prevent overwhelming on mobile
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [players, searchTerm]);

  const handlePlayerClick = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      setSearchTerm(player.name);
      setIsOpen(false);
      onPlayerSelect(playerId);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsOpen(false);
    onClear();
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setIsOpen(value.length > 0);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 pl-12 pr-12 bg-surface border-2 border-border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-surface-alt rounded-full flex items-center justify-center hover:bg-surface-highlight transition-colors"
          >
            <X className="h-4 w-4 text-text-muted" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && filteredPlayers.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-surface border-2 border-border rounded-xl shadow-xl max-h-64 overflow-y-auto">
          <div className="p-2">
            {filteredPlayers.map((player) => (
              <button
                key={player.id}
                onClick={() => handlePlayerClick(player.id || '')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-highlight transition-colors text-left"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text-main truncate">
                    {player.name}
                  </div>
                  {player.dupr && (
                    <div className="text-sm text-text-muted">
                      DUPR: {player.dupr}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && searchTerm && filteredPlayers.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-surface border-2 border-border rounded-xl shadow-xl p-4 text-center">
          <div className="text-text-muted">
            No players found matching &ldquo;{searchTerm}&rdquo;
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerSearchFilter;
