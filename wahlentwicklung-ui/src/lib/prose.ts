/**
 * Generated summary sentences — the crawlable, information-dense first
 * paragraph every page opens with (docs/02-concept.md §4). German only in
 * v0.1; the /en/ mirror adds a second template set.
 */
import { fmtPct, fmtDelta } from './format';
import type { PartyResult, VoteBase } from './queries';

function ranked(results: PartyResult[]): PartyResult[] {
  return [...results].filter((r) => r.key !== 'Übrige').sort((a, b) => b.votes - a.votes);
}

export function electionLede(year: number, results: PartyResult[], base: VoteBase): string {
  const [first, second] = ranked(results);
  const parts = [
    `Die ${first.key === 'Union' ? 'Union' : first.key} gewinnt die Bundestagswahl ${year} mit ` +
      `${fmtPct(first.pct)} der Zweitstimmen vor ${second.key === 'Union' ? 'der Union' : second.key} (${fmtPct(second.pct)}).`,
  ];
  const turnoutDelta = base.prevTurnout > 0 ? base.turnout - base.prevTurnout : null;
  parts.push(
    `Die Wahlbeteiligung liegt bei ${fmtPct(base.turnout)}` +
      (turnoutDelta !== null
        ? ` (${fmtDelta(turnoutDelta)} Prozentpunkte gegenüber der Vorwahl).`
        : '.'),
  );
  return parts.join(' ');
}

export function areaLede(
  areaName: string,
  year: number,
  results: PartyResult[],
  base: VoteBase,
): string {
  const [first, second] = ranked(results);
  const gain = [...results]
    .filter((r) => r.prevPct !== null && r.key !== 'Übrige')
    .sort((a, b) => b.pct - b.prevPct! - (a.pct - a.prevPct!))[0];
  const parts = [
    `Bei der Bundestagswahl ${year} erreicht ${first.key === 'Union' ? 'die Union' : first.key} in ${areaName} ` +
      `${fmtPct(first.pct)} der Zweitstimmen, vor ${second.key === 'Union' ? 'der Union' : second.key} mit ${fmtPct(second.pct)}.`,
    `Die Wahlbeteiligung liegt bei ${fmtPct(base.turnout)}.`,
  ];
  if (gain && gain.prevPct !== null) {
    parts.push(
      `Den größten Zugewinn verzeichnet ${gain.key === 'Union' ? 'die Union' : gain.key} mit ${fmtDelta(gain.pct - gain.prevPct)} Prozentpunkten.`,
    );
  }
  return parts.join(' ');
}
