
export type WahlResult = {
  partei_name: string;
  total_votes_erststimmen: bigint;
  percentage_of_votes_erststimmen: number | null;
  total_votes_zweitstimmen: bigint;
  percentage_of_votes_zweitstimmen: number | null;
};
