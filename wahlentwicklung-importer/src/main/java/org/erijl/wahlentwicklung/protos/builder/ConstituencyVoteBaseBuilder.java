package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.ConstituencyVoteBase;

public class ConstituencyVoteBaseBuilder {
    public static ConstituencyVoteBase buildConstituencyVoteBase(long electionYear, long stateId, long constituencyId,
                                                                 long eligibleVotersPrimaryVoteDefinitiv,
                                                                 long eligibleVotersPrimaryVotePreliminary,
                                                                 long eligibleVotersSecondaryVoteDefinitive,
                                                                 long eligibleVotersSecondaryVotePreliminary,
                                                                 long actualVotersPrimaryVoteDefinitiv,
                                                                 long actualVotersPrimaryVotePreliminary,
                                                                 long actualVotersSecondaryVoteDefinitive,
                                                                 long actualVotersSecondaryVotePreliminary,
                                                                 long validVotersPrimaryVoteDefinitiv,
                                                                 long validVotersSecondaryVotePreliminary,
                                                                 long validVotersSecondaryVoteDefinitive,
                                                                 long validVotersPrimaryVotePreliminary,
                                                                 long invalidVotersPrimaryVoteDefinitiv,
                                                                 long invalidVotersPrimaryVotePreliminary,
                                                                 long invalidVotersSecondaryVoteDefinitive,
                                                                 long invalidVotersSecondaryVotePreliminary) {
        return ConstituencyVoteBase.newBuilder()
                .setElectionYear(electionYear)
                .setStateId(stateId)
                .setConstituencyId(constituencyId)
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