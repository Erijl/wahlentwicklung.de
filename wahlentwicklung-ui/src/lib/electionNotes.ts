/**
 * Methodology & coverage notes per election — the single registry for the
 * historical-data quirks (docs/09 §1): territorial coverage, the 1949
 * single-vote election, missing Vorperiode/seat data before 2005, the 2021
 * Hauptwahl status. Pages render these via <Notice/>; module method texts
 * come from prevMethodText(). Statistics-domain notes live in the DB
 * (dataset_note) — this file only covers the kerg result pages.
 */

export type NoteScope = 'wahl' | 'bundesland' | 'wahlkreis';

export interface ElectionNote {
  id: string;
  text: string;
  /** Scopes the note applies to (default: all three). */
  scopes?: NoteScope[];
}

export function electionNotes(year: number, scope: NoteScope = 'wahl'): string[] {
  const notes: ElectionNote[] = [];

  if (year === 1949) {
    notes.push({
      id: 'single-vote',
      text: 'Bei der Bundestagswahl 1949 hatte jede Wählerin und jeder Wähler nur eine Stimme; sie wird hier zugleich als Erst- und Zweitstimme geführt.',
    });
    notes.push({
      id: 'coverage-1949',
      text: 'Das Ergebnis umfasst das damalige Bundesgebiet ohne das Saarland und ohne Berlin.',
    });
  } else if (year <= 1987) {
    notes.push({
      id: 'coverage-west',
      text:
        year === 1953
          ? 'Das Ergebnis umfasst das frühere Bundesgebiet ohne das Saarland und ohne Berlin (West).'
          : `Das Ergebnis umfasst das frühere Bundesgebiet${year === 1957 ? ' — erstmals mit dem Saarland —' : ''} ohne Berlin (West), dessen Abgeordnete nicht direkt gewählt wurden.`,
    });
  } else if (year === 1990) {
    notes.push({
      id: 'unification',
      text: 'Erste gesamtdeutsche Bundestagswahl. Die Fünf-Prozent-Hürde galt 1990 getrennt für das frühere Bundesgebiet und das Beitrittsgebiet; Vergleichswerte beziehen sich auf die Wahl 1987 im früheren Bundesgebiet.',
    });
  }

  if (year < 2005 && year > 1949) {
    notes.push({
      id: 'derived-prev',
      text: `Für Wahlen vor 2005 veröffentlicht die Bundeswahlleiterin keine auf den Gebietsstand umgerechneten Vorperiode-Werte. Veränderungen werden hier aus dem amtlichen Endergebnis der jeweiligen Vorwahl berechnet.`,
    });
  }
  if (year < 2005) {
    notes.push({
      id: 'no-seats',
      text: 'Die Sitzverteilungen der Wahlen vor 2005 sind in diesem Datensatz noch nicht erfasst; Sitz-Module entfallen daher.',
      scopes: ['wahl'],
    });
  }

  if (year === 2021) {
    notes.push({
      id: 'hauptwahl-2021',
      text: 'Die Ergebnisse 2021 entsprechen dem amtlichen Endergebnis der Hauptwahl vom 26. September 2021 — ohne die teilweise Wiederholungswahl in Berlin vom Februar 2024.',
    });
  }

  return notes.filter((n) => !n.scopes || n.scopes.includes(scope)).map((n) => n.text);
}

/** Method sentence for the ghost-bar comparison in result modules — the
 *  wording depends on whether the year has restated Vorperiode values. */
export function prevMethodText(vorperiode: boolean, prevYear?: number): string {
  if (prevYear === undefined) {
    return 'Für diese Wahl gibt es keine Vorwahl; es werden keine Veränderungswerte gezeigt.';
  }
  return vorperiode
    ? `Der blasse Balken zeigt das Ergebnis der Vorwahl ${prevYear}, umgerechnet auf den aktuellen Gebietsstand (Vorperiode-Werte der Bundeswahlleiterin).`
    : `Der blasse Balken zeigt das amtliche Endergebnis der Vorwahl ${prevYear} (ohne Umrechnung auf den Gebietsstand dieser Wahl).`;
}
