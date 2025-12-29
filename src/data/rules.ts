/**
 * Centralized rules file.
 * Contains base/league/challenge variants. Use spread to minimize duplication.
 */

/* Shared types for rules data (exported here so data files are the single source of truth) */
export interface Price {
  amount?: number;
  unit?: string;
  display: string;
  note?: string;
}

export interface ShowSections {
  seasonStructure?: boolean;
  prizes?: boolean;
  qualifiers?: boolean;
}

export interface PointsTable {
  championship: Record<number, number>;
  court2: Record<number, number>;
  court3: Record<number, number>;
  court4: Record<number, number>;
}

export interface RulesBase {
  title?: string;
  subtitle?: string;
  summary?: string;
  fee?: string;
  price?: Price;
  showSections?: ShowSections;
  philosophy?: string;
  seasonStructure?: {
    rosterSize?: number;
    duration?: string;
    when?: string;
    safeZone?: string;
    dropZone?: string;
  };
  register: {
    url: string;
    text: string;
  };
  schedule?: {
    day?: string;
    time?: string;
  };
  location?: {
    name?: string;
    url?: string;
    city?: string;
  };
  participant?: {
    type?: string;
    note?: string;
  };
  seeding?: any;
  rewards?: any;
  qualification?: any;
  general?: string[];
  format?: any;
  faqs?: any;
  scoring?: string[];
  points?: PointsTable;
  subs?: string[];
  missedWeekNote?: string;
  [key: string]: any;
}

