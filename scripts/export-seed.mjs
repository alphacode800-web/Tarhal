import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'server', 'data');
const seedDir = path.join(root, 'server', 'seed');

const files = [
  'countries.json',
  'offers.json',
  'hotels.json',
  'car-rentals.json',
  'taxi-delivery.json',
  'offices.json',
  'flight-tickets.json',
  'travel-visas.json',
];

await fs.mkdir(seedDir, { recursive: true });

for (const file of files) {
  const source = path.join(sourceDir, file);
  const target = path.join(seedDir, file);
  try {
    const raw = await fs.readFile(source, 'utf-8');
    JSON.parse(raw);
    await fs.copyFile(source, target);
    console.log(`seed: ${file}`);
  } catch (error) {
    console.warn(`seed skip ${file}:`, error.message);
  }
}

console.log('Seed export complete.');
