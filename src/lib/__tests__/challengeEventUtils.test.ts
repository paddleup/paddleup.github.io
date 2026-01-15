import { describe, expect, it } from 'vitest';
import {
  generateChallengeEventDraw,
  generateCourts,
  generateGames,
  getNumberOfCourts,
} from '../challengeEventUtils';
import { Court } from '../../types';

describe('challengeEventUtils', () => {
  describe('getNumberOfCourts', () => {
    it('throws if 0 players', () => {
      expect(() => getNumberOfCourts(0)).toThrow();
    });

    it('throws if 6 or 7 players', () => {
      expect(() => getNumberOfCourts(6)).toThrow();
      expect(() => getNumberOfCourts(7)).toThrow();
    });

    it('returns correct court counts for valid player numbers', () => {
      expect(getNumberOfCourts(4)).toBe(1);
      expect(getNumberOfCourts(5)).toBe(1);
      expect(getNumberOfCourts(8)).toBe(2);
      expect(getNumberOfCourts(10)).toBe(2);
      expect(getNumberOfCourts(12)).toBe(3);
      expect(getNumberOfCourts(15)).toBe(3);
      expect(getNumberOfCourts(16)).toBe(4);
      expect(getNumberOfCourts(20)).toBe(4);
      expect(getNumberOfCourts(28)).toBe(6);
      expect(getNumberOfCourts(35)).toBe(7);
    });

    it('returns correct court counts for preferred court size 4', () => {
      expect(getNumberOfCourts(4, 4)).toBe(1);
      expect(getNumberOfCourts(5, 4)).toBe(1);
      expect(getNumberOfCourts(8, 4)).toBe(2);
      expect(getNumberOfCourts(10, 4)).toBe(2);
      expect(getNumberOfCourts(12, 4)).toBe(3);
      expect(getNumberOfCourts(15, 4)).toBe(3);
      expect(getNumberOfCourts(16, 4)).toBe(4);
      expect(getNumberOfCourts(20, 4)).toBe(5);
      expect(getNumberOfCourts(28, 4)).toBe(7);
      expect(getNumberOfCourts(35, 4)).toBe(7);
    });

    it('throws for too many players even with preferred court size 4', () => {
      expect(() => getNumberOfCourts(36, 4)).toThrow();
      expect(() => getNumberOfCourts(37, 4)).toThrow();
    });
  });

  describe('generateChallengeEventDraw', () => {
    it('throws for invalid player counts', () => {
      expect(() => generateChallengeEventDraw(0, 1)).toThrow();
      expect(() => generateChallengeEventDraw(6, 1)).toThrow();
      expect(() => generateChallengeEventDraw(7, 1)).toThrow();
    });

    it('generates correct draws for 10 players, round 1', () => {
      const draws = generateChallengeEventDraw(10, 1);
      expect(draws.length).toBe(2);
      expect(draws[0].seeds).toEqual([1, 4, 5, 8, 9]);
      expect(draws[1].seeds).toEqual([2, 3, 6, 7, 10]);
    });

    it('generates correct draws for 10 players, round 2', () => {
      const draws = generateChallengeEventDraw(10, 2);
      expect(draws.length).toBe(2);
      expect(draws[0].seeds).toEqual([1, 2, 3, 4, 5]);
      expect(draws[1].seeds).toEqual([6, 7, 8, 9, 10]);
    });

    it('generates correct draws for 14 players, round 1', () => {
      const draws = generateChallengeEventDraw(14, 1);
      expect(draws.length).toBe(3);
      expect(draws[0].seeds).toEqual([1, 6, 7, 12, 13]);
      expect(draws[1].seeds).toEqual([2, 5, 8, 11, 14]);
      expect(draws[2].seeds).toEqual([3, 4, 9, 10]);
    });

    it('generates correct draws for 14 players, round 2', () => {
      const draws = generateChallengeEventDraw(14, 2);
      expect(draws.length).toBe(3);
      expect(draws[0].seeds).toEqual([1, 2, 3, 4, 5]);
      expect(draws[1].seeds).toEqual([6, 7, 8, 9, 10]);
      expect(draws[2].seeds).toEqual([11, 12, 13, 14]);
    });
  });

  describe('generateCourts', () => {
    it('generates correct courts for 10 players, round 1', () => {
      const playerIds = Array.from({ length: 10 }, (_, i) => `player${i + 1}`);
      const courts = generateCourts(playerIds, 1);
      expect(courts.length).toBe(2);
      expect(courts[0].playerIds).toEqual(['player1', 'player4', 'player5', 'player8', 'player9']);
      expect(courts[1].playerIds).toEqual(['player2', 'player3', 'player6', 'player7', 'player10']);
    });

    it('generates correct courts for 10 players, round 2', () => {
      const playerIds = Array.from({ length: 10 }, (_, i) => `player${i + 1}`);
      const courts = generateCourts(playerIds, 2);
      expect(courts.length).toBe(2);
      expect(courts[0].playerIds).toEqual(['player1', 'player2', 'player3', 'player4', 'player5']);
      expect(courts[1].playerIds).toEqual(['player6', 'player7', 'player8', 'player9', 'player10']);
    });
  });

  describe('generateGames', () => {
    it('generates correct games for a 4-player court', () => {
      const court: Court = {
        courtNumber: 1,
        playerIds: ['player1', 'player2', 'player3', 'player4'],
        roundNumber: 1,
      };
      const games = generateGames(court);
      expect(games.length).toBe(3);
      expect(games).toEqual([
        {
          team1: { player1Id: 'player1', player2Id: 'player2' },
          team2: { player1Id: 'player3', player2Id: 'player4' },
          roundNumber: 1,
        },
        {
          team1: { player1Id: 'player1', player2Id: 'player3' },
          team2: { player1Id: 'player2', player2Id: 'player4' },
          roundNumber: 1,
        },
        {
          team1: { player1Id: 'player1', player2Id: 'player4' },
          team2: { player1Id: 'player2', player2Id: 'player3' },
          roundNumber: 1,
        },
      ]);
    });

    it('generates correct games for a 5-player court', () => {
      const court: Court = {
        courtNumber: 1,
        playerIds: ['player1', 'player2', 'player3', 'player4', 'player5'],
        roundNumber: 1,
      };
      const games = generateGames(court);
      expect(games.length).toBe(5);
      expect(games).toEqual([
        {
          team1: { player1Id: 'player1', player2Id: 'player2' },
          team2: { player1Id: 'player3', player2Id: 'player4' },
          roundNumber: 1,
        },
        {
          team1: { player1Id: 'player2', player2Id: 'player3' },
          team2: { player1Id: 'player4', player2Id: 'player5' },
          roundNumber: 1,
        },
        {
          team1: { player1Id: 'player1', player2Id: 'player3' },
          team2: { player1Id: 'player2', player2Id: 'player5' },
          roundNumber: 1,
        },
        {
          team1: { player1Id: 'player1', player2Id: 'player4' },
          team2: { player1Id: 'player3', player2Id: 'player5' },
          roundNumber: 1,
        },
        {
          team1: { player1Id: 'player1', player2Id: 'player5' },
          team2: { player1Id: 'player2', player2Id: 'player4' },
          roundNumber: 1,
        },
      ]);
    });
  });
});
