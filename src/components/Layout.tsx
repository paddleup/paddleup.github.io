// TypeScript
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import LayoutView from '../views/LayoutView';
import { Trophy, Home, Calculator, Target, Calendar } from 'lucide-react';

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
    <LayoutView
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      locationPathname={location.pathname}
      navigation={navigation}
    >
      {children}
    </LayoutView>
  );
};

export default Layout;
