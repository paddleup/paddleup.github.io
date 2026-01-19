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
import type { Player, Event as EventModel } from '../types';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Label from '../components/ui/Label';
import { List, ListItem } from '../components/ui/List';
import ErrorText from '../components/ui/ErrorText';
import Button from '../components/ui/Button';

type EventFormProps = {
  isAdmin: boolean;
};

const EventForm: React.FC<EventFormProps> = ({ isAdmin }) => {
  const { create, status: createStatus, error: createError } = useCreateEvent();

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(''); // yyyy-mm-dd
  const [startTime, setStartTime] = useState(''); // HH:MM
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'open' | 'closed' | 'cancelled' | ''>('');
  const [label, setLabel] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      // eslint-disable-next-line no-alert
      alert('You are not authorized to create events.');
      return;
    }
    if (!name.trim() || !startDate) {
      // eslint-disable-next-line no-alert
      alert('Name and start date are required.');
      return;
    }

    const start = new Date(`${startDate}T${startTime || '00:00'}`);
    const end = endDate ? new Date(`${endDate}T${endTime || '00:00'}`) : undefined;

    const payload: Partial<EventModel> & Record<string, unknown> = {
      name: name.trim(),
      startDateTime: start,
      ...(end ? { endDateTime: end } : {}),
      ...(location.trim() ? { location: location.trim() } : {}),
      ...(status ? { status } : {}),
      ...(label.trim() ? { label: label.trim() } : {}),
      ...(link.trim() ? { link: link.trim() } : {}),
      standings: [],
      rounds: [],
    };

    try {
      const newId = await create(payload as any);
      // eslint-disable-next-line no-alert
      alert(`Event created${newId ? ` (id: ${String(newId)})` : ''}.`);
      setName('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      setLocation('');
      setStatus('');
      setLabel('');
      setLink('');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Create event failed', err);
      // eslint-disable-next-line no-alert
      alert('Failed to create event. See console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <div>
        <Label>Event name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <Label>Start date</Label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Start time (optional)</Label>
        <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>

      <div>
        <Label>End date (optional)</Label>
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <div>
        <Label>End time (optional)</Label>
        <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </div>

      <div>
        <Label>Location (optional)</Label>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>

      <div>
        <Label>Status (optional)</Label>
        <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="">(none)</option>
          <option value="open">open</option>
          <option value="closed">closed</option>
          <option value="cancelled">cancelled</option>
        </Select>
      </div>

      <div>
        <Label>Label (optional)</Label>
        <Input value={label} onChange={(e) => setLabel(e.target.value)} />
      </div>

      <div>
        <Label>Link (optional)</Label>
        <Input value={link} onChange={(e) => setLink(e.target.value)} />
      </div>

      <div>
        <Button type="submit" disabled={!isAdmin || createStatus === 'pending'} color="success">
          {createStatus === 'pending' ? 'Creating...' : 'Create event'}
        </Button>
      </div>

      {createError && <ErrorText>Error creating event: {String(createError)}</ErrorText>}
    </form>
  );
};

const AdminPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const provider = new GoogleAuthProvider();

  const { isAdmin } = useAdmin();

  const { create, status: createStatus, error: createError } = useCreatePlayer();

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

  if (selectedEventId !== prevSelectedEventId || selectedEvent?.standings !== prevStandings) {
    setPrevSelectedEventId(selectedEventId);
    setPrevStandings(selectedEvent?.standings);
    if (selectedEvent?.standings && Array.isArray(selectedEvent.standings)) {
      setStandingsList([...selectedEvent.standings]);
    } else {
      setStandingsList([]);
    }
  }

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
      // eslint-disable-next-line no-alert
      alert('You are not authorized to update events.');
      return;
    }
    if (!selectedEventId) {
      // eslint-disable-next-line no-alert
      alert('Select an event first.');
      return;
    }
    try {
      await update({ id: selectedEventId, standings: standingsList } as any);
      // eslint-disable-next-line no-alert
      alert('Standings saved.');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Save standings failed', err);
      // eslint-disable-next-line no-alert
      alert('Failed to save standings. See console for details.');
    }
  };

  const [name, setName] = useState<string>('');
  const [dupr, setDupr] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('You are not authorized to add players.');
      return;
    }

    try {
      const duprNum = dupr.trim() ? Number(dupr) : undefined;
      const player: Player = {
        name: name.trim(),
        ...(duprNum !== undefined && !Number.isNaN(duprNum) ? { dupr: duprNum } : {}),
        ...(imageUrl.trim() ? { imageUrl: imageUrl.trim() } : {}),
        createdAt: new Date().toISOString(),
      } as Player;

      await create(player);
      setName('');
      setDupr('');
      setImageUrl('');
      // eslint-disable-next-line no-alert
      alert('Player added.');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Create player failed', err);
      // eslint-disable-next-line no-alert
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
      // eslint-disable-next-line no-console
      console.error('Google sign-in failed', err);
      alert('Sign-in failed. See console for details.');
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Sign-out failed', err);
      alert('Sign-out failed. See console for details.');
    }
  };

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>

      {user ? (
        <div className="space-y-8">
          <p className="mb-2">
            Signed in as <strong>{user.displayName ?? user.email}</strong>
          </p>
          <p>Admin status: {isAdmin ? 'Yes' : 'No'}</p>
          <Button onClick={handleSignOut}>Sign out</Button>

          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">Protected admin area</h2>
            <p className="text-sm text-gray-600 mb-4">
              You are authenticated and can now access admin-only features.
            </p>

            {!isAdmin && (
              <p className="text-sm text-red-600 mb-4">
                You are not an admin. Editing is disabled.
              </p>
            )}
          </Card>

          <Card className="p-6 mb-6">
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <Label>DUPR (optional)</Label>
                <Input value={dupr} onChange={(e) => setDupr(e.target.value)} inputMode="decimal" />
              </div>

              <div>
                <Label>Image URL (optional)</Label>
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={!isAdmin || createStatus === 'pending'}
                  color="success"
                >
                  {createStatus === 'pending' ? 'Adding...' : 'Add player'}
                </Button>
              </div>

              {createError && <ErrorText>Error creating player: {String(createError)}</ErrorText>}
            </form>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">Create Event</h2>
            <p className="text-sm text-gray-600 mb-4">
              Create a new Event (start date/time is required).
            </p>

            <EventForm isAdmin={isAdmin} />
            {/* Inline event errors displayed by the form */}
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">Manage Event Standings</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select an event, build an ordered standings list of players, and save to the event.
            </p>

            <Card className="p-6">
              <div className="md:col-span-1">
                <Label>Event</Label>
                <Select
                  value={selectedEventId ?? ''}
                  onChange={(e) => setSelectedEventId(e.target.value || undefined)}
                >
                  <option value="">(select an event)</option>
                  {events.map((ev: any) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name ?? ev.id}
                    </option>
                  ))}
                </Select>

                <div className="mt-4">
                  <Label>Players</Label>
                  <div className="mt-1 max-h-56 overflow-auto border rounded p-1">
                    {players.length === 0 && (
                      <p className="text-sm text-gray-500">No players found.</p>
                    )}
                    <List>
                      {players.map((p: any) => (
                        <ListItem key={p.id}>
                          <div className="text-base">{p.name}</div>
                          <div>
                            <Button
                              type="button"
                              color="primary"
                              size="sm"
                              onClick={() => addPlayerToStandings(p.id)}
                            >
                              Add
                            </Button>
                          </div>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Standings (ordered)</label>
                <div className="mt-1 border rounded p-2 bg-white">
                  {standingsList.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No players in standings. Add players from the left.
                    </p>
                  )}

                  <List>
                    {standingsList.map((pid, idx) => {
                      const p = players.find((x: any) => x.id === pid);
                      return (
                        <ListItem key={`${pid}-${idx}`}>
                          <div className="flex items-center space-x-3">
                            <div className="text-sm font-medium">{idx + 1}.</div>
                            <div className="text-sm">{p ? p.name : pid}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => moveUp(idx)}
                              disabled={idx === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => moveDown(idx)}
                              disabled={idx === standingsList.length - 1}
                            >
                              ↓
                            </Button>
                            <Button
                              type="button"
                              color="error"
                              size="sm"
                              onClick={() => removeFromStandings(idx)}
                            >
                              Remove
                            </Button>
                          </div>
                        </ListItem>
                      );
                    })}
                  </List>

                  <div className="mt-4 flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={handleSaveStandings}
                      disabled={!isAdmin || updateStatus === 'pending' || !selectedEventId}
                      className="px-6 py-3 bg-green-600 text-white rounded disabled:opacity-50 text-base"
                    >
                      {updateStatus === 'pending' ? 'Saving...' : 'Save standings to event'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStandingsList([]);
                      }}
                      className="px-6 py-3 bg-gray-200 rounded text-base"
                    >
                      Clear
                    </button>
                  </div>

                  {updateError && (
                    <p className="text-sm text-red-600 mt-2">Error saving: {String(updateError)}</p>
                  )}
                </div>
              </div>
            </Card>
          </Card>
        </div>
      ) : (
        <div>
          <p className="mb-4">Sign in with a Google account to access admin features.</p>
          <Button color="primary" onClick={handleSignIn}>
            Sign in with Google
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
