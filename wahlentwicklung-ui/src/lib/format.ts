/** Locale-aware formatting. v0.1 renders German pages; every function
 *  already takes a locale so the /en/ mirror (v0.2) is additive. */

export type Locale = 'de' | 'en';

export function fmtPct(value: number, locale: Locale = 'de', decimals = 1): string {
  const n = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
  return locale === 'de' ? `${n} %` : `${n}%`;
}

export function fmtNum(value: number, locale: Locale = 'de'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** Signed percentage-point delta: "+4,4" / "−9,3" (typographic minus). */
export function fmtDelta(value: number, locale: Locale = 'de', decimals = 1): string {
  const n = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(value));
  return value >= 0 ? `+${n}` : `−${n}`;
}

export function fmtMillions(value: number, locale: Locale = 'de', decimals = 1): string {
  const n = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 1_000_000);
  return locale === 'de' ? `${n} Mio.` : `${n}M`;
}
