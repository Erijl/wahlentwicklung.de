package com.erijl.wahlentwicklung.backend.model;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Party {

    @SerializedName("party_id")
    private int partyId;

    @SerializedName("name")
    private String name;

    @SerializedName("election_id")
    private int electionId;

     @SerializedName("color_hex")
    private String colorHex;
}
