# Copilot Instructions for paddleup.github.io

## Build & Run

```bash
npm run dev        # Vite dev server at localhost:5173
npm run build      # Production build to dist/
npm run scrape     # Fetch latest leaderboard data from QuickScores → public/data/leaderboard.json
npm run lint       # ESLint
npm run lint:fix   # ESLint auto-fix
```

Run `npm run scrape` before `npm run dev` if `public/data/leaderboard.json` doesn't exist yet.

## Architecture

This is a **static React SPA** deployed to GitHub Pages that displays pickleball club leaderboard standings.

**Data pipeline:** A Node.js scraper (`scripts/scrape.mjs`) fetches HTML from QuickScores, parses the standings table with cheerio, and writes `public/data/leaderboard.json`. A GitHub Actions workflow (`scrape.yml`) runs this daily and commits the updated JSON. The React app fetches this static JSON at runtime — there is no backend or API.

**Category system:** Players are manually assigned to categories (Men's/Women's Overall, 50+, 60+) via `src/data/categories.json`. The `useLeaderboard` hook applies **cascading logic**: a player in 60+ automatically appears in 50+ and Overall; a player in 50+ automatically appears in Overall. The special "overall" category shows all players unfiltered. Players only need to be listed in their most specific category.

**Theme system:** `useTheme` hook manages light/dark/system modes via a `dark` class on `<html>` and persists to localStorage. Default is light. All components use Tailwind `dark:` variants.

## Conventions

- **Styling:** Tailwind CSS v4 with `@tailwindcss/vite` plugin. Custom colors defined in `src/index.css` under `@theme` (accent, gold, silver, bronze). Use `dark:` variants for all color classes. No separate tailwind config file.
- **Accent color:** `accent-600` (#002659 navy) for light mode, `accent-400` for dark mode.
- **Imports:** Use `@/` alias for `src/` directory (configured in vite.config.ts).
- **No router:** Single-page app with no routing — all state is local React state.
- **No backend:** No Firebase, no API calls. Data comes from static JSON only.
- **Package manager:** npm (not yarn, despite yarn.lock still being present).
- **Deploy:** Push to `main` triggers GitHub Actions → builds → deploys to `gh-pages` branch.
- **Do not commit/push** after every change unless explicitly asked. Batch changes and wait for instruction to commit.
