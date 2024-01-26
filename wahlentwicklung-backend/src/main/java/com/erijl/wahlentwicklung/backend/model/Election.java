package com.erijl.wahlentwicklung.backend.model;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Election {


    @SerializedName("election_id")
    private int electionId;

    @SerializedName("year")
    private int year;

    @SerializedName("active")
    private boolean active;
}
