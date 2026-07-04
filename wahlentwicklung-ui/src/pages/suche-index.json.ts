/**
 * Static search index for the command palette (SearchPalette.astro):
 * every election, top-level page, party, state and constituency as
 * {n: name, t: badge, h: href, k?: keywords}. Prerendered at build time;
 * order matters — it is the empty-query default and the tie-breaker.
 */
import type { APIRoute } from 'astro';
import {
  getElectionYears,
  getStates,
  getConstituencies,
  getPartiesWithAbbreviation,
} from '@/lib/queries';
import { slugify, constituencySlug, partySlug } from '@/lib/slugs';

export const GET: APIRoute = () => {
  const years = [...getElectionYears()].reverse();
  const entries = [
    ...years.map((y) => ({ n: `Bundestagswahl ${y}`, t: 'Wahl', h: `/wahl/${y}` })),
    { n: 'Alle Wahlen im Überblick', t: 'Seite', h: '/wahlen' },
    { n: 'Alle Parteien', t: 'Seite', h: '/parteien' },
    { n: 'Alle Bundesländer', t: 'Seite', h: '/bundeslaender' },
    { n: 'Alle 299 Wahlkreise', t: 'Seite', h: '/wahlkreise' },
    ...getPartiesWithAbbreviation().map((p) => ({
      n: `${p.abbreviation} – Entwicklung`,
      t: 'Partei',
      h: `/partei/${partySlug(p.abbreviation)}`,
      k: p.name,
    })),
    ...getStates().map((s) => ({ n: s.name, t: 'Land', h: `/bundesland/${slugify(s.name)}` })),
    ...getConstituencies().map((c) => ({
      n: `Wahlkreis ${c.number} ${c.name}`,
      t: 'Wahlkreis',
      h: `/wahlkreis/${constituencySlug(c.number, c.name)}`,
      k: c.stateName,
    })),
  ];
  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
