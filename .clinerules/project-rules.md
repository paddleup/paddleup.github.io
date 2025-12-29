# Project Context: Paddle Up Individual Championship League (STLICL)

## Overview
This is a React application for managing the Paddle Up Individual Championship League. It tracks player standings, match history, and league rules. The app is built with Vite and deployed to GitHub Pages.

## Tech Stack
- **Language:** TypeScript
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Icons:** Lucide React
- **Data:** JSON/TS files (No backend database)

## Key Files & Directories
- `src/data/leagueData.ts`: **CRITICAL**. Contains the current season data (`seasonData`) and past seasons (`pastSeasons`). All standings rely on this file.
- `src/data/rules.ts`: **CRITICAL**. Contains the official league rules, point values, and format definitions. This file is the **source of truth** for all league logic.
- `src/data/players.json`: The roster of all players. Contains IDs, names, DUPR ratings, and image URLs.
- `src/lib/leagueUtils.ts`: Contains the logic for calculating standings (`calculateSeasonStats`) and determining points based on rank (`getPointsForRank`).
- `src/types/index.ts`: Contains TypeScript definitions for the project (Player, Match, Week, Standing, etc.).
- `src/pages/`: Contains the main views (Home, Standings, Players, PlayerProfile, etc.).

## Coding Guidelines
- **Language:** Use TypeScript for all new files (`.ts` or `.tsx`).
- **Styling:** Use Tailwind CSS utility classes. Avoid custom CSS unless necessary.
- **Components:** Use functional components with hooks and proper type definitions.
- **Single-component files:** Each file should export only one root-level React component. If you need helper or subcomponents, place them in their own files within src/components/ and import them where needed.
- **Navigation:** Use `Link` from `react-router-dom` for internal links.
- **Data Integrity:** When modifying `leagueData.ts`, ensure the structure of `weeks`, `rankings`, and `matches` remains consistent with the defined types.
- **Points System:** The point structure is defined in `rules.points` within `src/data/rules.ts`. Do not hardcode point values in components; always reference the rules or use `leagueUtils.ts`.
- **Source of Truth:** `src/data/rules.ts` and `src/pages/Format.tsx` are the authoritative sources for league rules and format. Any external summaries should be updated to match these files.
