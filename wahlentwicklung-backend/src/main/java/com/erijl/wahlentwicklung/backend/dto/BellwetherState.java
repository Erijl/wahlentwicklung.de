package com.erijl.wahlentwicklung.backend.dto;

import com.erijl.wahlentwicklung.backend.model.State;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BellwetherState {

    private State state;

    private double percentageDifference;

    public BellwetherState(State state, double percentageDifference) {
        this.state = state;
        this.percentageDifference = percentageDifference;
    }
}
