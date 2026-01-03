import React, { useEffect, useState } from 'react';
import { Combobox } from '@headlessui/react';

type Props = {
  value: string;
  seed: number;
  placeholder?: string;
  onSelect: (v: string | null) => void;
};

/* Keep a small demo roster local so the combobox remains snappy in demos */
const demoRoster = Array.from({ length: 32 }).map((_, i) => `Player ${i + 1}`);

const PlayerCombobox = React.memo(function PlayerCombobox({
  value,
  seed,
  placeholder,
  onSelect,
}: Props) {
  const [inputValue, setInputValue] = useState<string>(value ?? '');
  const [suggests, setSuggests] = useState<string[]>([]);
  const debounceRef = React.useRef<number | null>(null);

  useEffect(() => {
    setInputValue(value ?? '');
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  function persistValueImmediate(v: string) {
    const normalized = v?.trim() ?? '';
    onSelect(normalized ? normalized : null);
    setSuggests([]);
  }

  function schedulePersist(v: string, delay = 250) {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      persistValueImmediate(v);
      debounceRef.current = null;
    }, delay);
  }

  return (
    <Combobox
      value={value}
      onChange={(v: string | null) => {
        if (debounceRef.current) {
          window.clearTimeout(debounceRef.current);
          debounceRef.current = null;
        }
        onSelect(v);
        setSuggests([]);
      }}
    >
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full px-3 py-2 rounded bg-surface border border-border text-text-main"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            setInputValue(v);
            setSuggests(demoRoster.filter((d) => d.toLowerCase().includes(v.toLowerCase())));
            schedulePersist(v);
          }}
          onBlur={() => {
            if (debounceRef.current) window.clearTimeout(debounceRef.current);
            persistValueImmediate(inputValue);
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' || e.key === 'Tab') {
              if (debounceRef.current) window.clearTimeout(debounceRef.current);
              persistValueImmediate(inputValue);
            }
          }}
          placeholder={placeholder}
        />
        {suggests.length > 0 && (
          <Combobox.Options className="absolute mt-1 w-full bg-surface border border-border rounded-md shadow-lg max-h-56 overflow-auto z-10">
            {suggests.map((name) => (
              <Combobox.Option
                key={name}
                value={name}
                className={({ active }) =>
                  `px-3 py-2 cursor-pointer ${active ? 'bg-surface-highlight' : ''}`
                }
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{name}</span>
                  <span className="text-xs text-text-muted">seed {seed}</span>
                </div>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
});

PlayerCombobox.displayName = 'PlayerCombobox';

export default PlayerCombobox;
