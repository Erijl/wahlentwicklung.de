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
                    //TODO add "Sonstige" ?
                    double minusValue = percentageOne - percentageTwo;
                    minusValue = minusValue < 0 ? (minusValue*(-1)) : minusValue;
                    diff += (minusValue/((percentageOne + percentageTwo)/2))*100;
                }
            }
        }
        return diff;
    }
}
