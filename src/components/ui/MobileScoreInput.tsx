import React, { useState, useRef, useEffect } from 'react';
import { Edit3, Check, X } from 'lucide-react';

interface MobileScoreInputProps {
  value?: number;
  onChange: (value: number) => void;
  isAdmin?: boolean;
  teamColor?: 'primary' | 'success';
  disabled?: boolean;
  maxScore?: number;
}

const MobileScoreInput: React.FC<MobileScoreInputProps> = ({
  value,
  onChange,
  isAdmin = false,
  teamColor = 'primary',
  disabled = false,
  maxScore,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value?.toString() || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    if (!isAdmin || disabled) return;
    setTempValue(value?.toString() || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    let numValue = parseInt(tempValue);
    // Clamp to maxScore if provided
    if (!isNaN(numValue) && numValue >= 0) {
      if (typeof maxScore === "number" && numValue > maxScore) {
        numValue = maxScore;
      }
      onChange(numValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value?.toString() || '');
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Use neutral/semantic colors for a simpler, more consistent look
  const colorClasses = {
    primary: {
      bg: 'bg-surface',
      border: 'border-border',
      hover: 'hover:bg-surface-highlight',
      text: 'text-text-main',
    },
    success: {
      bg: 'bg-surface',
      border: 'border-border',
      hover: 'hover:bg-surface-highlight',
      text: 'text-text-main',
    },
  };

  const colors = colorClasses[teamColor];

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="number"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleSave}
          className={`w-14 h-12 px-2 text-lg font-bold border-2 ${colors.border} rounded-lg bg-surface text-center focus:outline-none focus:ring-2 focus:ring-primary/50`}
          min="0"
          max={typeof maxScore === "number" ? maxScore : 99}
        />
      </div>
    );
  }

  return (
    <button
      onClick={handleStartEdit}
      disabled={!isAdmin || disabled}
      className={`min-w-[2.5rem] h-8 px-2 flex items-center justify-center ${colors.bg} border-2 ${colors.border} rounded-md text-lg font-black transition-all duration-200 ${
        isAdmin && !disabled 
          ? `${colors.hover} cursor-pointer active:scale-95` 
          : 'cursor-default'
      }`}
    >
      <div className="flex items-center gap-1">
        <span className={colors.text}>
          {value ?? '-'}
        </span>
        {isAdmin && !disabled && (
          <Edit3 className={`h-2.5 w-2.5 ${colors.text} opacity-60`} />
        )}
      </div>
    </button>
  );
};

export default MobileScoreInput;
