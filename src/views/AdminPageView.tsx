import React from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Label from '../components/ui/Label';
import { List, ListItem } from '../components/ui/List';
import ErrorText from '../components/ui/ErrorText';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';

type AdminPageProps = {
  user: any;
  isAdmin: boolean;
  handleSignIn: () => void;
  handleSignOut: () => void;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  dupr: string;
  setDupr: React.Dispatch<React.SetStateAction<string>>;
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  handleCreate: (e: React.FormEvent) => void;
  createStatus: string;
  createError: any;
  events: any[];
  players: any[];
  selectedEventId: string | undefined;
  setSelectedEventId: React.Dispatch<React.SetStateAction<string | undefined>>;
  standingsList: string[];
  setStandingsList: React.Dispatch<React.SetStateAction<string[]>>;
  addPlayerToStandings: (playerId: string) => void;
  removeFromStandings: (index: number) => void;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
  handleSaveStandings: () => void;
  updateStatus: string;
  updateError: any;
};

const AdminPageView: React.FC<AdminPageProps> = ({
  user,
  isAdmin,
  handleSignIn,
  handleSignOut,
  name,
  setName,
  dupr,
  setDupr,
  imageUrl,
  setImageUrl,
  handleCreate,
  createStatus,
  createError,
  events,
  players,
  selectedEventId,
  setSelectedEventId,
  standingsList,
  setStandingsList,
  addPlayerToStandings,
  removeFromStandings,
  moveUp,
  moveDown,
  handleSaveStandings,
  updateStatus,
  updateError,
}) => {
  return (
    <div className="p-4 space-y-8">
      <SectionHeader as="h1" className="mb-4">
        Admin
      </SectionHeader>

      {user ? (
        <div className="space-y-8">
          <p className="mb-2">
            Signed in as <strong>{user.displayName ?? user.email}</strong>
          </p>
          <p>Admin status: {isAdmin ? 'Yes' : 'No'}</p>
          <Button onClick={handleSignOut}>Sign out</Button>

          <Card>
            <SectionHeader as="h2" className="mb-2">
              Protected admin area
            </SectionHeader>
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
            <SectionHeader as="h2" className="mb-2">
              Create Event
            </SectionHeader>
            <p className="text-sm text-gray-600 mb-4">
              Create a new Event (start date/time is required).
            </p>
            {/* EventForm logic should be moved to container if needed */}
          </Card>

          <Card className="p-6 mb-6">
            <SectionHeader as="h2" className="mb-2">
              Manage Event Standings
            </SectionHeader>
            <p className="text-sm text-gray-600 mb-4">
              Select an event, build an ordered standings list of players, and save to the event.
            </p>

            <Card>
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
                <Label>Standings (ordered)</Label>
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
                    <Button
                      type="button"
                      onClick={handleSaveStandings}
                      disabled={!isAdmin || updateStatus === 'pending' || !selectedEventId}
                      color="success"
                      className="px-6 py-3 text-base"
                    >
                      {updateStatus === 'pending' ? 'Saving...' : 'Save standings to event'}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => {
                        setStandingsList([]);
                      }}
                      color="surface"
                      className="px-6 py-3 text-base"
                    >
                      Clear
                    </Button>
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

export default AdminPageView;
