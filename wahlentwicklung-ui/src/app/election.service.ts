import { Injectable, Inject, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';
import { proto } from './protos/objects';
import Election = proto.objects.Election;
import ElectionState = proto.objects.ElectionState;

type Database = import('better-sqlite3').Database;

export interface EnrichedState {
  name: string;
  turnout: number;
  topParties: Array<{ label: string; pct: number; color:string }>;
}

const getEnrichedStatesKey = (year: number) => makeStateKey<EnrichedState[]>(`enriched_states_${year}`);

@Injectable({
  providedIn: 'root',
})
export class ElectionService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private transferState: TransferState
  ) {}

  /**
   * Fetches a list of all election years from the database.
   */
  getElectionYears(): Observable<Election[]> {
    if (isPlatformServer(this.platformId)) {
      try {
        const Database = require('better-sqlite3');
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
    if (isPlatformServer(this.platformId)) {
      try {
        const Database = require('better-sqlite3');
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
    if (isPlatformServer(this.platformId)) {
      try {
        const Database = require('better-sqlite3');
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
    if (isPlatformServer(this.platformId)) {
      try {
        const Database = require('better-sqlite3');
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
    if (isPlatformServer(this.platformId)) {
      try {
        const Database = require('better-sqlite3');
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
    if (isPlatformServer(this.platformId)) {
      try {
        const Database = require('better-sqlite3');
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
    if (isPlatformServer(this.platformId)) {
      try {
        const Database = require('better-sqlite3');
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
    if (isPlatformServer(this.platformId)) {
      try {
        const Database = require('better-sqlite3');
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
    if (isPlatformServer(this.platformId)) {
      try {
        const Database = require('better-sqlite3');
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
    if (isPlatformServer(this.platformId)) {
      try {
        const Database = require('better-sqlite3');
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

  getEnrichedStates(year: number): Observable<EnrichedState[]> {
    const STATE_KEY = getEnrichedStatesKey(year);

    if (this.transferState.hasKey(STATE_KEY)) {
      const states = this.transferState.get<EnrichedState[]>(STATE_KEY, []);
      //this.transferState.remove(STATE_KEY); //TODO check whether this makes sense when deployed - implement a deleteInProduction function for the whole file.
      return of(states);
    }

    if (isPlatformServer(this.platformId)) {
      try {
        const Database = require('better-sqlite3');
        const db = new Database('db/wahlentwicklung.db', { readonly: true, fileMustExist: true });

        const states = db.prepare('SELECT row_id, name FROM election_state WHERE election_year = ?').all(year) as ElectionState[];

        const enrichedStates = states.map(state => {
          const base = db.prepare('SELECT actualvoters_secondaryvote_definitive AS actual, eligiblevoters_secondaryvote_definitive AS eligible FROM state_vote_base WHERE election_year = ? AND state_id = ?').get(year, state.row_id) as { actual: number; eligible: number } | undefined;
          const turnout = (!base || !base.eligible) ? 0 : (base.actual / base.eligible) * 100;

          const totalRow = db.prepare('SELECT SUM(secondaryvote_definitive) AS total FROM state_vote_party WHERE election_year = ? AND state_id = ?').get(year, state.row_id) as { total: number } | undefined;
          const totalVotes = totalRow?.total || 0;
          let topParties: EnrichedState['topParties'] = [];
          if (totalVotes > 0) {
            const partyRows = db.prepare(`
                        SELECT IFNULL(p.abbreviation, ep.name) AS label,
                               IFNULL('#' || p.color, '#60a5fa') AS color,
                               svp.secondaryvote_definitive * 1.0 / ? * 100 AS pct
                        FROM state_vote_party svp
                        JOIN election_party ep ON ep.election_year = svp.election_year AND ep.column_index = svp.party_id
                        LEFT JOIN party_mapping pm ON pm.election_year = ep.election_year AND pm.column_index = ep.column_index
                        LEFT JOIN party p ON p.id = pm.party_id
                        WHERE svp.election_year = ? AND svp.state_id = ?
                        ORDER BY pct DESC
                    `).all(totalVotes, year, state.row_id) as Array<{ label: string; color: string; pct: number }>;
            topParties = partyRows.filter(r => r.pct >= 4).map(r => ({ label: r.label, pct: r.pct, color: r.color }));
          }

          return { name: state.name, turnout, topParties };
        });

        db.close();

        this.transferState.set(STATE_KEY, enrichedStates);
        return of(enrichedStates);

      } catch (err) {
        console.error('Database query failed on server:', err);
        return of([]);
      }
    }

    return of([]);
  }
}
