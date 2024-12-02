package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.StateVoteBase;

public class StateVoteBaseBuilder {
    public static StateVoteBase buildStateVoteBase(long id, long electionYear, long stateId,
                                                   long eligibleVotersPrimaryVotePreliminary,
                                                   long eligibleVotersPrimaryVoteDefinitiv,
                                                   long eligibleVotersSecondaryVotePreliminary,
                                                   long eligibleVotersSecondaryVoteDefinitive,
                                                   long actualVotersPrimaryVotePreliminary,
                                                   long actualVotersPrimaryVoteDefinitiv,
                                                   long actualVotersSecondaryVotePreliminary,
                                                   long actualVotersSecondaryVoteDefinitive,
                                                   long validVotersPrimaryVotePreliminary,
                                                   long validVotersPrimaryVoteDefinitiv,
                                                   long validVotersSecondaryVotePreliminary,
                                                   long validVotersSecondaryVoteDefinitive,
                                                   long invalidVotersPrimaryVotePreliminary,
                                                   long invalidVotersPrimaryVoteDefinitiv,
                                                   long invalidVotersSecondaryVotePreliminary,
                                                   long invalidVotersSecondaryVoteDefinitive) {
        return StateVoteBase.newBuilder()
                .setId(id)
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