import React from 'react';
import { Edit3 } from 'lucide-react';

interface MobileScoreInputViewProps {
  value?: number;
  tempValue: string;
  isEditing: boolean;
  isAdmin: boolean;
  disabled: boolean;
  teamColor: 'primary' | 'success';
  maxScore?: number;
  inputRef: React.RefObject<HTMLInputElement>;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onTempValueChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const MobileScoreInputView: React.FC<MobileScoreInputViewProps> = ({
  value,
  tempValue,
  isEditing,
  isAdmin,
  disabled,
  teamColor,
  maxScore,
  inputRef,
  onStartEdit,
  onSave,
  onCancel: _onCancel,
  onTempValueChange,
  onKeyPress,
}) => {
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
          onChange={(e) => onTempValueChange(e.target.value)}
          onKeyDown={onKeyPress}
          onBlur={onSave}
          className={`w-14 h-12 px-2 text-lg font-bold border-2 ${colors.border} rounded-lg bg-surface text-center focus:outline-none focus:ring-2 focus:ring-primary/50`}
          min="0"
          max={typeof maxScore === 'number' ? maxScore : 99}
        />
      </div>
    );
  }

  return (
    <button
      onClick={onStartEdit}
      disabled={!isAdmin || disabled}
      className={`min-w-[2.5rem] h-8 px-2 flex items-center justify-center ${colors.bg} border-2 ${
        colors.border
      } rounded-lg text-lg font-black transition-all duration-200 ${
        isAdmin && !disabled ? `${colors.hover} cursor-pointer active:scale-95` : 'cursor-default'
      }`}
    >
      <div className="flex items-center gap-1">
        <span className={colors.text}>{value ?? '-'}</span>
        {isAdmin && !disabled && <Edit3 className={`h-2.5 w-2.5 ${colors.text} opacity-60`} />}
      </div>
    </button>
  );
};

export default MobileScoreInputView;
