import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Trophy, Sun, Moon, Monitor } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { ROUTES } from '../../config/routes';
import { useTheme } from '../../hooks/useTheme';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showBottomNav?: boolean;
  showNotifications?: boolean;
  className?: string;
}

export function PageLayout({
  children,
  title,
  showBack = false,
  showBottomNav = true,
  showNotifications = false,
  className = '',
}: PageLayoutProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header - Always show for theme toggle */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showBack && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              {title ? (
                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {title}
                </h1>
              ) : (
                !showBack && (
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      Paddle Up
                    </span>
                  </div>
                )
              )}
            </div>
            <div className="flex items-center gap-1">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                title={`Theme: ${theme}`}
              >
                <ThemeIcon className="w-5 h-5" />
              </button>
              
              {showNotifications && (
                <button
                  onClick={() => navigate(ROUTES.HOME)}
                  className="p-2 -mr-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative"
                >
                  <Bell className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </header>

      {/* Main content */}
      <main
        className={`max-w-lg mx-auto px-4 py-6 ${showBottomNav ? 'pb-24' : ''} ${className}`}
      >
        {children}
      </main>

      {/* Bottom navigation */}
      {showBottomNav && <BottomNav />}
    </div>
  );
}

// Simple layout without navigation - used for auth pages
interface SimpleLayoutProps {
  children: ReactNode;
  className?: string;
}

export function SimpleLayout({ children, className = '' }: SimpleLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
      <div className={`w-full max-w-sm ${className}`}>{children}</div>
    </div>
  );
}

export default PageLayout;