import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';

interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showLabel?: boolean;
}

const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ showLabel = false, className, ...props }, ref) => {
    const { theme, setTheme, isDark } = useTheme();

    const cycleTheme = () => {
      const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
      const currentIndex = themes.indexOf(theme);
      const nextIndex = (currentIndex + 1) % themes.length;
      setTheme(themes[nextIndex]);
    };

    const getLabel = () => {
      switch (theme) {
        case 'light':
          return 'Light';
        case 'dark':
          return 'Dark';
        case 'system':
          return 'System';
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={cycleTheme}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
          'text-fg-muted hover:bg-bg-subtle hover:text-fg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          className,
        )}
        aria-label={`Current theme: ${getLabel()}. Click to change.`}
        {...props}
      >
        {/* Sun icon */}
        <svg
          className={cn('h-4 w-4', isDark ? 'hidden' : 'block')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>

        {/* Moon icon */}
        <svg
          className={cn('h-4 w-4', isDark ? 'block' : 'hidden')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>

        {showLabel && <span>{getLabel()}</span>}
      </button>
    );
  },
);

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
