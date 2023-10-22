import {Json} from "./common-types";

export type WahlResult = {
  partei_name: string;
  total_votes_erststimmen: bigint;
  percentage_of_votes_erststimmen: number | null;
  total_votes_zweitstimmen: bigint;
  percentage_of_votes_zweitstimmen: number | null;
};

export type GeneralElectionData = {
  wahl_id: number;
  wahlberechtigte: number;
  waehler: number;
  ungueltige_stimmen: number;
  gueltige_stimmen: number;
}
