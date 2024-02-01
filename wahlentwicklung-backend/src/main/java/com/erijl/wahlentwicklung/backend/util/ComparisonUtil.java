package com.erijl.wahlentwicklung.backend.util;

import com.erijl.wahlentwicklung.backend.model.PartyElectionResult;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ComparisonUtil {

    public double getDifferenceBetweenPartyElectionResultLists
            (List<PartyElectionResult> partyElectionResultsOne,
             List<PartyElectionResult> partyElectionResultsTwo) {

        //if(partyElectionResultsOne.size() != partyElectionResultsTwo.size()) {
        //    //TODO refactor error handling
        //    System.out.println("Error: Size does not match");
        //    return 100.00;
        //}

        double diff = 0.00;
        for (PartyElectionResult partyElectionResultOne : partyElectionResultsOne) {
            for (PartyElectionResult partyElectionResultTwo :
                    partyElectionResultsTwo) {
                //TODO IMPORTANT REPLACE WITH ID
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
                    //System.out.println("diff between " + percentageOne + " and " + percentageTwo + " equals " + (minusValue/((percentageOne + percentageTwo)/2))*100);
                   //System.out.println("Party " + partyElectionResultOne.getPartyName());
                    //System.out.println("------------------------------------------------------------------");
                }
            }
        }
        return diff;
    }
}
