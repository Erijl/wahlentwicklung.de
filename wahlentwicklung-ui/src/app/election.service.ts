import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';
import { proto } from './protos/objects';
import Election = proto.objects.Election;

let Database: any = require('better-sqlite3');

@Injectable({
  providedIn: 'root',
})
export class ElectionService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  /**
   * Fetches a list of all election years from the database.
   */
  getElectionYears(): Observable<Election[]> {
    if (isPlatformServer(this.platformId) && Database) {
      try {
        const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });

        // Prepare and run the query against your 'election' table
        const stmt = db.prepare('SELECT year FROM election ORDER BY year DESC');
        const elections = stmt.all() as Election[];
        db.close();

        return of(elections);
      } catch (err) {
        console.error('Database query failed on server:', err);
        return of([]);
      }
    }

    // Fallback
    return of([]);
  }

  /**
   * Parties for a specific election year, joined with metadata from party mapping.
   */
  getElectionPartiesByYear(year: number): Observable<Array<{ name: string; seat_count: number; part_of_coalition: boolean; abbreviation?: string | null; color?: string | null }>> {
    if (isPlatformServer(this.platformId) && Database) {
      try {
        const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });
        const stmt = db.prepare(`
          SELECT ep.name,
                 ep.seat_count,
                 ep.part_of_coalition,
                 p.abbreviation,
                 p.color
          FROM election_party ep
          LEFT JOIN party_mapping pm ON pm.election_year = ep.election_year AND pm.column_index = ep.column_index
          LEFT JOIN party p ON p.id = pm.party_id
          WHERE ep.election_year = ?
          ORDER BY ep.seat_count DESC, ep.name ASC
        `);
        const rows = stmt.all(year) as Array<{ name: string; seat_count: number; part_of_coalition: number; abbreviation?: string | null; color?: string | null }>;
        db.close();
        // normalize boolean
        const normalized = rows.map(r => ({ ...r, part_of_coalition: !!r.part_of_coalition }));
        return of(normalized);
      } catch (err) {
        console.error('Database query failed on server:', err);
        return of([]);
      }
    }
    return of([]);
  }

  /**
   * Vote base totals for an election year (secondary vote, definitive), for hero KPIs.
   */
  getElectionVoteBase(year: number): Observable<{ eligible_secondary_definitive: number; actual_secondary_definitive: number; valid_secondary_definitive: number; invalid_secondary_definitive: number } | null> {
    if (isPlatformServer(this.platformId) && Database) {
      try {
        const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });
        const stmt = db.prepare(`
          SELECT 
            eligiblevoters_secondaryvote_definitive AS eligible_secondary_definitive,
            actualvoters_secondaryvote_definitive   AS actual_secondary_definitive,
            validvoters_secondaryvote_definitive    AS valid_secondary_definitive,
            invalidvoters_secondaryvote_definitive  AS invalid_secondary_definitive
          FROM election_vote_base
          WHERE election_year = ?
        `);
        const row = stmt.get(year) as any;
        db.close();
        return of(row || null);
      } catch (err) {
        console.error('Database query failed on server:', err);
        return of(null);
      }
    }
    return of(null);
  }

  /**
   * Party vote counts for a given year (secondary definitive) with metadata.
   */
  getElectionPartyVoteShares(year: number): Observable<Array<{ name: string; abbreviation?: string | null; color?: string | null; votes: number }>> {
    if (isPlatformServer(this.platformId) && Database) {
      try {
        const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });
        const stmt = db.prepare(`
          SELECT ep.name,
                 p.abbreviation,
                 p.color,
                 evp.secondaryvote_definitive AS votes
          FROM election_vote_party evp
          JOIN election_party ep ON ep.election_year = evp.election_year AND ep.column_index = evp.party_id
          LEFT JOIN party_mapping pm ON pm.election_year = ep.election_year AND pm.column_index = ep.column_index
          LEFT JOIN party p ON p.id = pm.party_id
          WHERE evp.election_year = ?
          ORDER BY votes DESC, ep.name ASC
        `);
        const rows = stmt.all(year) as Array<{ name: string; abbreviation?: string | null; color?: string | null; votes: number }>; 
        db.close();
        return of(rows);
      } catch (err) {
        console.error('Database query failed on server:', err);
        return of([]);
      }
    }
    return of([]);
  }

  /** Basic lists (global) */
  getStates(): Observable<Array<{ id: number; name: string }>> {
    if (isPlatformServer(this.platformId) && Database) {
      try {
        const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });
        const rows = db.prepare('SELECT id, name FROM state ORDER BY name').all() as Array<{ id: number; name: string }>;
        db.close();
        return of(rows);
      } catch (err) {
        console.error('Database query failed on server:', err);
        return of([]);
      }
    }
    return of([]);
  }

  getParties(): Observable<Array<{ id: number; name: string; abbreviation?: string | null; color?: string | null }>> {
    if (isPlatformServer(this.platformId) && Database) {
      try {
        const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });
        const rows = db.prepare('SELECT id, name, abbreviation, color FROM party ORDER BY name').all() as Array<{ id: number; name: string; abbreviation?: string | null; color?: string | null }>;
        db.close();
        return of(rows);
      } catch (err) {
        console.error('Database query failed on server:', err);
        return of([]);
      }
    }
    return of([]);
  }

  getConstituencies(): Observable<Array<{ id: number; state_id: number; name: string }>> {
    if (isPlatformServer(this.platformId) && Database) {
      try {
        const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });
        const rows = db.prepare('SELECT id, state_id, name FROM constituency ORDER BY name').all() as Array<{ id: number; state_id: number; name: string }>;
        db.close();
        return of(rows);
      } catch (err) {
        console.error('Database query failed on server:', err);
        return of([]);
      }
    }
    return of([]);
  }

  /** Election-scoped lists */
  getElectionStates(year: number): Observable<Array<{ row_id: number; name: string }>> {
    if (isPlatformServer(this.platformId) && Database) {
      try {
        const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });
        const rows = db.prepare('SELECT row_id, name FROM election_state WHERE election_year = ? ORDER BY name').all(year) as Array<{ row_id: number; name: string }>;
        db.close();
        return of(rows);
      } catch (err) {
        console.error('Database query failed on server:', err);
        return of([]);
      }
    }
    return of([]);
  }

  getElectionConstituencies(year: number): Observable<Array<{ state_row_id: number; name: string }>> {
    if (isPlatformServer(this.platformId) && Database) {
      try {
        const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });
        const rows = db.prepare('SELECT state_id as state_row_id, name FROM election_constituency WHERE election_year = ? ORDER BY name').all(year) as Array<{ state_row_id: number; name: string }>;
        db.close();
        return of(rows);
      } catch (err) {
        console.error('Database query failed on server:', err);
        return of([]);
      }
    }
    return of([]);
  }

  getElectionConstituenciesByStateName(year: number, stateName: string): Observable<Array<{ name: string }>> {
    if (isPlatformServer(this.platformId) && Database) {
      try {
        const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });
        // Find state row_id by exact name for that year
        const state = db.prepare('SELECT row_id FROM election_state WHERE election_year = ? AND name = ?').get(year, stateName) as { row_id: number } | undefined;
        if (!state) {
          db.close();
          return of([]);
        }
        const rows = db.prepare('SELECT name FROM election_constituency WHERE election_year = ? AND state_id = ? ORDER BY name').all(year, state.row_id) as Array<{ name: string }>;
        db.close();
        return of(rows);
      } catch (err) {
        console.error('Database query failed on server:', err);
        return of([]);
      }
    }
    return of([]);
  }
}
