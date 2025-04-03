package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.StateVoteParty;

public class StateVotePartyBuilder {
    public static StateVoteParty buildStateVoteParty(long electionYear, long partyId, long stateId,
                                                     long primaryVotePreliminary, long primaryVoteDefinitive,
                                                     long secondaryVotePreliminary, long secondaryVoteDefinitive) {
        return StateVoteParty.newBuilder()
                .setElectionYear(electionYear)
                .setPartyId(partyId)
                .setStateId(stateId)
                .setPrimaryvotePreliminary(primaryVotePreliminary)
                .setPrimaryvoteDefinitive(primaryVoteDefinitive)
                .setSecondaryvotePreliminary(secondaryVotePreliminary)
                .setSecondaryvoteDefinitive(secondaryVoteDefinitive)
                .build();
    }
}