package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.StateVoteParty;

public class StateVotePartyBuilder {
    public static StateVoteParty buildStateVoteParty(long electionYear, long partyId, long stateId,
                                                     long primaryVotePrevious, long primaryVoteDefinitive,
                                                     long secondaryVotePrevious, long secondaryVoteDefinitive) {
        return StateVoteParty.newBuilder()
                .setElectionYear(electionYear)
                .setPartyId(partyId)
                .setStateId(stateId)
                .setPrimaryvotePrevious(primaryVotePrevious)
                .setPrimaryvoteDefinitive(primaryVoteDefinitive)
                .setSecondaryvotePrevious(secondaryVotePrevious)
                .setSecondaryvoteDefinitive(secondaryVoteDefinitive)
                .build();
    }
}