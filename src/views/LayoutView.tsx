import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, X, Menu } from 'lucide-react';
import { Button, ThemeToggle } from '../components/ui';
import { cn } from '../lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface LayoutViewProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  locationPathname: string;
  navigation: NavigationItem[];
  children?: React.ReactNode;
}

const LayoutView: React.FC<LayoutViewProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  locationPathname,
  navigation,
  children,
}) => (
  <div className="min-h-screen bg-bg">
    {/* Navigation */}
    <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-fg">Paddle Up</span>
              <span className="ml-1 text-fg-muted">League</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navigation.map((item) => {
              const isActive = locationPathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-bg-subtle text-fg'
                      : 'text-fg-muted hover:bg-bg-subtle hover:text-fg',
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="ml-2 border-l border-border pl-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = locationPathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-bg-subtle text-fg'
                      : 'text-fg-muted hover:bg-bg-subtle hover:text-fg',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>

    {/* Main Content */}
    <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

    {/* Footer */}
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-fg-muted">
            <Trophy className="h-4 w-4" />
            <span>Paddle Up Premier League</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-fg-subtle">
            <span>3.5+ DUPR</span>
            <span>•</span>
            <span>Sundays 7-10 PM</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

export default LayoutView;
