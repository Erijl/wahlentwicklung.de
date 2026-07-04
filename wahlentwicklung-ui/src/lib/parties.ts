/**
 * Canonical display-party logic. Party colors are entity-owned
 * (docs/03-design-system.md §2); actual hex values live in
 * styles/tokens.css so charts follow the active theme — components
 * reference `colorVar`, never raw hex.
 */

export type PartyKey =
  | 'Union'
  | 'AfD'
  | 'SPD'
  | 'Grüne'
  | 'Linke'
  | 'BSW'
  | 'FDP'
  | 'FW'
  | 'SSW'
  | 'Übrige';

const CSS_VAR: Record<PartyKey, string> = {
  Union: 'var(--party-union)',
  AfD: 'var(--party-afd)',
  SPD: 'var(--party-spd)',
  Grüne: 'var(--party-gruene)',
  Linke: 'var(--party-linke)',
  BSW: 'var(--party-bsw)',
  FDP: 'var(--party-fdp)',
  FW: 'var(--party-fw)',
  SSW: 'var(--party-ssw)',
  Übrige: 'var(--party-uebrige)',
};

export function colorVar(key: string): string {
  return CSS_VAR[key as PartyKey] ?? CSS_VAR['Übrige'];
}

/** Party color for *text* (table values). Same as the mark color except
 *  where that fails text contrast (FDP yellow → darker text step). */
export function textColorVar(key: string): string {
  if (key === 'FDP') return 'var(--party-fdp-text)';
  return colorVar(key);
}

/** Bundestag seating, left → right. */
export const SEATING_ORDER: PartyKey[] = ['Linke', 'SPD', 'Grüne', 'SSW', 'Union', 'AfD'];

/** Fixed chart order = identity anchor (color follows entity, never rank). */
export const CHART_ORDER: PartyKey[] = [
  'Union',
  'AfD',
  'SPD',
  'Grüne',
  'Linke',
  'BSW',
  'FDP',
  'FW',
  'SSW',
  'Übrige',
];

/**
 * Map a raw election_party row (canonical abbreviation if mapped, else the
 * per-election name) onto a display party. CDU+CSU merge into "Union" in
 * charts (split only in tables). Unmapped micro-parties fold into "Übrige".
 * BSW/SSW name-matching bridges the still-open mapping work (audit §2) —
 * remove once party_mapping is complete.
 */
export function canonParty(name: string | null, abbreviation: string | null): PartyKey {
  if (abbreviation === 'CDU' || abbreviation === 'CSU') return 'Union';
  if (abbreviation && abbreviation in CSS_VAR) return abbreviation as PartyKey;
  const n = (name ?? '').toLowerCase();
  if (n.includes('wagenknecht')) return 'BSW';
  if (n.includes('südschleswig')) return 'SSW';
  if (n.includes('freie wähler')) return 'FW';
  return 'Übrige';
}

export function sortByChartOrder<T extends { key: PartyKey }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => CHART_ORDER.indexOf(a.key) - CHART_ORDER.indexOf(b.key));
}