/* Base rules object (typed) */
export const baseRules: RulesBase = {
  subtitle:
    'The premier competitive league in St. Louis. Merit-based advancement, weekly stakes, and a path to the championship.',
  schedule: {
    day: 'Sundays',
    time: '7:00 - 9:00 PM',
  },
  location: {
    name: 'Paddle Up',
    url: 'https://maps.app.goo.gl/dKNY9dnEDiFdM3XK8',
    city: 'Chesterfield',
  },
  participant: {
    type: 'Individual',
    note: 'No Partner Needed',
  },
  register: {
    url: 'https://courtreserve.com',
    text: 'Register on CourtReserve',
  },
  missedWeekNote: 'Missed week = 0 points',

  philosophy:
    'Competitive integrity is the priority. Rotating partners, merit-based court movement, and transparent standings determine advancement. Top performers earn season rewards and guaranteed spots for the next season, while lower performers must re-qualify to ensure a high level of competition.',
  seasonStructure: {
    rosterSize: 16,
    duration: '6 Weeks',
    when: 'Sundays, 7:00 PM – 9:00 PM',
    safeZone:
      'Top 12 players (of a 16-player roster) automatically qualify for the next season — guaranteed roster spots at the end of the 6-week season.',
    dropZone:
      'Bottom 4 players (of a 16-player roster) must re-qualify for the next season. They lose their roster spot at the end of the 6-week season and may re-enter via the Open Qualifiers.',
  },

  // Seeding rules: how initial placement is determined and the snake draw
  seeding: {
    overview:
      'Initial seeding uses DUPR for Week 1; thereafter seeding is based on season points and weekly performance.',
    week1:
      'Use DUPR rating (higher DUPR = higher seed). If DUPR missing, use last-seen DUPR or default to league admin placement.',
    draw: "Balanced 'Snake Draw' across 4 courts.",
    tieBreakers: ['Head-to-head (if available)', 'Higher DUPR', 'Most recent higher placement'],
    promotionRelegation: {
      summary:
        'Top 2 on each court advance/move up per round; courts are reassigned between rounds based on performance.',
      nightlyPromotionBonus:
        'Players who win promotion to a higher court receive a small bonus (configurable) applied after nightly results.',
    },
    courts: [
      { name: 'Court 1', seeds: '1, 8, 9, 16' },
      { name: 'Court 2', seeds: '2, 7, 10, 15' },
      { name: 'Court 3', seeds: '3, 6, 11, 14' },
      { name: 'Court 4', seeds: '4, 5, 12, 13' },
    ],
  },

  rewards: {
    firstPlace: {
      name: '1st',
      items: ['$100 Court Credit', 'Free Entry Next Season', '50 Paddle Up Club Points'],
    },
    secondPlace: {
      name: '2nd',
      items: ['$60 Court Credit', '30 Paddle Up Club Points'],
    },
    thirdPlace: {
      name: '3rd',
      items: ['$40 Court Credit', '20 Paddle Up Club Points'],
    },
    notes:
      'Court credits are applied to player accounts; club points are tracked separately from league standings.',
  },

  qualification: {
    description:
      'Before each season begins, we host two Open Qualifier events to fill the open roster spots.',
    who: [
      'New applicants (DUPR 3.6+ required)',
      'Players who must re-qualify from the previous season (bottom 4)',
    ],
    format: 'Round Robin (Rotating Partners)',
    advancement: [
      'Qualifier #1: The Top 2 finishers earn a spot in the league',
      'Qualifier #2: The Top 2 finishers earn a spot in the league',
      'Remaining roster spots (if any) are filled based on overall points from both events',
    ],
    note: 'If you fail to qualify in the first event, you may register for the second event to try again.',
  },
  general: ['DUPR 3.6+ required', 'DUPR must be linked in CourtReserve prior to play'],
  format: [
    {
      title: 'Round 1: Quarterfinals',
      description: [
        'Players are divided into 4 courts based on seeding.',
        'Top 2 from each court advance to the Upper Bracket (Courts 1 & 2).',
        'Bottom 2 move to the Lower Bracket (Courts 3 & 4).',
      ],
    },
    {
      title: 'Round 2: Semifinals',
      description: [
        'Bracket play.',
        'Top 2 from each Upper Bracket court advance to the Championship Court (C1); bottom 2 move to Court 2.',
        'Top 2 from each Lower Bracket court advance to Court 3; bottom 2 move to Court 4.',
      ],
    },
    {
      title: 'Round 3: Finals',
      description: [
        'Final placement.',
        'You play one last round robin on your assigned court (1-4) to determine your final points and ranking.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What happens if I miss a week?',
      answer:
        'If you miss a week, you receive 0 points for that night. You must notify the league admin so a substitute can be assigned. You are allowed a maximum of 2 sub replacements per season.',
    },
    {
      question: 'Can I choose my own sub?',
      answer:
        'No. To ensure competitive balance and fairness, all substitutes are assigned by the league administration from the approved sub pool.',
    },
    {
      question: 'How do I qualify for the next season?',
      answer:
        'The top 4 players from the current season automatically qualify for the next season. Other spots may be filled through open registration or qualifying nights.',
    },
    {
      question: 'Is there a warm-up period?',
      answer:
        'Yes, courts are available for warm-up starting at 6:45 PM. League play begins promptly at 7:00 PM.',
    },
  ],
  scoring: ['Traditional scoring', 'Games to 11 — win by 1', 'Ceiling contact = out'],

  points: {
    championship: { 1: 1000, 2: 800, 3: 600, 4: 400 },
    court2: { 1: 300, 2: 240, 3: 180, 4: 120 },
    court3: { 1: 100, 2: 80, 3: 60, 4: 40 },
    court4: { 1: 30, 2: 24, 3: 18, 4: 12 },
  },

  subs: [
    'League players must contact league administration to arrange for a sub ahead of time',
    'Subs will be chosen from from the top performers in the most recent Open Qualifiers',
    'Absent players receive 0 points',
  ],
} as const;

/* leagueRules: full season variant */
export const leagueRules: RulesBase & { title: string } = {
  title: 'Paddle Up Individual Championship League',
  fee: '$80',
  summary:
    'Season-long championship format — 6 weeks of merit-based play with promotion/relegation, weekly standings, and season prizes. Ideal for players who want sustained competitive play and a path to the championship.',
  ...baseRules,
} as const;

/* challengeRules: current short-format variant — reuse baseRules with overrides */
export const challengeRules: RulesBase & { title: string } = {
  title: 'The Challenge',
  summary:
    'Short-form weekly competition — rotating partners, per-night entry, and court promotion each round. Quick, social, and competitive nights focused on weekly performance.',
  price: { amount: 15, unit: 'per night', display: '$15', note: 'per night' },
  showSections: { seasonStructure: false, prizes: false, qualifiers: false },
  ...baseRules,
} as const;

/* Backwards compat: default exported 'rules' used across the app points to the league rules */
export const rules = leagueRules;

export type Rules = typeof rules;
export type LeagueRules = typeof leagueRules;
export type ChallengeRules = typeof challengeRules;
