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
}
