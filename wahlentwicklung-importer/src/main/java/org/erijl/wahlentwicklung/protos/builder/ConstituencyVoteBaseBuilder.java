package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.ConstituencyVoteBase;

public class ConstituencyVoteBaseBuilder {
    public static ConstituencyVoteBase buildConstituencyVoteBase(long electionYear, long stateId, long constituencyId,
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