package com.erijl.wahlentwicklung.backend.model;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ElectionStatistic {

    @SerializedName("election_id")
    private int electionId;

    @SerializedName("eligible_voters")
    private VoterRepresentation eligibleVoters;

    @SerializedName("voters")
    private VoterRepresentation voters;

    @SerializedName("invalid_votes")
    private VoterRepresentation invalidVotes;

    @SerializedName("valid_votes")
    private VoterRepresentation validVotes;
}
