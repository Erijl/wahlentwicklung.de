package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.ElectionVoteParty;

public class ElectionVotePartyBuilder {
    public static ElectionVoteParty buildElectionVoteParty(long electionYear, long partyId,
                                                           long primaryVotePreliminary, long primaryVoteDefinitive,
                                                           long secondaryVotePreliminary, long secondaryVoteDefinitive) {
        return ElectionVoteParty.newBuilder()
                .setElectionYear(electionYear)
                .setPartyId(partyId)
                .setPrimaryvotePreliminary(primaryVotePreliminary)
                .setPrimaryvoteDefinitive(primaryVoteDefinitive)
                .setSecondaryvotePreliminary(secondaryVotePreliminary)
                .setSecondaryvoteDefinitive(secondaryVoteDefinitive)
                .build();
    }
}