
export type Bundesland = {
  abbreviation: string | null;
  bundesland_id: number;
  identifier: number | null;
  name: string | null;
};

export type Partei = {
  name: string | null;
  partei_id: number;
  wahl_id: number | null;
};

export type Wahl = {
  wahl_id: number;
  year: number | null;
};

export type Wahlkreis = {
  bundesland_id: number | null;
  gueltige_stimmen: Json | null;
  identifier: number | null;
  name: string | null;
  ungueltige_stimmen: Json | null;
  waehler: Json | null;
  wahl_id: number | null;
  wahlberechtigte: Json | null;
  wahlkreis_id: number;
};

export type ParteiStimmen = {
  partei_id: number | null;
  stimmen: Json | null;
  vote_id: number;
  wahlkreis_id: number | null;
};

export type BundeslandStimmen = {
  bundesland_id: number | null;
  bundesland_stimmen_id: number;
  gueltige_stimmen: Json | null;
  ungueltige_stimmen: Json | null;
  waehler: Json | null;
  wahl_id: number | null;
  wahlberechtigte: Json | null;
};

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];
