import React from 'react';
import { Card, Input, Button, Badge, Select } from '../components/ui';

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
  // Event creation props
  eventName: string;
  setEventName: React.Dispatch<React.SetStateAction<string>>;
  eventCode: string;
  setEventCode: React.Dispatch<React.SetStateAction<string>>;
  eventDate: string;
  setEventDate: React.Dispatch<React.SetStateAction<string>>;
  eventTime: string;
  setEventTime: React.Dispatch<React.SetStateAction<string>>;
  eventLocation: string;
  setEventLocation: React.Dispatch<React.SetStateAction<string>>;
  courtReserveUrl: string;
  setCourtReserveUrl: React.Dispatch<React.SetStateAction<string>>;
  handleCreateEvent: (e: React.FormEvent) => void;
  createEventStatus: string;
  createEventError: any;
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
  // Event creation props
  eventName,
  setEventName,
  eventCode,
  setEventCode,
  eventDate,
  setEventDate,
  eventTime,
  setEventTime,
  eventLocation,
  setEventLocation,
  courtReserveUrl,
  setCourtReserveUrl,
  handleCreateEvent,
  createEventStatus,
  createEventError,
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin</h1>

      {user ? (
        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-slate-500 dark:text-slate-400">Signed in as</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {user.displayName ?? user.email}
              </span>
              <Badge variant={isAdmin ? 'success' : 'default'}>
                {isAdmin ? 'Admin' : 'User'}
              </Badge>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>

          {!isAdmin && (
            <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-sm text-red-600 dark:text-red-400">
                You are not an admin. Editing is disabled.
              </p>
            </div>
          )}

          {/* Create Event Form */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Create Event
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Create a new league event.
            </p>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="eventName"
                    className="block text-sm font-medium text-slate-900 dark:text-slate-100"
                  >
                    Event Name
                  </label>
                  <Input
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                    placeholder="Week 5 - Premier League"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="eventCode"
                    className="block text-sm font-medium text-slate-900 dark:text-slate-100"
                  >
                    Event Code (URL slug)
                  </label>
                  <Input
                    id="eventCode"
                    value={eventCode}
                    onChange={(e) => setEventCode(e.target.value)}
                    required
                    placeholder="week-5"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="eventDate"
                    className="block text-sm font-medium text-slate-900 dark:text-slate-100"
                  >
                    Date
                  </label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="eventTime"
                    className="block text-sm font-medium text-slate-900 dark:text-slate-100"
                  >
                    Time
                  </label>
                  <Input
                    id="eventTime"
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="eventLocation"
                  className="block text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  Location (optional)
                </label>
                <Input
                  id="eventLocation"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Pickleball Club STL"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="courtReserveUrl"
                  className="block text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  CourtReserve URL (optional)
                </label>
                <Input
                  id="courtReserveUrl"
                  value={courtReserveUrl}
                  onChange={(e) => setCourtReserveUrl(e.target.value)}
                  placeholder="https://app.courtreserve.com/..."
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={!isAdmin || createEventStatus === 'pending' || !eventName || !eventCode || !eventDate}
                  loading={createEventStatus === 'pending'}
                >
                  Create Event
                </Button>
              </div>

              {createEventError && (
                <p className="text-sm text-red-500">Error: {String(createEventError)}</p>
              )}
            </form>
          </Card>

          {/* Add Player Form */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Add Player
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Create a new player in the system.
            </p>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Player name"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="dupr"
                  className="block text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  DUPR (optional)
                </label>
                <Input
                  id="dupr"
                  value={dupr}
                  onChange={(e) => setDupr(e.target.value)}
                  inputMode="decimal"
                  placeholder="3.5"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  Image URL (optional)
                </label>
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
                  disabled={!isAdmin || createStatus === 'pending'}
                  loading={createStatus === 'pending'}
                >
                  Add player
                </Button>
              </div>

              {createError && (
                <p className="text-sm text-red-500">Error: {String(createError)}</p>
              )}
            </form>
          </Card>

          {/* Manage Event Standings */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Manage Event Standings
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Select an event, build an ordered standings list of players, and save.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Left: Event & Player Selection */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                    Event
                  </label>
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
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                    Players
                  </label>
                  <div className="max-h-56 overflow-auto rounded-lg border border-slate-200 dark:border-slate-800">
                    {players.length === 0 ? (
                      <p className="p-3 text-sm text-slate-500 dark:text-slate-400">
                        No players found.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {players.map((p: any) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between px-3 py-2"
                          >
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                              {p.name}
                            </span>
                            <Button
                              size="small"
                              variant="ghost"
                              onClick={() => addPlayerToStandings(p.id)}
                            >
                              Add
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Standings List */}
              <div className="space-y-4 md:col-span-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                  Standings (ordered)
                </label>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3">
                  {standingsList.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No players in standings. Add players from the left.
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {standingsList.map((pid, idx) => {
                        const p = players.find((x: any) => x.id === pid);
                        return (
                          <div
                            key={`${pid}-${idx}`}
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                                {idx + 1}.
                              </span>
                              <span className="text-sm text-slate-900 dark:text-slate-100">
                                {p ? p.name : pid}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="small"
                                variant="ghost"
                                onClick={() => moveUp(idx)}
                                disabled={idx === 0}
                              >
                                ↑
                              </Button>
                              <Button
                                size="small"
                                variant="ghost"
                                onClick={() => moveDown(idx)}
                                disabled={idx === standingsList.length - 1}
                              >
                                ↓
                              </Button>
                              <Button
                                size="small"
                                variant="secondary"
                                onClick={() => removeFromStandings(idx)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
                    <Button
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

                  {updateError && (
                    <p className="mt-2 text-sm text-red-500">Error: {String(updateError)}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="mb-6 text-slate-500 dark:text-slate-400">
            Sign in with a Google account to access admin features.
          </p>
          <Button onClick={handleSignIn}>Sign in with Google</Button>
        </Card>
      )}
    </div>
  );
};

export default AdminPageView;