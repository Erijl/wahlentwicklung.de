package com.erijl.wahlentwicklung.backend.model;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PartyElectionResult {

    @SerializedName("party_name")
    private String partyName;

    @SerializedName("total_votes_primary")
    private int totalVotesPrimary;

    @SerializedName("percentage_of_votes_primary")
    private double totalVotesPrimaryPercentage;

    @SerializedName("total_votes_secondary")
    private int totalVotesSecondary;

    @SerializedName("percentage_of_votes_secondary")
    private double totalVotesSecondaryPercentage;

    @SerializedName("color_hex")
    private String colorHex;
}
