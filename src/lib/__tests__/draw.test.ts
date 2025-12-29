import { describe, it, expect } from 'vitest';
import { generateSnakeDraw, getNextCourt } from '../draw';

const makePlayers = (n: number) =>
  Array.from({ length: n }).map((_, i) => ({ id: `p${i + 1}`, name: `Player ${i + 1}` }));

describe('generateSnakeDraw', () => {
  it('assigns seeds according to court indices', () => {
    const players = makePlayers(16);
    const courts = generateSnakeDraw(players);
    // Court 1 expected seeds: 1,8,9,16
    const court1Seeds = courts.find((c) => c.id === 1)!.players.map((p) => p.seed);
    expect(court1Seeds).toEqual([1, 8, 9, 16]);
    // Ensure names match players
    const court1Names = courts.find((c) => c.id === 1)!.players.map((p) => p.name);
    expect(court1Names[0]).toBe('Player 1');
  });

  it('handles fewer than 16 players', () => {
    const players = makePlayers(10);
    const courts = generateSnakeDraw(players);
    // No errors and courts have players <= 10
    const totalPlayers = courts.reduce((s, c) => s + c.players.length, 0);
    expect(totalPlayers).toBeGreaterThan(0);
    expect(totalPlayers).toBeLessThanOrEqual(10);
  });
});

describe('getNextCourt', () => {
  it('returns correct next court for round 1 and rank/ court combos', () => {
    expect(getNextCourt(1, 1, 1)).toBe(1);
    expect(getNextCourt(1, 2, 1)).toBe(2);
  });

  it('returns DONE for round 3', () => {
    expect(getNextCourt(3, 1, 1)).toBe('DONE');
  });

  it('returns TBD for unknown combos', () => {
    expect(getNextCourt(99, 1, 1)).toBe('TBD');
  });
});
