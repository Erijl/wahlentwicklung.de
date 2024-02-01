package com.erijl.wahlentwicklung.backend.util;

import com.erijl.wahlentwicklung.backend.model.PartyElectionResult;
import com.erijl.wahlentwicklung.backend.model.State;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class FilterUtil {

    private final double fivePercentHurdle = 5.00;

    public List<PartyElectionResult> filterForValidParties(List<PartyElectionResult> partyElectionResults) {
        return partyElectionResults.stream()
                .filter(partyElectionResult ->
                        partyElectionResult.getTotalVotesSecondaryPercentage() >= this.fivePercentHurdle)
                .collect(Collectors.toList());
    }

    public List<State> filterOutFederal(List<State> states) {
        return states.stream()
                .filter(state ->
                        state.getStateId() == 99)
                .collect(Collectors.toList());
    }
}
