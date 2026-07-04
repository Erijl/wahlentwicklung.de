/**
 * All SQL lives here; pages/components consume typed results only.
 *
 * Data-model notes (docs/01-data-audit.md):
 * - `*_previous` columns carry the previous election's *restated* values
 *   ("Vorperiode") — deltas come for free, no self-joins.
 * - Vote tables key parties by `election_party.column_index`; canonical
 *   identity always goes through `party_mapping` (join, then canonParty()).
 * - `constituency.state_id` stores raw 9xx row-ids; normalize with -900.
 * - Seat corrections (SSW 2021/2025, FDP 2021) live in the importer's
 *   update_mappings.sql since 2026-07-04 — no query-time bridges anymore.
 */
import { prepare } from './db';
import { canonParty, sortByChartOrder, type PartyKey } from './parties';

export interface PartyResult {
  key: PartyKey;
  votes: number;
  pct: number;
  prevPct: number | null;
  seats: number;
}

export interface VoteBase {
  eligible: number;
  actual: number;
  valid: number;
  turnout: number;
  prevTurnout: number;
}

export interface StateRow {
  id: number;
  name: string;
}

export interface ConstituencyRow {
  /** Canonical DB key (constituency.id) - internal only, never displayed. */
  id: number;
  /** Official Wahlkreis number of the LATEST election this district was
   *  mapped in - the stable URL/display number. Per-year numbers shift
   *  (Bergstrasse: 189->188->187); use officialNumber() for a given year. */
  number: number;
  name: string;
  stateId: number;
  stateName: string;
}

// ---------------------------------------------------------------- basics

export function getElectionYears(): number[] {
  return prepare('SELECT year FROM election ORDER BY year')
    .all()
    .map((r: any) => r.year);
}

export function latestElectionYear(): number {
  return getElectionYears().at(-1)!;
}

export function getStates(): StateRow[] {
  return prepare('SELECT id, name FROM state ORDER BY id').all() as StateRow[];
}

export function getConstituencies(): ConstituencyRow[] {
  return prepare(
      `SELECT c.id AS id,
              (SELECT cm.row_id FROM constituency_mapping cm
                WHERE cm.constituency_id = c.id
                ORDER BY cm.election_year DESC LIMIT 1) AS number,
              c.name, c.state_id - 900 AS stateId, s.name AS stateName
       FROM constituency c JOIN state s ON s.id = c.state_id - 900
       ORDER BY number`,
    )
    .all() as ConstituencyRow[];
}

/** Official Wahlkreis number of one district in one election year
 *  (numbers shift between elections), or null if not mapped that year. */
export function officialNumber(year: number, id: number): number | null {
  const r = prepare(
    `SELECT row_id AS n FROM constituency_mapping WHERE election_year = ? AND constituency_id = ?`,
  ).get(year, id) as any;
  return r?.n ?? null;
}

export function getPartiesWithAbbreviation(): { id: number; name: string; abbreviation: string }[] {
  return prepare(
      `SELECT id, name, abbreviation FROM party
       WHERE abbreviation != '' AND abbreviation != 'Übrige' ORDER BY id`,
    )
    .all() as any[];
}

// ---------------------------------------------------------------- vote bases

function toVoteBase(row: any): VoteBase {
  return {
    eligible: row.elig,
    actual: row.act,
    valid: row.valid,
    turnout: (100 * row.act) / row.elig,
    prevTurnout: row.elig_prev > 0 ? (100 * row.act_prev) / row.elig_prev : 0,
  };
}

export function federalVoteBase(year: number): VoteBase {
  const row = prepare(
      `SELECT eligiblevoters_secondaryvote_definitive AS elig,
              actualvoters_secondaryvote_definitive AS act,
              validvoters_secondaryvote_definitive AS valid,
              eligiblevoters_secondaryvote_previous AS elig_prev,
              actualvoters_secondaryvote_previous AS act_prev
       FROM election_vote_base WHERE election_year = ?`,
    )
    .get(year);
  return toVoteBase(row);
}

