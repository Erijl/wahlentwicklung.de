package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.ConstituencyVoteBase;

public class ConstituencyVoteBaseBuilder {
    public static ConstituencyVoteBase buildConstituencyVoteBase(long electionYear, long stateId, long constituencyId,
                                                                 long eligibleVotersPrimaryVoteDefinitive,
                                                                 long eligibleVotersPrimaryVotePreliminary,
                                                                 long eligibleVotersSecondaryVoteDefinitive,
                                                                 long eligibleVotersSecondaryVotePreliminary,
                                                                 long actualVotersPrimaryVoteDefinitive,
                                                                 long actualVotersPrimaryVotePreliminary,
                                                                 long actualVotersSecondaryVoteDefinitive,
                                                                 long actualVotersSecondaryVotePreliminary,
                                                                 long invalidVotersPrimaryVoteDefinitive,
                                                                 long invalidVotersPrimaryVotePreliminary,
                                                                 long invalidVotersSecondaryVoteDefinitive,
                                                                 long invalidVotersSecondaryVotePreliminary,
                                                                 long validVotersPrimaryVoteDefinitive,
                                                                 long validVotersSecondaryVotePreliminary,
                                                                 long validVotersSecondaryVoteDefinitive,
                                                                 long validVotersPrimaryVotePreliminary) {
        return ConstituencyVoteBase.newBuilder()
                .setElectionYear(electionYear)
                .setStateId(stateId)
                .setConstituencyId(constituencyId)
                .setEligiblevotersPrimaryvotePreliminary(eligibleVotersPrimaryVotePreliminary)
                .setEligiblevotersPrimaryvoteDefinitive(eligibleVotersPrimaryVoteDefinitive)
                .setEligiblevotersSecondaryvotePreliminary(eligibleVotersSecondaryVotePreliminary)
                .setEligiblevotersSecondaryvoteDefinitive(eligibleVotersSecondaryVoteDefinitive)
                .setActualvotersPrimaryvotePreliminary(actualVotersPrimaryVotePreliminary)
                .setActualvotersPrimaryvoteDefinitive(actualVotersPrimaryVoteDefinitive)
                .setActualvotersSecondaryvotePreliminary(actualVotersSecondaryVotePreliminary)
                .setActualvotersSecondaryvoteDefinitive(actualVotersSecondaryVoteDefinitive)
                .setValidvotersPrimaryvotePreliminary(validVotersPrimaryVotePreliminary)
                .setValidvotersPrimaryvoteDefinitive(validVotersPrimaryVoteDefinitive)
                .setValidvotersSecondaryvotePreliminary(validVotersSecondaryVotePreliminary)
                .setValidvotersSecondaryvoteDefinitive(validVotersSecondaryVoteDefinitive)
                .setInvalidvotersPrimaryvotePreliminary(invalidVotersPrimaryVotePreliminary)
                .setInvalidvotersPrimaryvoteDefinitive(invalidVotersPrimaryVoteDefinitive)
                .setInvalidvotersSecondaryvotePreliminary(invalidVotersSecondaryVotePreliminary)
                .setInvalidvotersSecondaryvoteDefinitive(invalidVotersSecondaryVoteDefinitive)
                .build();
    }
}