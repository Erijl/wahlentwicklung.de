import Database from 'better-sqlite3';
import path from 'node:path';

/** Build-time, read-only handle on the importer-produced SQLite DB.
 *  Only ever used during `astro build`/`astro dev` — nothing DB-related
 *  ships to the client (docs/02-concept.md §1). */
const DB_PATH =
  process.env.WAHL_DB_PATH ?? path.resolve(process.cwd(), '..', 'wahlentwicklung.db');

let db: Database.Database | undefined;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  }
  return db;
}

/** Statement cache — thousands of pages reuse the same handful of queries;
 *  preparing once instead of per call cuts build time noticeably. */
const stmts = new Map<string, Database.Statement>();

export function prepare(sql: string): Database.Statement {
  let s = stmts.get(sql);
  if (!s) {
    s = getDb().prepare(sql);
    stmts.set(sql, s);
  }
  return s;
}
