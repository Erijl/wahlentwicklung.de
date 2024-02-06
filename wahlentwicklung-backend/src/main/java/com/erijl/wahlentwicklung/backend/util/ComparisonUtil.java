package com.erijl.wahlentwicklung.backend.util;

import com.erijl.wahlentwicklung.backend.model.PartyElectionResult;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ComparisonUtil {

    public double getDifferenceBetweenPartyElectionResultLists
            (List<PartyElectionResult> partyElectionResultsOne,
             List<PartyElectionResult> partyElectionResultsTwo) {

        double diff = 0.00;
        for (PartyElectionResult partyElectionResultOne : partyElectionResultsOne) {
            for (PartyElectionResult partyElectionResultTwo :
                    partyElectionResultsTwo) {
                if(partyElectionResultOne.getPartyName().equals(partyElectionResultTwo.getPartyName())) {
                    double percentageOne = partyElectionResultOne.getTotalVotesSecondaryPercentage();
                    double percentageTwo = partyElectionResultTwo.getTotalVotesSecondaryPercentage();

                    if(percentageOne == 0.00 || percentageTwo == 0.00) {
                        continue;
                    }
                    diff += Math.abs(percentageOne - percentageTwo) / percentageOne * 100.00;
                }
            }
        }
        return diff;
    }
}
