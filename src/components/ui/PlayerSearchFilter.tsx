// TypeScript
import React, { useState, useMemo } from 'react';
import PlayerSearchFilterView from '../../views/PlayerSearchFilterView';
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
  placeholder = 'Find your name...',
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredPlayers = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return players
      .filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 8)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [players, searchTerm]);

  const handlePlayerClick = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
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
    <PlayerSearchFilterView
      searchTerm={searchTerm}
      onInputChange={handleInputChange}
      onClear={handleClear}
      placeholder={placeholder}
      className={className}
      isOpen={isOpen}
      filteredPlayers={filteredPlayers}
      onPlayerClick={handlePlayerClick}
    />
  );
};

export default PlayerSearchFilter;
