import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Select,
  Label,
  List,
  ListItem,
  ErrorText,
  Button,
  Heading,
  Badge,
} from '../components/ui';

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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Heading as="h1">Admin</Heading>

      {user ? (
        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-fg-muted">Signed in as</span>
              <span className="font-medium">{user.displayName ?? user.email}</span>
              <Badge variant={isAdmin ? 'success' : 'default'}>{isAdmin ? 'Admin' : 'User'}</Badge>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>

          {!isAdmin && (
            <div className="rounded-lg border border-error bg-error-subtle p-4">
              <p className="text-sm text-error">You are not an admin. Editing is disabled.</p>
            </div>
          )}

          {/* Add Player Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add Player</CardTitle>
              <CardDescription>Create a new player in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Player name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dupr">DUPR (optional)</Label>
                  <Input
                    id="dupr"
                    value={dupr}
                    onChange={(e) => setDupr(e.target.value)}
                    inputMode="decimal"
                    placeholder="3.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL (optional)</Label>
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!isAdmin || createStatus === 'pending'}
                    loading={createStatus === 'pending'}
                  >
                    Add player
                  </Button>
                </div>

                <ErrorText>{createError && `Error: ${String(createError)}`}</ErrorText>
              </form>
            </CardContent>
          </Card>

          {/* Create Event */}
          <Card>
            <CardHeader>
              <CardTitle>Create Event</CardTitle>
              <CardDescription>Create a new Event (start date/time is required).</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-fg-muted">
                EventForm logic should be moved to container if needed.
              </p>
            </CardContent>
          </Card>

          {/* Manage Event Standings */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Event Standings</CardTitle>
              <CardDescription>
                Select an event, build an ordered standings list of players, and save.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {/* Left: Event & Player Selection */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="event">Event</Label>
                    <Select
                      id="event"
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
                  </div>

                  <div className="space-y-2">
                    <Label>Players</Label>
                    <div className="max-h-56 overflow-auto rounded-lg border border-border">
                      {players.length === 0 ? (
                        <p className="p-3 text-sm text-fg-muted">No players found.</p>
                      ) : (
                        <List divided>
                          {players.map((p: any) => (
                            <ListItem key={p.id} className="px-3">
                              <span className="text-sm">{p.name}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addPlayerToStandings(p.id)}
                              >
                                Add
                              </Button>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Standings List */}
                <div className="space-y-4 md:col-span-2">
                  <Label>Standings (ordered)</Label>
                  <div className="rounded-lg border border-border bg-bg-subtle p-3">
                    {standingsList.length === 0 ? (
                      <p className="text-sm text-fg-muted">
                        No players in standings. Add players from the left.
                      </p>
                    ) : (
                      <List divided>
                        {standingsList.map((pid, idx) => {
                          const p = players.find((x: any) => x.id === pid);
                          return (
                            <ListItem key={`${pid}-${idx}`}>
                              <div className="flex items-center gap-3">
                                <span className="w-6 text-sm font-medium text-fg-muted">
                                  {idx + 1}.
                                </span>
                                <span className="text-sm">{p ? p.name : pid}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => moveUp(idx)}
                                  disabled={idx === 0}
                                >
                                  ↑
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => moveDown(idx)}
                                  disabled={idx === standingsList.length - 1}
                                >
                                  ↓
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeFromStandings(idx)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </ListItem>
                          );
                        })}
                      </List>
                    )}

                    <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                      <Button
                        variant="primary"
                        onClick={handleSaveStandings}
                        disabled={!isAdmin || updateStatus === 'pending' || !selectedEventId}
                        loading={updateStatus === 'pending'}
                      >
                        Save standings
                      </Button>
                      <Button variant="secondary" onClick={() => setStandingsList([])}>
                        Clear
                      </Button>
                    </div>

                    <ErrorText className="mt-2">
                      {updateError && `Error: ${String(updateError)}`}
                    </ErrorText>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="text-center">
          <CardContent className="py-12">
            <p className="mb-6 text-fg-muted">
              Sign in with a Google account to access admin features.
            </p>
            <Button variant="primary" onClick={handleSignIn}>
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPageView;
