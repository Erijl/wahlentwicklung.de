export type Election = {
  electionId: number;
  year: number | null;
  active: boolean;
};

export type ElectionStatistic = {
  electionId: number;
  eligibleVoters: VoterRepresentation;
  voters: VoterRepresentation;
  invalidVotes: VoterRepresentation;
  validVotes: VoterRepresentation;
};

export type Party = {
  partyId: number;
  name: string | null;
  electionId: number;
  colorHex: string | null;
};

export type PartyElectionResult = {
  partyName: string | null;
  totalVotesPrimary: number;
  totalVotesPrimaryPercentage: number;
  totalVotesSecondary: number;
  totalVotesSecondaryPercentage: number;
  colorHex: string | null;
};

export type State = {
  stateId: number;
  name: string | null;
  identifier: number;
  abbreviation: string | null;
};

export type VoterRepresentation = {
  primaryVotesPrior: number;
  primaryVotesFinal: number;
  secondaryVotesPrior: number;
  secondaryVotesFinal: number;
};

/* OLD
export type State = {
  abbreviation: string | null;
  state_id: number;
  identifier: number | null;
  name: string | null;
};

export type Party = {
  name: string | null;
  party_id: number;
  election_id: number | null;
};

export type Election = {
  election_id: number;
  year: number | null;
  active: boolean;
};

export type District = {
  state_id: number | null;
  valid_votes: Json | null;
  identifier: number | null;
  name: string | null;
  invalid_vote: Json | null;
  voters: Json | null;
  election_id: number | null;
  eligible_voters: Json | null;
  district_id: number;
};

export type PartyVotes = {
  party_id: number | null;
  vote_count: Json | null;
  vote_id: number;
  district_id: number | null;
};

export type StateVotes = {
  state_id: number | null;
  state_vote_id: number;
  valid_votes: Json | null;
  invalid_votes: Json | null;
  voters: Json | null;
  election_id: number | null;
  eligible_voters: Json | null;
};

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];


 */
