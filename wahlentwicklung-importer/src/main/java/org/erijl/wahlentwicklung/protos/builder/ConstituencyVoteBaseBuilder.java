package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.ConstituencyVoteBase;

public class ConstituencyVoteBaseBuilder {
    public static ConstituencyVoteBase buildConstituencyVoteBase(long electionYear, long stateId, long constituencyId,
                                                                 long eligibleVotersPrimaryVoteDefinitive,
                                                                 long eligibleVotersPrimaryVotePrevious,
                                                                 long eligibleVotersSecondaryVoteDefinitive,
                                                                 long eligibleVotersSecondaryVotePrevious,
                                                                 long actualVotersPrimaryVoteDefinitive,
                                                                 long actualVotersPrimaryVotePrevious,
                                                                 long actualVotersSecondaryVoteDefinitive,
                                                                 long actualVotersSecondaryVotePrevious,
                                                                 long invalidVotersPrimaryVoteDefinitive,
                                                                 long invalidVotersPrimaryVotePrevious,
                                                                 long invalidVotersSecondaryVoteDefinitive,
                                                                 long invalidVotersSecondaryVotePrevious,
                                                                 long validVotersPrimaryVoteDefinitive,
                                                                 long validVotersSecondaryVotePrevious,
                                                                 long validVotersSecondaryVoteDefinitive,
                                                                 long validVotersPrimaryVotePrevious) {
        return ConstituencyVoteBase.newBuilder()
                .setElectionYear(electionYear)
                .setStateId(stateId)
                .setConstituencyId(constituencyId)
                .setEligiblevotersPrimaryvotePrevious(eligibleVotersPrimaryVotePrevious)
                .setEligiblevotersPrimaryvoteDefinitive(eligibleVotersPrimaryVoteDefinitive)
                .setEligiblevotersSecondaryvotePrevious(eligibleVotersSecondaryVotePrevious)
                .setEligiblevotersSecondaryvoteDefinitive(eligibleVotersSecondaryVoteDefinitive)
                .setActualvotersPrimaryvotePrevious(actualVotersPrimaryVotePrevious)
                .setActualvotersPrimaryvoteDefinitive(actualVotersPrimaryVoteDefinitive)
                .setActualvotersSecondaryvotePrevious(actualVotersSecondaryVotePrevious)
                .setActualvotersSecondaryvoteDefinitive(actualVotersSecondaryVoteDefinitive)
                .setValidvotersPrimaryvotePrevious(validVotersPrimaryVotePrevious)
                .setValidvotersPrimaryvoteDefinitive(validVotersPrimaryVoteDefinitive)
                .setValidvotersSecondaryvotePrevious(validVotersSecondaryVotePrevious)
                .setValidvotersSecondaryvoteDefinitive(validVotersSecondaryVoteDefinitive)
                .setInvalidvotersPrimaryvotePrevious(invalidVotersPrimaryVotePrevious)
                .setInvalidvotersPrimaryvoteDefinitive(invalidVotersPrimaryVoteDefinitive)
                .setInvalidvotersSecondaryvotePrevious(invalidVotersSecondaryVotePrevious)
                .setInvalidvotersSecondaryvoteDefinitive(invalidVotersSecondaryVoteDefinitive)
                .build();
    }
}