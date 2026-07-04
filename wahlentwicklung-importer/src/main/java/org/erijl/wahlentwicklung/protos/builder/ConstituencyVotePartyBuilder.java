package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.ConstituencyVoteParty;

public class ConstituencyVotePartyBuilder {
    public static ConstituencyVoteParty buildConstituencyVoteParty(long electionYear, long stateId, long partyId,
                                                                   long constituencyId, long primaryVotePrevious,
                                                                   long primaryVoteDefinitive, long secondaryVotePrevious,
                                                                   long secondaryVoteDefinitive) {
        return ConstituencyVoteParty.newBuilder()
                .setElectionYear(electionYear)
                .setStateId(stateId)
                .setPartyId(partyId)
                .setConstituencyId(constituencyId)
                .setPrimaryvotePrevious(primaryVotePrevious)
                .setPrimaryvoteDefinitive(primaryVoteDefinitive)
                .setSecondaryvotePrevious(secondaryVotePrevious)
                .setSecondaryvoteDefinitive(secondaryVoteDefinitive)
                .build();
    }
}