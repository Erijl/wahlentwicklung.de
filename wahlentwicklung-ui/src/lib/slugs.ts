/** URL slugs. Constituency URLs use the official Wahlkreis number as the
 *  stable key plus the name for SEO: /wahlkreis/135-bergstrasse
 *  (docs/02-concept.md §2). */

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function constituencySlug(number: number, name: string): string {
  return `${number}-${slugify(name)}`;
}

/** Extract the Wahlkreis number back out of a slug ("135-bergstrasse" → 135). */
export function constituencyNumberFromSlug(slug: string): number {
  return Number.parseInt(slug, 10);
}

export function partySlug(abbreviation: string): string {
  return slugify(abbreviation);
}
