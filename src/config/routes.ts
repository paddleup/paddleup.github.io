export const ROUTES = {
  HOME: '/',
  STANDINGS: '/standings',
  SCHEDULE: '/schedule',
  FORMAT: '/format',
  ADMIN: '/admin',
  PLAYER_PROFILE: '/player/:id',
  EVENT_DETAIL: '/event/:eventCode',
} as const;

// Helper functions to generate routes with parameters
export function getEventRoute(eventCode: string): string {
  return ROUTES.EVENT_DETAIL.replace(':eventCode', eventCode);
}

export function getPlayerRoute(playerId: string): string {
  return ROUTES.PLAYER_PROFILE.replace(':id', playerId);
}