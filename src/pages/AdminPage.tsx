import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { useAdmin } from '../hooks/useAdmin';
import {
  useCreatePlayer,
  useCreateEvent,
  useEvents,
  usePlayers,
  useEvent,
  useUpdateEvent,
} from '../hooks/firestoreHooks';
import AdminPageView from '../views/AdminPageView';

const AdminPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const provider = new GoogleAuthProvider();

  const { isAdmin } = useAdmin();

  const { create, status: createStatus, error: createError } = useCreatePlayer();
  const { create: createEvent, status: createEventStatus, error: createEventError } = useCreateEvent();

  // Events / players for standings editing
  const eventsQuery = useEvents();
  const playersQuery = usePlayers();
  const events = eventsQuery.data ?? [];
  const players = playersQuery.data ?? [];

  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [standingsList, setStandingsList] = useState<string[]>([]);
  const { data: selectedEvent } = useEvent(selectedEventId) ?? {};
  const { update, status: updateStatus, error: updateError } = useUpdateEvent();

  const [prevSelectedEventId, setPrevSelectedEventId] = useState(selectedEventId);
  const [prevStandings, setPrevStandings] = useState(selectedEvent?.standings);

  useEffect(() => {
    if (selectedEventId !== prevSelectedEventId || selectedEvent?.standings !== prevStandings) {
      setPrevSelectedEventId(selectedEventId);
      setPrevStandings(selectedEvent?.standings);
      if (selectedEvent?.standings && Array.isArray(selectedEvent.standings)) {
        setStandingsList([...selectedEvent.standings]);
      } else {
        setStandingsList([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEventId, selectedEvent?.standings]);

  const addPlayerToStandings = (playerId: string) => {
    if (!playerId) return;
    setStandingsList((s) => [...s, playerId]);
  };

  const removeFromStandings = (index: number) => {
    setStandingsList((s) => s.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    setStandingsList((s) => {
      const copy = [...s];
      const tmp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = tmp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    setStandingsList((s) => {
      if (index >= s.length - 1) return s;
      const copy = [...s];
      const tmp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = tmp;
      return copy;
    });
  };

  const handleSaveStandings = async () => {
    if (!isAdmin) {
      alert('You are not authorized to update events.');
      return;
    }
    if (!selectedEventId) {
      alert('Select an event first.');
      return;
    }
    try {
      await update({ id: selectedEventId, standings: standingsList } as any);
      alert('Standings saved.');
    } catch (err) {
      console.error('Save standings failed', err);
      alert('Failed to save standings. See console for details.');
    }
  };

  const [name, setName] = useState<string>('');
  const [dupr, setDupr] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  // Event creation form state
  const [eventName, setEventName] = useState<string>('');
  const [eventCode, setEventCode] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('19:00');
  const [eventLocation, setEventLocation] = useState<string>('');
  const [courtReserveUrl, setCourtReserveUrl] = useState<string>('');

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('You are not authorized to create events.');
      return;
    }

    try {
      // Combine date and time into a Date object
      const dateTimeStr = `${eventDate}T${eventTime}`;
      const startDateTime = new Date(dateTimeStr);

      const event = {
        name: eventName.trim(),
        eventCode: eventCode.trim().toLowerCase().replace(/\s+/g, '-'),
        startDateTime,
        location: eventLocation.trim() || undefined,
        courtReserveUrl: courtReserveUrl.trim() || undefined,
        status: 'upcoming' as const,
        createdAt: new Date(),
      };

      await createEvent(event as any);
      setEventName('');
      setEventCode('');
      setEventDate('');
      setEventTime('19:00');
      setEventLocation('');
      setCourtReserveUrl('');
      alert('Event created successfully.');
    } catch (err) {
      console.error('Create event failed', err);
      alert('Failed to create event. See console for details.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('You are not authorized to add players.');
      return;
    }

    try {
      const duprNum = dupr.trim() ? Number(dupr) : undefined;
      const player = {
        name: name.trim(),
        ...(duprNum !== undefined && !Number.isNaN(duprNum) ? { dupr: duprNum } : {}),
        ...(imageUrl.trim() ? { imageUrl: imageUrl.trim() } : {}),
        createdAt: new Date().toISOString(),
      };

      await create(player);
      setName('');
      setDupr('');
      setImageUrl('');
      alert('Player added.');
    } catch (err) {
      console.error('Create player failed', err);
      alert('Failed to add player. See console for details.');
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Google sign-in failed', err);
      alert('Sign-in failed. See console for details.');
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign-out failed', err);
      alert('Sign-out failed. See console for details.');
    }
  };

  return (
    <AdminPageView
      user={user}
      isAdmin={isAdmin}
      handleSignIn={handleSignIn}
      handleSignOut={handleSignOut}
      name={name}
      setName={setName}
      dupr={dupr}
      setDupr={setDupr}
      imageUrl={imageUrl}
      setImageUrl={setImageUrl}
      handleCreate={handleCreate}
      createStatus={createStatus}
      createError={createError}
      events={events}
      players={players}
      selectedEventId={selectedEventId}
      setSelectedEventId={setSelectedEventId}
      standingsList={standingsList}
      setStandingsList={setStandingsList}
      addPlayerToStandings={addPlayerToStandings}
      removeFromStandings={removeFromStandings}
      moveUp={moveUp}
      moveDown={moveDown}
      handleSaveStandings={handleSaveStandings}
      updateStatus={updateStatus}
      updateError={updateError}
      // Event creation props
      eventName={eventName}
      setEventName={setEventName}
      eventCode={eventCode}
      setEventCode={setEventCode}
      eventDate={eventDate}
      setEventDate={setEventDate}
      eventTime={eventTime}
      setEventTime={setEventTime}
      eventLocation={eventLocation}
      setEventLocation={setEventLocation}
      courtReserveUrl={courtReserveUrl}
      setCourtReserveUrl={setCourtReserveUrl}
      handleCreateEvent={handleCreateEvent}
      createEventStatus={createEventStatus}
      createEventError={createEventError}
    />
  );
};

export default AdminPage;
