import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageLayout } from './components/layout/PageLayout';
import HomePage from './pages/HomePage';
import StandingsPage from './pages/StandingsPage';
import FormatPage from './pages/FormatPage';
import PlayerProfilePage from './pages/PlayerProfilePage';
import SchedulePage from './pages/SchedulePage';
import AdminPage from './pages/AdminPage';
import EventPage from './pages/EventPage';
import { ROUTES } from './config/routes';

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.HOME}
        element={
          <PageLayout title="Paddle Up Premier League">
            <HomePage />
          </PageLayout>
        }
      />
      <Route
        path={ROUTES.STANDINGS}
        element={
          <PageLayout title="Standings">
            <StandingsPage />
          </PageLayout>
        }
      />
      <Route
        path={ROUTES.SCHEDULE}
        element={
          <PageLayout title="Schedule">
            <SchedulePage />
          </PageLayout>
        }
      />
      <Route
        path={ROUTES.PLAYER_PROFILE}
        element={
          <PageLayout showBack showBottomNav={false}>
            <PlayerProfilePage />
          </PageLayout>
        }
      />
      <Route
        path={ROUTES.FORMAT}
        element={
          <PageLayout title="Format">
            <FormatPage />
          </PageLayout>
        }
      />
      <Route
        path={ROUTES.ADMIN}
        element={
          <PageLayout title="Admin">
            <AdminPage />
          </PageLayout>
        }
      />
      <Route
        path={ROUTES.EVENT_DETAIL}
        element={
          <PageLayout showBack showBottomNav={false}>
            <EventPage />
          </PageLayout>
        }
      />
    </Routes>
  );
};

export default App;