export function stateVoteBase(year: number, stateId: number): VoteBase | null {
  const row = prepare(
      `SELECT b.eligiblevoters_secondaryvote_definitive AS elig,
              b.actualvoters_secondaryvote_definitive AS act,
              b.validvoters_secondaryvote_definitive AS valid,
              b.eligiblevoters_secondaryvote_previous AS elig_prev,
              b.actualvoters_secondaryvote_previous AS act_prev
       FROM state_vote_base b
       JOIN state_mapping sm ON sm.election_year = b.election_year AND sm.row_id = b.state_id
       WHERE b.election_year = ? AND sm.state_id = ?`,
    )
    .get(year, stateId);
  return row ? toVoteBase(row) : null;
}

export type VoteType = 'secondary' | 'primary';

export function constituencyVoteBase(
  year: number,
  num: number,
  vote: VoteType = 'secondary',
): VoteBase | null {
  const v = vote === 'primary' ? 'primaryvote' : 'secondaryvote';
  const row = prepare(
      `SELECT b.eligiblevoters_${v}_definitive AS elig,
              b.actualvoters_${v}_definitive AS act,
              b.validvoters_${v}_definitive AS valid,
              b.eligiblevoters_${v}_previous AS elig_prev,
              b.actualvoters_${v}_previous AS act_prev
       FROM constituency_vote_base b
       JOIN constituency_mapping cm ON cm.election_year = b.election_year
            AND cm.election_state_id = b.state_id AND cm.row_id = b.constituency_id
       WHERE b.election_year = ? AND cm.constituency_id = ?`,
    )
    .get(year, num);
  return row ? toVoteBase(row) : null;
}

// ---------------------------------------------------------------- results

/** Aggregate raw per-election party rows onto display parties. */
function aggregate(
  rows: { abbr: string | null; pname: string | null; epname: string; votes: number; prev: number; seats?: number }[],
  valid: number,
  prevValid: number,
): PartyResult[] {
  const agg = new Map<PartyKey, { votes: number; prev: number; seats: number }>();
  for (const r of rows) {
    const key = canonParty(r.pname ?? r.epname, r.abbr);
    const a = agg.get(key) ?? { votes: 0, prev: 0, seats: 0 };
    a.votes += r.votes;
    a.prev += r.prev;
    a.seats += r.seats ?? 0;
    agg.set(key, a);
  }
  return sortByChartOrder(
    [...agg.entries()].map(([key, a]) => ({
      key,
      votes: a.votes,
      pct: (100 * a.votes) / valid,
      prevPct: prevValid > 0 && a.prev > 0 ? (100 * a.prev) / prevValid : null,
      seats: a.seats,
    })),
  );
}

export function federalResults(year: number): PartyResult[] {
  const base = federalVoteBase(year);
  const prevValid = prepare(
      `SELECT validvoters_secondaryvote_previous AS v FROM election_vote_base WHERE election_year = ?`,
    )
    .get(year) as any;
  const rows = prepare(
      `SELECT p.abbreviation AS abbr, p.name AS pname, ep.name AS epname,
              ep.seat_count AS seats,
              evp.secondaryvote_definitive AS votes, evp.secondaryvote_previous AS prev
       FROM election_vote_party evp
       JOIN election_party ep ON ep.election_year = evp.election_year
            AND ep.column_index = evp.party_id
       LEFT JOIN party_mapping pm ON pm.election_year = evp.election_year
            AND pm.column_index = evp.party_id
       LEFT JOIN party p ON p.id = pm.party_id
       WHERE evp.election_year = ?`,
    )
    .all(year) as any[];
  return aggregate(rows, base.valid, prevValid?.v ?? 0);
}

