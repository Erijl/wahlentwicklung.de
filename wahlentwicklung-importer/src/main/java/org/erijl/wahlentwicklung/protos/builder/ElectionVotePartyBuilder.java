package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.ElectionVoteParty;

public class ElectionVotePartyBuilder {
    public static ElectionVoteParty buildElectionVoteParty(long electionYear, long partyId,
                                                           long primaryVotePrevious, long primaryVoteDefinitive,
                                                           long secondaryVotePrevious, long secondaryVoteDefinitive) {
        return ElectionVoteParty.newBuilder()
                .setElectionYear(electionYear)
                .setPartyId(partyId)
                .setPrimaryvotePrevious(primaryVotePrevious)
                .setPrimaryvoteDefinitive(primaryVoteDefinitive)
                .setSecondaryvotePrevious(secondaryVotePrevious)
                .setSecondaryvoteDefinitive(secondaryVoteDefinitive)
                .build();
    }
}