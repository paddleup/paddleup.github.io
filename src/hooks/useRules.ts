import { useMemo } from 'react';
import { rules as defaultRules, leagueRules, challengeRules } from '../data/rules';
import type { Rules, LeagueRules, ChallengeRules } from '../types';

/**
 * Hook that exposes the canonical rules object and named variants.
 * Memoizes the objects so consumers can safely use them in deps arrays.
 */
export const useRules = () => {
  const rules: Rules = useMemo(() => defaultRules, []);
  const league: LeagueRules = useMemo(() => leagueRules, []);
  const challenge: ChallengeRules = useMemo(() => challengeRules, []);

  return { rules, league, challenge };
};

export default useRules;
