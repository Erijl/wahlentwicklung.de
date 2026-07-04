/**
 * Rich hover cards (design/shell-and-hover-concept.md §3): targets carry a
 * compact `data-card` JSON; the HoverCard layer in BaseLayout renders it
 * client-side. Keys are single letters because the payload ships on every
 * row of the big lists (299×).
 */
import type { PartyResult } from './queries';

export interface HoverCardOptions {
  /** Context line, e.g. "Thüringen · Wahlkreis 189" or "Bundestagswahl 2025". */
  kicker: string;
  title: string;
  /** Turnout in % — rendered into the status line when present. */
  turnout?: number;
  /** Election year of the shown results (legend). */
  year?: number;
  /** Previous election year (ghost-bar legend), omitted if none. */
  prevYear?: number;
  /** Chart label, defaults to "Zweitstimmen" client-side. */
  label?: string;
  results: PartyResult[];
  /** Columns shown, sorted by current share (local ranking view). */
  max?: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export function hoverCard(opts: HoverCardOptions): string {
  const bars = [...opts.results]
    .filter((r) => r.key !== 'Übrige')
    .sort((a, b) => b.pct - a.pct)
    .slice(0, opts.max ?? 7)
    .map((r) => ({ p: r.key, v: r1(r.pct), w: r.prevPct === null ? null : r1(r.prevPct) }));
  return JSON.stringify({
    k: opts.kicker,
    t: opts.title,
    u: opts.turnout === undefined ? undefined : r1(opts.turnout),
    y: opts.year,
    py: opts.prevYear,
    l: opts.label,
    b: bars,
  });
}
