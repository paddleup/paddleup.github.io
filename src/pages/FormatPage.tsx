import React, { useEffect } from 'react';
import FormatPageView from '../views/FormatPageView';

const FormatPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Pickleball League — Season 1 (Competitive)';
  }, []);

  return <FormatPageView />;
};

export default FormatPage;
