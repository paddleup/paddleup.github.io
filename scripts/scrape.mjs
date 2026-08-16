import { load } from 'cheerio';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '..', 'public', 'data', 'leaderboard.json');

// Published "King of the Court League" Google Sheet.
const PUBLISH_ID =
  '2PACX-1vS3d2RVZh7OT4-wHFWvaTe0CnT3eSH-1rwGxLNyBURh8IZLThRAMXx5pd56XF6AURpWm1cDSsuhsQDj';
const BASE = `https://docs.google.com/spreadsheets/d/e/${PUBLISH_ID}/pubhtml`;

// Sheet tab name -> site view slug. Only these tabs are published to the site.
const VIEWS = {
  'Current Month': 'current-month',
  'Past 30 Days': 'past-30-days',
  'All Time': 'all-time',
};

async function fetchHtml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

// Read the published tab menu and map each tab name to its gid.
// Google builds the tab menu with JavaScript, so the mapping lives in a series
// of `items.push({name: "...", ..., gid: "..."})` calls rather than in the DOM.
function parseTabGids(html) {
  const gids = {};
  const re = /items\.push\(\{name:\s*"((?:[^"\\]|\\.)*)"[^}]*?gid:\s*"(\d+)"/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    const name = JSON.parse(`"${match[1]}"`);
    gids[name] = match[2];
  }
  return gids;
}

// Turn a movement cell's text into a structured value.
// "●" / "" => none, "▲5" => up 5, "▼1" => down 1.
function parseMovement(text) {
  const trimmed = (text || '').trim();
  if (trimmed.startsWith('▲')) {
    return { dir: 'up', places: parseInt(trimmed.slice(1), 10) || 0 };
  }
  if (trimmed.startsWith('▼')) {
    return { dir: 'down', places: parseInt(trimmed.slice(1), 10) || 0 };
  }
  return { dir: 'none', places: 0 };
}

// Parse a single ranking tab's HTML table into player rows.
// Columns: Ranking | ● (movement) | Player | Points | # of Events
function parseRankingTable(html) {
  const $ = load(html);
  const players = [];

  $('table tbody tr').each((_, row) => {
    const cells = $(row)
      .find('td')
      .map((_, td) => $(td).text().trim())
      .get();

    if (cells.length < 5) return;

    const [rankText, moveText, name, pointsText, eventsText] = cells;
    const rank = parseInt(rankText, 10);
    const points = parseInt(pointsText, 10);

    // Skip the header row and any empty/padding rows.
    if (!name || isNaN(rank) || isNaN(points)) return;

    players.push({
      rank,
      name,
      points,
      events: parseInt(eventsText, 10) || 0,
      move: parseMovement(moveText),
    });
  });

  return players;
}

async function scrape() {
  console.log('Discovering sheet tabs...');
  const menuHtml = await fetchHtml(BASE);
  const gids = parseTabGids(menuHtml);

  const views = {};
  for (const [tabName, slug] of Object.entries(VIEWS)) {
    const gid = gids[tabName];
    if (!gid) {
      throw new Error(
        `Tab "${tabName}" not found in the published sheet. Available tabs: ${Object.keys(gids).join(', ') || '(none)'}`,
      );
    }

    console.log(`Fetching "${tabName}" (gid=${gid})...`);
    const tabHtml = await fetchHtml(`${BASE}/sheet?gid=${gid}`);
    const players = parseRankingTable(tabHtml);

    if (players.length === 0) {
      throw new Error(`No players parsed from "${tabName}" — sheet layout may have changed`);
    }

    views[slug] = players;
    console.log(`  ${players.length} players`);
  }

  const data = {
    scrapedAt: new Date().toISOString(),
    source: BASE,
    views,
  };

  // No-op if the rankings are unchanged, so the hourly workflow only commits
  // and redeploys when the data actually differs. The scrapedAt timestamp is
  // ignored in this comparison since it changes every run.
  if (existsSync(OUTPUT_PATH)) {
    try {
      const previous = JSON.parse(readFileSync(OUTPUT_PATH, 'utf8'));
      if (JSON.stringify(previous.views) === JSON.stringify(views)) {
        console.log('No change in rankings — leaving leaderboard.json untouched');
        return;
      }
    } catch {
      // Unreadable/corrupt existing file — fall through and overwrite it.
    }
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
  console.log(`Wrote ${OUTPUT_PATH}`);
}

scrape().catch((err) => {
  console.error('Scrape failed:', err);
  process.exit(1);
});
