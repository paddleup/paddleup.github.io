import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import PlayerAvatar from './ui/PlayerAvatar';
import Button from './ui/Button';
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
  const wrapperRef = useRef<HTMLDivElement>(null);
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

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full rounded-md bg-surface-highlight border-border text-text-main shadow-sm focus:border-primary focus:ring-primary border p-2 text-sm pr-8 placeholder:text-text-muted"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none">
          {isOpen ? <Search className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {isOpen && filteredPlayers.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-surface-highlight border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredPlayers.map((p: Player) => (
            <Button
              key={p.id}
              onClick={() => handleSelect(p.name)}
              variant="ghost"
              size="sm"
              className="w-full text-left px-4 py-2 text-sm hover:bg-surface-alt flex items-center gap-2"
            >
              <PlayerAvatar 
                imageUrl={p.imageUrl} 
                name={p.name} 
                size="sm" 
                border={false} 
              />
              <span className="text-text-main">{p.name}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerSelect;
