# Project Context: Paddle Up (UPDATED 2025-12-29)

## Overview
Paddle Up is a TypeScript + React (Vite) single-page app that manages the Paddle Up Individual Championship League: player roster, weekly/one-night events, court assignments, standings, and published rules. The app is frontend-only and derives season/weekly stats from in-repo data files and domain logic.

This document reflects the current authoritative locations, conventions, and recent code changes as of 2025-12-29.

## Tech stack
- Language: TypeScript (strictening in progress)
- Framework / Bundler: React + Vite
- Styling: Tailwind CSS
- Routing: React Router
- Icons: Lucide React
- Data files: TypeScript modules under src/data (rules, players, challengeEvents)
- Hooks: small, focused hooks in src/hooks (usePlayers, useRules, useSeasonStats)
- Domain logic: split across src/lib (standings.ts, season.ts, leagueUtils.ts, points.ts)
- Types: src/types/index.ts
- Tests: limited. Recommended: Vitest + CI (typecheck + tests + build)

## Recent code changes (high level)
- src/data/rules.ts
  - Added explicit PointsTable type and replaced permissive `any` for the points shape.
  - rules.* objects remain the canonical source of truth and export typed rule shapes.
- src/lib/points.ts
  - Replaced unsafe index helpers with typed safeLookup and guarded access to rules.points.
  - getPointsForRank now uses the typed PointsTable and defaults to empty tables to avoid runtime errors.
