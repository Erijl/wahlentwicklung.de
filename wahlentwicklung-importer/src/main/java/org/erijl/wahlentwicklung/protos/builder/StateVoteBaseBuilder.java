package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.StateVoteBase;

public class StateVoteBaseBuilder {
    public static StateVoteBase buildStateVoteBase(long electionYear, long stateId,
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
        return StateVoteBase.newBuilder()
                .setElectionYear(electionYear)
                .setStateId(stateId)
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