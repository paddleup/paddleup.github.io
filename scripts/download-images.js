import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLAYERS_FILE = path.join(__dirname, '../src/data/players.json');
const IMAGES_DIR = path.join(__dirname, '../public/images/players');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
};

const main = async () => {
  try {
    const players = JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf8'));
    let updated = false;

    for (const player of players) {
      if (player.url && player.url.startsWith('http')) {
        console.log(`Downloading image for ${player.name}...`);
        // Simple extension extraction, default to .jpg
        let ext = path.extname(player.url).split('?')[0]; 
        if (!ext) ext = '.jpg';
        
        const filename = `${player.id}${ext}`;
        const filepath = path.join(IMAGES_DIR, filename);
        
        try {
          await downloadImage(player.url, filepath);
          player.url = `/images/players/${filename}`;
          updated = true;
          console.log(`Successfully downloaded to ${player.url}`);
        } catch (err) {
          console.error(`Failed to download image for ${player.name}:`, err.message);
        }
      }
    }

    if (updated) {
      fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2));
      console.log('Updated players.json');
    } else {
      console.log('No new images to download.');
    }

  } catch (err) {
    console.error('Error:', err);
  }
};

main();
