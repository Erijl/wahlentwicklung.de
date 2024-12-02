package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.ElectionVoteParty;

public class ElectionVotePartyBuilder {
    public static ElectionVoteParty buildElectionVoteParty(long electionYear, long partyId,
                                                           long primaryVotePreliminary, long primaryVoteDefinitiv,
                                                           long secondaryVotePreliminary, long secondaryVoteDefinitiv) {
        return ElectionVoteParty.newBuilder()
                .setElectionYear(electionYear)
                .setPartyId(partyId)
                .setPrimaryvotePreliminary(primaryVotePreliminary)
                .setPrimaryvoteDefinitiv(primaryVoteDefinitiv)
                .setSecondaryvotePreliminary(secondaryVotePreliminary)
                .setSecondaryvoteDefinitiv(secondaryVoteDefinitiv)
                .build();
    }
}