import { load } from 'cheerio';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '..', 'public', 'data', 'leaderboard.json');
const URL = 'https://www.quickscores.com/Orgs/ResultsDisplay.php?OrgDir=pupc&LeagueID=1620825';

async function scrape() {
  console.log('Fetching leaderboard from QuickScores...');
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

  const html = await res.text();
  const $ = load(html);
  const players = [];

  $('table.standings-module tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length < 4) return;

    const nameEl = $(cells[0]).find('a');
    if (!nameEl.length) return;

    const name = nameEl.text().trim();
    const points = parseInt($(cells[3]).text().trim(), 10);

    if (name && !isNaN(points)) {
      players.push({ name, points });
    }
  });

  if (players.length === 0) {
    throw new Error('No players found — page structure may have changed');
  }

  // Sort by points descending
  players.sort((a, b) => b.points - a.points);

  const data = {
    scrapedAt: new Date().toISOString(),
    source: URL,
    players,
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
  console.log(`Wrote ${players.length} players to ${OUTPUT_PATH}`);
}

scrape().catch((err) => {
  console.error('Scrape failed:', err);
  process.exit(1);
});
