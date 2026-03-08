import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const label = theme === 'light' ? 'Light mode' : theme === 'dark' ? 'Dark mode' : 'System theme';

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100
                 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800
                 transition-colors cursor-pointer"
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
