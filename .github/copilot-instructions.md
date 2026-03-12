# Copilot Instructions for paddleup.github.io

## Build & Run

```bash
npm run dev        # Vite dev server at localhost:5173
npm run build      # Production build to dist/
npm run scrape     # Fetch latest leaderboard data from QuickScores → public/data/leaderboard.json
npm run lint       # ESLint
npm run lint:fix   # ESLint auto-fix
npm run format     # Prettier (src/**/*.{ts,tsx,js,jsx,json,md})
```

Run `npm run scrape` before `npm run dev` if `public/data/leaderboard.json` doesn't exist yet. There is no test framework or test suite.

## Architecture

This is a **static React SPA** (React 19, Vite 7, TypeScript) deployed to GitHub Pages that displays pickleball club leaderboard standings.

**Data pipeline:** A Node.js scraper (`scripts/scrape.mjs`) fetches HTML from QuickScores, parses the standings table with cheerio, and writes `public/data/leaderboard.json`. A GitHub Actions workflow (`scrape.yml`) runs this daily and commits the updated JSON. The React app fetches this static JSON at runtime — there is no backend or API.

**Player name convention:** Players are categorized by **name suffixes** in the QuickScores source data, not by a separate config file. The `useLeaderboard` hook parses names with the regex `/^(.+?)\s+-\s+(M|F)(?:\s+(50|60))?$/`:
- `"Kevin Reque - M"` → Men's Overall
- `"Jane Doe - F 50"` → Women's 50+ (cascades to Women's Overall)
- `"John Smith - M 60"` → Men's 60+ (cascades to 50+ and Overall)
- `"Some Player"` (no suffix) → Unclassified

**Category cascading:** A player tagged 60+ automatically appears in 50+ and Overall. A player tagged 50+ automatically appears in Overall. The `CategorySlug` type defines: `'overall' | 'mens-overall' | 'womens-overall' | 'mens-50' | 'womens-50' | 'mens-60' | 'womens-60' | 'unclassified'`. Only players with `points > 0` are shown.

**Theme system:** `useTheme` hook manages light/dark/system modes via a `dark` class on `<html>` and persists to localStorage. Default is light. Toggle cycles: system → light → dark → system.

**Admin mode:** Append `?admin` to the URL to enable admin features (e.g., viewing unclassified players). Controlled by `useAdmin` hook.

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