export function stateResults(year: number, stateId: number): PartyResult[] {
  const base = stateVoteBase(year, stateId);
  if (!base) return [];
  const prev = prepare(
      `SELECT b.validvoters_secondaryvote_previous AS v
       FROM state_vote_base b
       JOIN state_mapping sm ON sm.election_year = b.election_year AND sm.row_id = b.state_id
       WHERE b.election_year = ? AND sm.state_id = ?`,
    )
    .get(year, stateId) as any;
  const rows = prepare(
      `SELECT p.abbreviation AS abbr, p.name AS pname, ep.name AS epname,
              svp.secondaryvote_definitive AS votes, svp.secondaryvote_previous AS prev
       FROM state_vote_party svp
       JOIN state_mapping sm ON sm.election_year = svp.election_year AND sm.row_id = svp.state_id
       JOIN election_party ep ON ep.election_year = svp.election_year
            AND ep.column_index = svp.party_id
       LEFT JOIN party_mapping pm ON pm.election_year = svp.election_year
            AND pm.column_index = svp.party_id
       LEFT JOIN party p ON p.id = pm.party_id
       WHERE svp.election_year = ? AND sm.state_id = ?`,
    )
    .all(year, stateId) as any[];
  return aggregate(rows, base.valid, prev?.v ?? 0);
}

export function constituencyResults(
  year: number,
  num: number,
  vote: VoteType = 'secondary',
): PartyResult[] {
  const v = vote === 'primary' ? 'primaryvote' : 'secondaryvote';
  const base = constituencyVoteBase(year, num, vote);
  if (!base) return [];
  const prev = prepare(
      `SELECT b.validvoters_${v}_previous AS v
       FROM constituency_vote_base b
       JOIN constituency_mapping cm ON cm.election_year = b.election_year
            AND cm.election_state_id = b.state_id AND cm.row_id = b.constituency_id
       WHERE b.election_year = ? AND cm.constituency_id = ?`,
    )
    .get(year, num) as any;
  const rows = prepare(
      `SELECT p.abbreviation AS abbr, p.name AS pname, ep.name AS epname,
              cvp.${v}_definitive AS votes, cvp.${v}_previous AS prev
       FROM constituency_vote_party cvp
       JOIN constituency_mapping cm ON cm.election_year = cvp.election_year
            AND cm.election_state_id = cvp.state_id AND cm.row_id = cvp.constituency_id
       JOIN election_party ep ON ep.election_year = cvp.election_year
            AND ep.column_index = cvp.party_id
       LEFT JOIN party_mapping pm ON pm.election_year = cvp.election_year
            AND pm.column_index = cvp.party_id
       LEFT JOIN party p ON p.id = pm.party_id
       WHERE cvp.election_year = ? AND cm.constituency_id = ?`,
    )
    .all(year, num) as any[];
  return aggregate(rows, base.valid, prev?.v ?? 0);
}

// ---------------------------------------------------------------- development

export interface TrendPoint {
  year: number;
  pct: number;
}

/** Federal share per display party across all elections (line charts). */
export function federalTrends(keys: PartyKey[]): Map<PartyKey, TrendPoint[]> {
  const out = new Map<PartyKey, TrendPoint[]>();
  for (const year of getElectionYears()) {
    for (const r of federalResults(year)) {
      if (!keys.includes(r.key)) continue;
      const arr = out.get(r.key) ?? [];
      arr.push({ year, pct: r.pct });
      out.set(r.key, arr);
    }
  }
  return out;
}

export function stateTrends(stateId: number, keys: PartyKey[]): Map<PartyKey, TrendPoint[]> {
  const out = new Map<PartyKey, TrendPoint[]>();
  for (const year of getElectionYears()) {
    for (const r of stateResults(year, stateId)) {
      if (!keys.includes(r.key)) continue;
      const arr = out.get(r.key) ?? [];
      arr.push({ year, pct: r.pct });
      out.set(r.key, arr);
    }
  }
  return out;
}

export function constituencyTrends(num: number, keys: PartyKey[]): Map<PartyKey, TrendPoint[]> {
  const out = new Map<PartyKey, TrendPoint[]>();
  for (const year of getElectionYears()) {
    for (const r of constituencyResults(year, num)) {
      if (!keys.includes(r.key)) continue;
      const arr = out.get(r.key) ?? [];
      arr.push({ year, pct: r.pct });
      out.set(r.key, arr);
    }
  }
  return out;
}

