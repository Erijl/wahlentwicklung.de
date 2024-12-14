package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.StateVoteBase;

public class StateVoteBaseBuilder {
    public static StateVoteBase buildStateVoteBase(long electionYear, long stateId,
                                                   long eligibleVotersPrimaryVoteDefinitiv,
                                                   long eligibleVotersPrimaryVotePreliminary,
                                                   long eligibleVotersSecondaryVoteDefinitive,
                                                   long eligibleVotersSecondaryVotePreliminary,
                                                   long actualVotersPrimaryVoteDefinitiv,
                                                   long actualVotersPrimaryVotePreliminary,
                                                   long actualVotersSecondaryVoteDefinitive,
                                                   long actualVotersSecondaryVotePreliminary,
                                                   long invalidVotersPrimaryVoteDefinitiv,
                                                   long invalidVotersPrimaryVotePreliminary,
                                                   long invalidVotersSecondaryVoteDefinitive,
                                                   long invalidVotersSecondaryVotePreliminary,
                                                   long validVotersPrimaryVoteDefinitiv,
                                                   long validVotersSecondaryVotePreliminary,
                                                   long validVotersSecondaryVoteDefinitive,
                                                   long validVotersPrimaryVotePreliminary) {
        return StateVoteBase.newBuilder()
                .setElectionYear(electionYear)
                .setStateId(stateId)
                .setEligiblevotersPrimaryvotePreliminary(eligibleVotersPrimaryVotePreliminary)
                .setEligiblevotersPrimaryvoteDefinitiv(eligibleVotersPrimaryVoteDefinitiv)
                .setEligiblevotersSecondaryvotePreliminary(eligibleVotersSecondaryVotePreliminary)
                .setEligiblevotersSecondaryboteDefinitive(eligibleVotersSecondaryVoteDefinitive)
                .setActualvotersPrimaryvotePreliminary(actualVotersPrimaryVotePreliminary)
                .setActualvotersPrimaryvoteDefinitiv(actualVotersPrimaryVoteDefinitiv)
                .setActualvotersSecondaryvotePreliminary(actualVotersSecondaryVotePreliminary)
                .setActualvotersSecondaryboteDefinitive(actualVotersSecondaryVoteDefinitive)
                .setValidvotersPrimaryvotePreliminary(validVotersPrimaryVotePreliminary)
                .setValidvotersPrimaryvoteDefinitiv(validVotersPrimaryVoteDefinitiv)
                .setValidvotersSecondaryvotePreliminary(validVotersSecondaryVotePreliminary)
                .setValidvotersSecondaryboteDefinitive(validVotersSecondaryVoteDefinitive)
                .setInvalidvotersPrimaryvotePreliminary(invalidVotersPrimaryVotePreliminary)
                .setInvalidvotersPrimaryvoteDefinitiv(invalidVotersPrimaryVoteDefinitiv)
                .setInvalidvotersSecondaryvotePreliminary(invalidVotersSecondaryVotePreliminary)
                .setInvalidvotersSecondaryboteDefinitive(invalidVotersSecondaryVoteDefinitive)
                .build();
    }
}