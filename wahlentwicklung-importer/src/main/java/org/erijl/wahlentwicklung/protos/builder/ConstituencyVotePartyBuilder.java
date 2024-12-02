package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.ConstituencyVoteParty;

public class ConstituencyVotePartyBuilder {
    public static ConstituencyVoteParty buildConstituencyVoteParty(long id, long electionYear, long partyId,
                                                                   long constituencyId, long primaryVotePreliminary,
                                                                   long primaryVoteDefinitiv, long secondaryVotePreliminary,
                                                                   long secondaryVoteDefinitiv) {
        return ConstituencyVoteParty.newBuilder()
                .setId(id)
                .setElectionYear(electionYear)
                .setPartyId(partyId)
                .setConstituencyId(constituencyId)
                .setPrimaryvotePreliminary(primaryVotePreliminary)
                .setPrimaryvoteDefinitiv(primaryVoteDefinitiv)
                .setSecondaryvotePreliminary(secondaryVotePreliminary)
                .setSecondaryvoteDefinitiv(secondaryVoteDefinitiv)
                .build();
    }
}