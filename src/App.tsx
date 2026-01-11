import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import StandingsPage from './pages/StandingsPage';
import FormatPage from './pages/FormatPage';
import ChampionsPage from './pages/ChampionsPage';
import PlayersPage from './pages/PlayersPage';
import PlayerProfilePage from './pages/PlayerProfilePage';
import CalculatorPage from './pages/CalculatorPage';
import SchedulePage from './pages/SchedulePage';
import AdminPage from './pages/AdminPage';
import EventPage from './pages/EventPage';
import EventNightAdminPage from './pages/EventNightAdminPage';
import EventNightPlayerViewPage from './pages/EventNightPlayerViewPage';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/standings" element={<StandingsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/player/:id" element={<PlayerProfilePage />} />
        <Route path="/format" element={<FormatPage />} />
        <Route path="/champions" element={<ChampionsPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/event-night-admin" element={<EventNightAdminPage />} />
        <Route path="/event-night-player-view" element={<EventNightPlayerViewPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
