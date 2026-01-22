// TypeScript
import React, { useState, useRef, useEffect } from 'react';
import MobileScoreInputView from '../../views/MobileScoreInputView';

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
  const inputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

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
    if (!isNaN(numValue) && numValue >= 0) {
      if (typeof maxScore === 'number' && numValue > maxScore) {
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

  return (
    <MobileScoreInputView
      value={value}
      tempValue={tempValue}
      isEditing={isEditing}
      isAdmin={isAdmin}
      disabled={disabled}
      teamColor={teamColor}
      maxScore={maxScore}
      inputRef={inputRef}
      onStartEdit={handleStartEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onTempValueChange={setTempValue}
      onKeyPress={handleKeyPress}
    />
  );
};

export default MobileScoreInput;
