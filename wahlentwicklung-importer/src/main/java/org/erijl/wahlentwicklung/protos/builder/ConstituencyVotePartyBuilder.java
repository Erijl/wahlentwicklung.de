package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.ConstituencyVoteParty;

public class ConstituencyVotePartyBuilder {
    public static ConstituencyVoteParty buildConstituencyVoteParty(long electionYear, long stateId, long partyId,
                                                                   long constituencyId, long primaryVotePreliminary,
                                                                   long primaryVoteDefinitiv, long secondaryVotePreliminary,
                                                                   long secondaryVoteDefinitiv) {
        return ConstituencyVoteParty.newBuilder()
                .setElectionYear(electionYear)
                .setStateId(stateId)
                .setPartyId(partyId)
                .setConstituencyId(constituencyId)
                .setPrimaryvotePreliminary(primaryVotePreliminary)
                .setPrimaryvoteDefinitiv(primaryVoteDefinitiv)
                .setSecondaryvotePreliminary(secondaryVotePreliminary)
                .setSecondaryvoteDefinitiv(secondaryVoteDefinitiv)
                .build();
    }
}