/** Which elections have data for this constituency (mapping gaps → holes). */
export function constituencyYears(num: number): number[] {
  return prepare(
      `SELECT election_year AS y FROM constituency_mapping
       WHERE constituency_id = ? ORDER BY election_year`,
    )
    .all(num)
    .map((r: any) => r.y);
}

// ---------------------------------------------------------------- map & tables

/** Strongest display party per state for one election. */
export function stateWinners(year: number): Map<string, { key: PartyKey; pct: number }> {
  const out = new Map<string, { key: PartyKey; pct: number }>();
  for (const s of getStates()) {
    const results = stateResults(year, s.id);
    if (results.length === 0) continue;
    const top = [...results].sort((a, b) => b.votes - a.votes)[0];
    out.set(s.name, { key: top.key, pct: top.pct });
  }
  return out;
}

export interface ConstituencyTableRow {
  id: number;
  /** latest official number (stable slug key) */
  number: number;
  name: string;
  stateName: string;
  turnout: number;
  results: PartyResult[];
}

/** All constituencies of an election with per-party shares (dense table). */
export function constituencyTable(
  year: number,
  vote: VoteType = 'secondary',
  limit?: number,
): ConstituencyTableRow[] {
  const rows = prepare(
      `SELECT cm.constituency_id AS id,
              (SELECT cm2.row_id FROM constituency_mapping cm2
                WHERE cm2.constituency_id = cm.constituency_id
                ORDER BY cm2.election_year DESC LIMIT 1) AS number,
              c.name, s.name AS stateName,
              100.0 * b.actualvoters_secondaryvote_definitive
                    / b.eligiblevoters_secondaryvote_definitive AS turnout
       FROM constituency_vote_base b
       JOIN constituency_mapping cm ON cm.election_year = b.election_year
            AND cm.election_state_id = b.state_id AND cm.row_id = b.constituency_id
       JOIN constituency c ON c.id = cm.constituency_id
       JOIN state s ON s.id = c.state_id - 900
       WHERE b.election_year = ? AND cm.constituency_id IS NOT NULL
       ORDER BY turnout DESC ${limit ? 'LIMIT ' + limit : ''}`,
    )
    .all(year) as any[];
  return rows.map((r) => ({
    ...r,
    results: constituencyResults(year, r.id, vote),
  }));
}

/** Share of one canonical party per election year (party pages — uses the
 *  party's own mapping, no Union merge). Years without a mapping are absent. */
export function partyTrend(partyId: number): TrendPoint[] {
  return prepare(
      `SELECT evp.election_year AS year,
              100.0 * evp.secondaryvote_definitive
                    / evb.validvoters_secondaryvote_definitive AS pct
       FROM election_vote_party evp
       JOIN party_mapping pm ON pm.election_year = evp.election_year
            AND pm.column_index = evp.party_id
       JOIN election_vote_base evb ON evb.election_year = evp.election_year
       WHERE pm.party_id = ?
       ORDER BY evp.election_year`,
    )
    .all(partyId) as TrendPoint[];
}

/** Seats of one canonical party per election year. */
export function partySeats(partyId: number): { year: number; seats: number }[] {
  return prepare(
      `SELECT ep.election_year AS year, ep.seat_count AS seats
       FROM election_party ep
       JOIN party_mapping pm ON pm.election_year = ep.election_year
            AND pm.column_index = ep.column_index
       WHERE pm.party_id = ?
       ORDER BY ep.election_year`,
    )
    .all(partyId) as any[];
}

/** Highest-turnout state of an election (fun facts). */
export function stateTurnouts(year: number): { name: string; turnout: number }[] {
  return prepare(
      `SELECT es.name,
              100.0 * b.actualvoters_secondaryvote_definitive
                    / b.eligiblevoters_secondaryvote_definitive AS turnout
       FROM state_vote_base b
       JOIN election_state es ON es.election_year = b.election_year AND es.row_id = b.state_id
       WHERE b.election_year = ?
       ORDER BY turnout DESC`,
    )
    .all(year) as any[];
}
