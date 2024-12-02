package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.StateVoteParty;

public class StateVotePartyBuilder {
    public static StateVoteParty buildStateVoteParty(long id, long electionYear, long partyId, long stateId,
                                                     long primaryVotePreliminary, long primaryVoteDefinitiv,
                                                     long secondaryVotePreliminary, long secondaryVoteDefinitiv) {
        return StateVoteParty.newBuilder()
                .setId(id)
                .setElectionYear(electionYear)
                .setPartyId(partyId)
                .setStateId(stateId)
                .setPrimaryvotePreliminary(primaryVotePreliminary)
                .setPrimaryvoteDefinitiv(primaryVoteDefinitiv)
                .setSecondaryvotePreliminary(secondaryVotePreliminary)
                .setSecondaryvoteDefinitiv(secondaryVoteDefinitiv)
                .build();
    }
}