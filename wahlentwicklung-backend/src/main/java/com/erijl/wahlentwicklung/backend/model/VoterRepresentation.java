package com.erijl.wahlentwicklung.backend.model;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoterRepresentation {

    @SerializedName("primary_votes_prior")
    private int primaryVotesPrior;

    @SerializedName("primary_votes_final")
    private int primaryVotesFinal;

    @SerializedName("secondary_votes_prior")
    private int secondaryVotesPrior;

    @SerializedName("secondary_votes_final")
    private int secondaryVotesFinal;
}
