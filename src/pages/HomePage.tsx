import React, { useMemo } from 'react';
import { useEvents, usePlayers } from '../hooks/firestoreHooks';
import HomePageView from '../views/HomePageView';
import { calculateWeekFinalPositions } from '../lib/standings';

const HomePage: React.FC = () => {
  const { data: challengeEvents = [] } = useEvents();
  const { data: players = [] } = usePlayers();

  // Get top 3 players derived from challengeEvents (all-time)
  const topPlayers = useMemo(() => {
    const pointsByPlayer = new Map<string, number>();
    const eventsByPlayer = new Map<string, number>();
    const events = (challengeEvents || []).filter(
      (ev) => Array.isArray((ev as any).standings) && (ev as any).standings.length > 0,
    );

    events.forEach((ev) => {
      const weekLike = {
        id: ev.id,
        date: ev.startDateTime ? ev.startDateTime.toISOString() : ev.id,
        isCompleted: true,
        standings: (ev as any).standings,
      } as any;
      const finals = calculateWeekFinalPositions(weekLike) || [];
      finals.forEach((f: any) => {
        const pid = f.playerId;
        const pts = f.pointsEarned || 0;
        pointsByPlayer.set(pid, (pointsByPlayer.get(pid) || 0) + pts);
        eventsByPlayer.set(pid, (eventsByPlayer.get(pid) || 0) + 1);
      });
    });

    const rows = Array.from(pointsByPlayer.entries()).map(([playerId, points]) => ({
      playerId,
      points,
    }));
    rows.sort((a, b) => b.points - a.points);

    return rows.slice(0, 3).map((r, index) => ({
      playerId: r.playerId,
      points: r.points,
      events: eventsByPlayer.get(r.playerId) || 0,
      rank: index + 1,
    }));
  }, [challengeEvents]);

  const seriesLabel = useMemo(() => {
    const parsed = (challengeEvents || []).filter(
      (ev) => ev.startDateTime instanceof Date && !isNaN(ev.startDateTime.getTime()),
    );
    if (parsed.length === 0) return 'Challenge Series';
    const years = Array.from(new Set(parsed.map((ev) => ev.startDateTime.getFullYear()))).sort();
    return years.length === 1
      ? `${years[0]} Challenge`
      : `${years[0]}–${years[years.length - 1]} Challenge`;
  }, [challengeEvents]);

  // Compute the next upcoming challenge event (players can register for)
  const nextEvent = useMemo(() => {
    if (!challengeEvents || challengeEvents.length === 0) return null;

    // Only keep events with a valid Date object
    const parsed = challengeEvents.filter(
      (ev) => ev.startDateTime instanceof Date && !isNaN(ev.startDateTime.getTime()),
    );

    // Sort by startDateTime ascending
    parsed.sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime());

    const now = new Date();
    // Use current moment (including time) to decide upcoming events
    const nowTs = now.getTime();

    // Find events that are now or in the future
    const upcoming = parsed.filter((p) => p.startDateTime.getTime() >= nowTs);

    if (upcoming.length > 0) return upcoming[0];
    // If none upcoming, return null (show nothing)
    return null;
  }, [challengeEvents]);

  return (
    <HomePageView
      players={players}
      topPlayers={topPlayers}
      seriesLabel={seriesLabel}
      nextEvent={nextEvent}
    />
  );
};

export default HomePage;
