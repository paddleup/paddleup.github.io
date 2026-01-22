// TypeScript
import React, { useState, useRef, useEffect } from 'react';
import PlayerSelectView from '../views/PlayerSelectView';
import { usePlayers } from '../hooks/firestoreHooks';
import { Player } from '../types';

interface PlayerSelectProps {
  value: string;
  onChange: (name: string) => void;
  placeholder?: string;
}

const PlayerSelect: React.FC<PlayerSelectProps> = ({ value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const { data: players = [] } = usePlayers();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPlayers = players.filter((p: Player) =>
    p.name.toLowerCase().includes((searchTerm || value).toLowerCase()),
  );

  const handleSelect = (name: string) => {
    onChange(name);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputChange = (input: string) => {
    onChange(input);
    setSearchTerm(input);
    setIsOpen(true);
  };

  const handleFocus = () => setIsOpen(true);

  return (
    <PlayerSelectView
      value={value}
      placeholder={placeholder}
      isOpen={isOpen}
      searchTerm={searchTerm}
      filteredPlayers={filteredPlayers}
      wrapperRef={wrapperRef}
      onInputChange={handleInputChange}
      onFocus={handleFocus}
      onSelect={handleSelect}
    />
  );
};

export default PlayerSelect;
