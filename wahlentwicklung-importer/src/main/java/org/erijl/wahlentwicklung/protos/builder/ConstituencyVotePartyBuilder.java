package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.ConstituencyVoteParty;

public class ConstituencyVotePartyBuilder {
    public static ConstituencyVoteParty buildConstituencyVoteParty(long electionYear, long stateId, long partyId,
                                                                   long constituencyId, long primaryVotePreliminary,
                                                                   long primaryVoteDefinitive, long secondaryVotePreliminary,
                                                                   long secondaryVoteDefinitive) {
        return ConstituencyVoteParty.newBuilder()
                .setElectionYear(electionYear)
                .setStateId(stateId)
                .setPartyId(partyId)
                .setConstituencyId(constituencyId)
                .setPrimaryvotePreliminary(primaryVotePreliminary)
                .setPrimaryvoteDefinitive(primaryVoteDefinitive)
                .setSecondaryvotePreliminary(secondaryVotePreliminary)
                .setSecondaryvoteDefinitive(secondaryVoteDefinitive)
                .build();
    }
}