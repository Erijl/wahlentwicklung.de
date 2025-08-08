import Database from 'better-sqlite3';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

function getElectionYears(dbPath) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  const rows = db.prepare('SELECT year FROM election ORDER BY year DESC').all();
  db.close();
  return rows.map((r) => r.year);
}

function getElectionStates(dbPath, year) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  const rows = db.prepare('SELECT name FROM election_state WHERE election_year = ? ORDER BY name').all(year);
  db.close();
  return rows.map((r) => r.name);
}

function generateRoutes(dbPath, years) {
  const staticRoutes = ['/', '/elections', '/states', '/parties', '/constituencies'];
  const yearRoutes = years.map((y) => `/election/${y}`);
  const perYearStateRoutes = years.flatMap((y) => getElectionStates(dbPath, y).map((name) => `/election/${y}/${encodeURIComponent(name)}/constituencies`));
  return [...new Set([...staticRoutes, ...yearRoutes, ...perYearStateRoutes])].join('\n') + '\n';
}

try {
  const dbPath = resolve(projectRoot, 'db', 'wahlentwicklung.db');
  const years = getElectionYears(dbPath);
  const content = generateRoutes(dbPath, years);
  const routesFile = resolve(projectRoot, 'routes.txt');
  writeFileSync(routesFile, content, 'utf-8');
  console.log(`Generated ${years.length} election routes to routes.txt`);
} catch (err) {
  console.error('Failed to generate prerender routes:', err);
  // Still write default minimal routes so build doesn't fail.
  const fallback = ['/', '/elections', '/states', '/parties', '/constituencies'].join('\n') + '\n';
  const routesFile = resolve(projectRoot, 'routes.txt');
  writeFileSync(routesFile, fallback, 'utf-8');
  process.exitCode = 0;
}


