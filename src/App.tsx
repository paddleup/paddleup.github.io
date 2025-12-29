import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Standings from './pages/Standings';
import Format from './pages/Format';
import Champions from './pages/Champions';
import Players from './pages/Players';
import PlayerProfile from './pages/PlayerProfile';
import Calculator from './pages/Calculator';
import Schedule from './pages/Schedule';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/players" element={<Players />} />
        <Route path="/player/:id" element={<PlayerProfile />} />
        <Route path="/format" element={<Format />} />
        <Route path="/champions" element={<Champions />} />
        <Route path="/calculator" element={<Calculator />} />
      </Routes>
    </Layout>
  );
}

export default App;