- Multiple UI components updated to remove implicit-`any` and handle optional fields:
  - src/pages/Standings.tsx — removed unsafe casts and introduced a small WeekLike shape when synthesizing week objects from challenge events.
  - src/components/format/* — NightlyFormat, PreSeasonQualifiers, ScoringSection, SeasonStructure: added explicit callback param types and guards for optional rules.* fields.
  - src/components/match/CourtCard.tsx — aligned Props with destructured values (added optional scores and onScoreChange).
- TypeScript checks were run iteratively to surface and fix implicit-any and possibly-undefined errors. Work is ongoing to reach zero type errors under tsc --noEmit.
- Small cleanup: removed or gated several unsafe `any` usages and substituted explicit shapes where safe.

## Current authoritative files & directories (critical)
- `src/data/rules.ts` — CRITICAL. Canonical rules data + exported rule types (baseRules, leagueRules, challengeRules, rules). Contains PointsTable type now.
- `src/data/players.ts` — CRITICAL. Typed roster export: `export const players: Player[]`.
- `src/data/challengeEvents.ts` — Typed event definitions and exported `challengeEvents: ChallengeEvent[]`.
- `src/types/index.ts` — CRITICAL. Central TypeScript types and re-exports of rules types.
- `src/lib/standings.ts` — CRITICAL. Week-level computations; exports calculateWeekFinalPositions and aggregatesFromWeek.
- `src/lib/season.ts` — CRITICAL. Season-level aggregations: calculateSeasonStats and calculateAllTimeStats.
- `src/lib/points.ts` — Points lookup (getPointsForRank) — now typed and defensive.
- `src/hooks/` — usePlayers.ts, useRules.ts, useSeasonStats.ts — memoized selectors for UI consumption.
- `src/pages/` — key views: Format, Home, Standings, Players, PlayerProfile, MatchSheet, Champions, Calculator.
- `src/components/format/` — UI for rendering rules (NightlyFormat, SeasonStructure, ScoringSection, PreSeasonQualifiers).
- `public/images/players/` — Player images referenced by players.ts.

## Conventions & recent decisions (updated)
- Data files remain TypeScript modules exporting typed constants. Do NOT add plain JSON for domain data.
- rules.ts is the canonical source for rules text and rule-shaped types. UI and logic must import from it.
- Naming convention:
  - "rank" = global ordering across all players (1..N)
  - "position" = within-court place (1..4)
  - "court" = numeric court assignment (1..4)
- Domain helpers return small, explicit shapes. Example: week final entries: { playerId, court, position, rank, pointsEarned }.
- Prefer derived, memoized hooks for UI consumption (see src/hooks).
- Be defensive when consuming optional fields from rules.* — prefer guards (Array.isArray, ?? defaults) rather than unsafe casts.

## Notes about editing rules/data safely
- Update `src/types/index.ts` when adding new domain types or changing data shapes.
- Edit data under `src/data/*` only; keep UI components importing from those modules rather than duplicating constants.
- Avoid hardcoding points or seeding constants in components — use `src/lib/points.ts` and `src/data/rules.ts`.
- When adding new arrays/strings to rules, ensure components consuming them use guards (Array.isArray, ??) to avoid TS errors.

## Biggest refactor opportunities (prioritized)
These are ordered by expected impact and estimated effort.

1) Enforce strict typing & CI gate (High)
   - What: Enable "strict": true in tsconfig (if not already) and add a GitHub Actions workflow that runs `npx tsc --noEmit`, lint, and unit tests on PRs.
   - Why: Prevents regressions and surfaces implicit-any/undefined access before merge.
   - Effort: Low–medium.

2) Centralize and validate data shapes (High)
   - What: Consolidate schema types and add runtime validation for external/authoring workflows (zod schemas for src/data/*).
   - Why: Guarantees editor/runtime safety and prevents malformed data files.
   - Effort: Medium.

3) Feature-folder reorganization (Medium)
   - What: Group pages, components, hooks, and tests by feature (e.g., src/features/players/*, src/features/matchsheet/*).
   - Why: Improves discoverability and reduces cross-file coupling.
   - Effort: Medium.

4) Add unit tests for domain logic (Medium)
   - What: Add Vitest and tests for src/lib/standings.ts, season.ts and points.ts (edge cases + canonical examples).
   - Why: Domain logic is the most critical part; tests prevent subtle scoring/aggregation regressions.
   - Effort: Medium.

5) Data provenance tooling & validation CLI (Medium)
   - What: Add a small scripts/validate-data.ts that checks player images exist, event dates parse, and rules shape matches zod schema; wire to pre-commit or CI.
   - Why: Makes contributor workflow safer when editing src/data files.
   - Effort: Medium.

6) Break large UI pages into testable subcomponents (Low–Medium)
   - What: Split large format and page components into smaller units (e.g., Format → SeasonStructure, ScoringSection, PreSeasonQualifiers are already split; continue this pattern for other large pages).
   - Why: Smaller components are easier to test and reason about.
   - Effort: Low–Medium.

7) Reduce duplication in domain helpers (Low)
   - What: Move related logic (promotion/relegation, seeding, points lookup) into a small set of pure utility modules with clear inputs/outputs.
   - Why: Simplifies reasoning and improves reusability.
   - Effort: Low.

8) Add stronger lint rules / stricter pre-commit hooks (Low)
   - What: Tighten ESLint rules to catch unused imports, implicit any, and enforce consistent import ordering. Husky pre-commit exists — extend checks.
   - Why: Keeps repo clean and reduces CI churn.
   - Effort: Low.

## Quick actionable starter checklist
- [ ] Add GitHub Actions: typecheck (npx tsc --noEmit) + lint + tests
- [ ] Add Vitest and tests for src/lib/standings.ts, src/lib/season.ts, src/lib/points.ts
- [ ] Add zod schemas for src/data/* and a validate-data script (scripts/validate-data.ts)
- [ ] Centralize types (if needed) and ensure src/types/index.ts is authoritative
- [ ] Migrate to feature-based folders in a single follow-up PR
- [ ] Hard-surface points shape changes in CHANGELOG / CONTRIBUTING.md for contributors (notes about PointsTable)
- [ ] Run and fix `npx tsc --noEmit` until green; add CI gate

## Editing guidance (practical tips)
- When changing a data file, run `npx tsc --noEmit` locally before committing.
- Avoid quick `any` fixes: prefer small, explicit types or local guards.
- For UI display of data fields that may be missing, prefer `Array.isArray(...)` guards or `const x = rules.foo ?? {}` local guards.
- When introducing new fields in rules.ts, update `src/types/index.ts` or export the shape from rules.ts so the rest of the app can import the canonical type.

## Contact / repo info
- Repo remote: origin: https://github.com/paddleup/paddleup.github.io.git
- Work tree: c:\src\paddleup
