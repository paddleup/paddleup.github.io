# Copilot Instructions for paddleup.github.io

## Build & Run

```bash
npm run dev        # Vite dev server at localhost:5173
npm run build      # Production build to dist/
npm run scrape     # Fetch latest ranking data from the KOTC Google Sheet → public/data/leaderboard.json
npm run lint       # ESLint
npm run lint:fix   # ESLint auto-fix
npm run format     # Prettier (src/**/*.{ts,tsx,js,jsx,json,md})
```

Run `npm run scrape` before `npm run dev` if `public/data/leaderboard.json` doesn't exist yet. There is no test framework or test suite.

## Architecture

This is a **static React SPA** (React 19, Vite 7, TypeScript) deployed to GitHub Pages that displays King of the Court (KOTC) pickleball league rankings.

**Data pipeline:** A Node.js scraper (`scripts/scrape.mjs`) reads the published KOTC Google Sheet. It parses the tab menu to map each ranking tab name to its `gid`, fetches each tab's published HTML table (`.../pubhtml/sheet?gid=<gid>`) with cheerio, and writes `public/data/leaderboard.json`. A GitHub Actions workflow (`scrape.yml`) runs this hourly and commits the updated JSON. The React app fetches this static JSON at runtime — there is no backend or API. The rankings are already computed in the sheet; the app only displays them.

**Views:** The sheet has three ranking tabs that map to site views: `Current Month` → `current-month`, `Past 30 Days` → `past-30-days`, `All Time` → `all-time` (the `RankingView` type). Default view is Current Month. If a sheet tab is renamed, update the `VIEWS` map in `scripts/scrape.mjs`.

**Ranking rows:** Each tab has columns `Ranking | ● | Player | Points | # of Events`. The `●` column is a text movement indicator read as-is: `●` (no change), `▲N` (up N places), `▼N` (down N places). The scraper parses it into `move: { dir: 'up' | 'down' | 'none', places: number }`. Each player row is `{ rank, name, points, events, move }`.

**Theme system:** `useTheme` hook manages light/dark/system modes via a `dark` class on `<html>` and persists to localStorage. Default is light. Toggle cycles: system → light → dark → system.

## Conventions

- **Styling:** Tailwind CSS v4 with `@tailwindcss/vite` plugin. Custom colors defined in `src/index.css` under `@theme` (accent-400 through accent-700, gold, silver, bronze). Use `dark:` variants for all color classes. Dark variant is class-based: `@custom-variant dark (&:where(.dark, .dark *))`. No separate tailwind config file.
- **Accent color:** `accent-600` (#002659 navy) for light mode, `accent-400` (#3b82f6 blue) for dark mode.
- **Icons:** lucide-react. Import individual icons (e.g., `Sun`, `Moon`, `Monitor`).
- **Class merging:** Use `clsx` + `tailwind-merge` for conditional/merged class names.
- **Imports:** Use `@/` alias for `src/` directory (configured in vite.config.ts).
- **TypeScript:** Strict mode enabled (`strict`, `noUnusedLocals`, `noUnusedParameters`). Types are co-located with their hooks/components, not in a shared types file.
- **No router:** Single-page app with no routing — all state is local React state.
- **No backend:** No Firebase, no API calls. Data comes from static JSON only.
- **Package manager:** npm locally (not yarn, despite yarn.lock and `packageManager` field). CI workflows use yarn via corepack.
- **Deploy:** Push to `main` triggers GitHub Actions → builds → deploys to `gh-pages` branch.
- **Do not commit/push** after every change unless explicitly asked. Batch changes and wait for instruction to commit.
