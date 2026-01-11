import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, Users, Calendar, Home, Calculator } from 'lucide-react';
import Button from './ui/Button';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Standings', href: '/standings', icon: Trophy },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Players', href: '/players', icon: Users },
    { name: 'Format', href: '/format', icon: Calendar },
    { name: 'Champions', href: '/champions', icon: Trophy },
    { name: 'Admin', href: '/admin', icon: Calculator },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-surface text-text-main sticky top-0 z-50 shadow-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-warning" />
                <span className="font-bold text-lg tracking-tight">Paddle Up</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1',
                        isActive
                          ? 'bg-surface-highlight text-warning'
                          : 'text-text-muted hover:bg-surface-highlight hover:text-text-main',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                variant="ghost"
                size="sm"
                className="inline-flex items-center justify-center p-2 rounded-md text-text-muted hover:text-text-main hover:bg-surface-highlight focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-surface border-t border-border">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2',
                      isActive
                        ? 'bg-surface-highlight text-warning'
                        : 'text-text-muted hover:bg-surface-highlight hover:text-text-main',
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

      <footer className="bg-surface text-text-muted py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© {new Date().getFullYear()} Paddle Up Individual Championship League</p>
          <p className="text-sm mt-2">Competitive Integrity • Merit-Based • Transparent</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
