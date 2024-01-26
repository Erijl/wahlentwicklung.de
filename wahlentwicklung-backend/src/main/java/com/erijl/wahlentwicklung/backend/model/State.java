package com.erijl.wahlentwicklung.backend.model;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class State {

    @SerializedName("state_id")
    private int stateId;

    @SerializedName("name")
    private String name;

    @SerializedName("identifier")
    private int identifier;

    @SerializedName("abbreviation")
    private String abbreviation;
}
