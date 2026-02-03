// TypeScript
import React, { RefObject } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import PlayerAvatar from '../components/ui/PlayerAvatar';
import Button from '../components/ui/Button';
import { Player } from '../types';

interface PlayerSelectViewProps {
  value: string;
  placeholder?: string;
  isOpen: boolean;
  searchTerm: string;
  filteredPlayers: Player[];
  wrapperRef: React.RefObject<HTMLDivElement>;
  onInputChange: (value: string) => void;
  onFocus: () => void;
  onSelect: (name: string) => void;
}

const PlayerSelectView: React.FC<PlayerSelectViewProps> = ({
  value,
  placeholder,
  isOpen,
  searchTerm,
  filteredPlayers,
  wrapperRef,
  onInputChange,
  onFocus,
  onSelect,
}) => (
  <div className="relative" ref={wrapperRef}>
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
        onFocus={onFocus}
        className="w-full rounded-lg bg-surface-highlight border-border text-text-main shadow-sm focus:border-primary focus:ring-primary border p-2 text-sm pr-8 placeholder:text-text-muted"
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none">
        {isOpen ? <Search className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>
    </div>

    {isOpen && filteredPlayers.length > 0 && (
      <div className="absolute z-10 w-full mt-1 bg-surface-highlight border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
        {filteredPlayers.map((p: Player) => (
          <Button
            key={p.id}
            onClick={() => onSelect(p.name)}
            variant="ghost"
            size="sm"
            className="w-full text-left px-4 py-2 text-sm hover:bg-surface-alt flex items-center gap-2"
          >
            <PlayerAvatar imageUrl={p.imageUrl} name={p.name} size="sm" border={false} />
            <span className="text-text-main">{p.name}</span>
          </Button>
        ))}
      </div>
    )}
  </div>
);

export default PlayerSelectView;
