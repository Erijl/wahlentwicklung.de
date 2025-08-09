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
  const rows = db.prepare('SELECT name, row_id FROM election_state WHERE election_year = ? ORDER BY name').all(year);
  db.close();
  return rows.map((r) => ({ name: r.name, row_id: r.row_id }));
}

function getElectionConstituencies(dbPath, year, stateRowId) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  const rows = db
    .prepare('SELECT name FROM election_constituency WHERE election_year = ? AND state_id = ? ORDER BY name')
    .all(year, stateRowId);
  db.close();
  return rows.map((r) => r.name);
}

function getGlobalParties(dbPath) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  const rows = db.prepare('SELECT name, IFNULL(abbreviation, name) AS label FROM party ORDER BY name').all();
  db.close();
  return rows.map((r) => r.label);
}

function getGlobalStates(dbPath) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  const rows = db.prepare('SELECT name FROM state ORDER BY name').all();
  db.close();
  return rows.map((r) => r.name);
}

function getGlobalConstituencies(dbPath) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  const rows = db.prepare('SELECT name FROM constituency ORDER BY name').all();
  db.close();
  return rows.map((r) => r.name);
}

function getYearParties(dbPath, year) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  const rows = db
    .prepare(`
      SELECT IFNULL(p.abbreviation, ep.name) AS label
      FROM election_party ep
      LEFT JOIN party_mapping pm ON pm.election_year = ep.election_year AND pm.column_index = ep.column_index
      LEFT JOIN party p ON p.id = pm.party_id
      WHERE ep.election_year = ?
      GROUP BY label
      ORDER BY label
    `)
    .all(year);
  db.close();
  return rows.map((r) => r.label);
}

function getYearStatePartiesAbove4(dbPath, year, stateRowId) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  const totals = db
    .prepare('SELECT SUM(secondaryvote_definitive) AS total FROM state_vote_party WHERE election_year = ? AND state_id = ?')
    .get(year, stateRowId);
  const total = totals?.total || 0;
  if (!total) {
    db.close();
    return [];
  }
  const rows = db
    .prepare(`
      SELECT IFNULL(p.abbreviation, ep.name) AS label,
             svp.secondaryvote_definitive * 1.0 / ? * 100 AS pct
      FROM state_vote_party svp
      JOIN election_party ep ON ep.election_year = svp.election_year AND ep.column_index = svp.party_id
      LEFT JOIN party_mapping pm ON pm.election_year = ep.election_year AND pm.column_index = ep.column_index
      LEFT JOIN party p ON p.id = pm.party_id
      WHERE svp.election_year = ? AND svp.state_id = ?
      ORDER BY pct DESC
    `)
    .all(total, year, stateRowId);
  db.close();
  return rows.filter((r) => r.pct >= 4).map((r) => r.label);
}

function getYearConstituencyPartiesAbove4(dbPath, year, stateRowId, constituencyName) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  const cons = db
    .prepare('SELECT row_id FROM election_constituency WHERE election_year = ? AND state_id = ? AND name = ?')
    .get(year, stateRowId, constituencyName);
  if (!cons) {
    db.close();
    return [];
  }
  const totals = db
    .prepare(
      'SELECT SUM(secondaryvote_definitive) AS total FROM constituency_vote_party WHERE election_year = ? AND state_id = ? AND constituency_id = ?',
    )
    .get(year, stateRowId, cons.row_id);
  const total = totals?.total || 0;
  if (!total) {
    db.close();
    return [];
  }
  const rows = db
    .prepare(`
      SELECT IFNULL(p.abbreviation, ep.name) AS label,
             cvp.secondaryvote_definitive * 1.0 / ? * 100 AS pct
      FROM constituency_vote_party cvp
      JOIN election_party ep ON ep.election_year = cvp.election_year AND ep.column_index = cvp.party_id
      LEFT JOIN party_mapping pm ON pm.election_year = ep.election_year AND pm.column_index = ep.column_index
      LEFT JOIN party p ON p.id = pm.party_id
      WHERE cvp.election_year = ? AND cvp.state_id = ? AND cvp.constituency_id = ?
      ORDER BY pct DESC
    `)
    .all(total, year, stateRowId, cons.row_id);
  db.close();
  return rows.filter((r) => r.pct >= 4).map((r) => r.label);
}

function generateRoutes(dbPath, years) {
  const routes = new Set(['/', '/elections', '/states', '/parties', '/constituencies']);

  // Global development endpoints
  getGlobalParties(dbPath).forEach((p) => routes.add(`/party/${encodeURIComponent(p)}`));
  getGlobalStates(dbPath).forEach((s) => routes.add(`/state/${encodeURIComponent(s)}`));
  getGlobalConstituencies(dbPath).forEach((c) => routes.add(`/constituency/${encodeURIComponent(c)}`));

  for (const y of years) {
    routes.add(`/election/${y}`);
    routes.add(`/election/${y}/states`);
    routes.add(`/election/${y}/constituencies`);

    // Year-level party one-stat
    getYearParties(dbPath, y).forEach((p) => routes.add(`/election/${y}/party/${encodeURIComponent(p)}`));

    const states = getElectionStates(dbPath, y);
    for (const s of states) {
      const sName = encodeURIComponent(s.name);
      routes.add(`/election/${y}/${sName}`);
      routes.add(`/election/${y}/${sName}/constituencies`);

      // State-level party one-stat for parties >=4%
      getYearStatePartiesAbove4(dbPath, y, s.row_id).forEach((p) =>
        routes.add(`/election/${y}/${sName}/party/${encodeURIComponent(p)}`),
      );

      const constituencies = getElectionConstituencies(dbPath, y, s.row_id);
      for (const c of constituencies) {
        const cName = encodeURIComponent(c);
        routes.add(`/election/${y}/${sName}/${cName}`);

        // Constituency-level party one-stat for parties >=4%
        getYearConstituencyPartiesAbove4(dbPath, y, s.row_id, c).forEach((p) =>
          routes.add(`/election/${y}/${sName}/${cName}/party/${encodeURIComponent(p)}`),
        );
      }
    }
  }

  return Array.from(routes).join('\n') + '\n';
}

try {
  const dbPath = resolve(projectRoot, 'db', 'wahlentwicklung.db');
  const years = getElectionYears(dbPath);
  const content = generateRoutes(dbPath, years);
  const routesFile = resolve(projectRoot, 'routes.txt');
  writeFileSync(routesFile, content, 'utf-8');
  const count = content.trim().split('\n').length;
  console.log(`Generated ${count} routes across ${years.length} elections to routes.txt`);
} catch (err) {
  console.error('Failed to generate prerender routes:', err);
  // Still write default minimal routes so build doesn't fail.
  const fallback = ['/', '/elections', '/states', '/parties', '/constituencies'].join('\n') + '\n';
  const routesFile = resolve(projectRoot, 'routes.txt');
  writeFileSync(routesFile, fallback, 'utf-8');
  process.exitCode = 0;
}

