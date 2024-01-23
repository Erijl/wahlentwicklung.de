import {Json} from "./common-types";

export type ElectionResult = {
  party_name: string;
  total_votes_primary: bigint;
  percentage_of_votes_primary: number | null;
  total_votes_secondary: bigint;
  percentage_of_votes_secondary: number | null;
  color_hex: string | null;
};

export type GeneralElectionData = {
  election_id: number;
  eligible_voters: number;
  voters: number;
  invalid_votes: number;
  valid_votes: number;
}
