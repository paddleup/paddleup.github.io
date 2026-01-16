import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, Users, Calendar, Home, Calculator, Target } from 'lucide-react';
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
    { name: 'Format', href: '/format', icon: Target },
    { name: 'Admin', href: '/admin', icon: Calculator },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Navigation */}
      <nav className="relative bg-gradient-to-br from-primary/10 via-surface to-surface/80 text-text-main sticky top-0 z-50 rounded-3xl border border-primary/20 shadow-2xl mx-4 mt-4 mb-8 backdrop-blur-md">
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-success/10 to-transparent rounded-full blur-2xl -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Enhanced Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-warning rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-warning rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <span className="font-black text-xl tracking-tight bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent group-hover:from-warning group-hover:to-primary transition-all duration-300">
                    Paddle Up
                  </span>
                  <div className="text-xs text-text-muted font-semibold tracking-wider uppercase">
                    Premier League
                  </div>
                </div>
              </Link>
            </div>

            {/* Enhanced Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center space-x-2 group relative overflow-hidden',
                        isActive
                          ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/30 scale-105'
                          : 'text-text-muted hover:bg-surface-highlight hover:text-text-main hover:shadow-md hover:scale-105',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4 transition-transform duration-300',
                          isActive ? 'text-white' : 'group-hover:scale-110',
                        )}
                      />
                      <span>{item.name}</span>
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-warning/10 blur-xl -z-10"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Mobile menu button */}
            <div className="md:hidden">
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                variant="ghost"
                size="sm"
                className="relative overflow-hidden"
              >
                <div className="relative z-10">
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </div>
                {isMenuOpen && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-warning/20 blur-sm"></div>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 bg-gradient-to-br from-surface via-surface-alt to-surface border-t border-border/50 shadow-xl">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-base font-bold flex items-center space-x-3 transition-all duration-300 group relative overflow-hidden',
                      isActive
                        ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/30'
                        : 'text-text-muted hover:bg-surface-highlight hover:text-text-main hover:shadow-md hover:scale-[1.02]',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-transform duration-300',
                        isActive ? 'text-white' : 'group-hover:scale-110',
                      )}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          {/* <div className="bg-gradient-to-br from-primary/5 via-surface to-success/5 rounded-3xl p-8 md:p-12 border border-primary/20 shadow-2xl"> */}
          {children}
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-success/10 to-transparent rounded-full blur-2xl -z-10"></div>
          {/* </div> */}
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-surface via-surface-alt to-surface text-text-muted py-12 mt-auto border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            {/* Footer Logo */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-warning/20 rounded-full flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <span className="font-black text-lg text-text-main">Paddle Up Premier League</span>
            </div>

            {/* Achievement Badges */}
            <div className="flex items-center justify-center space-x-6 pt-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-primary">Premier League</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-success/10 rounded-xl border border-success/20">
                <Target className="h-4 w-4 text-success" />
                <span className="text-xs font-semibold text-success">3.5+ DUPR</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-warning/10 rounded-xl border border-warning/20">
                <Users className="h-4 w-4 text-warning" />
                <span className="text-xs font-semibold text-warning">Elite Players</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-warning/10 to-transparent rounded-full blur-2xl -z-10"></div>
      </footer>
    </div>
  );
};

export default Layout;
