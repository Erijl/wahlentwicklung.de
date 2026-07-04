package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.StateVoteBase;

public class StateVoteBaseBuilder {
    public static StateVoteBase buildStateVoteBase(long electionYear, long stateId,
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
        return StateVoteBase.newBuilder()
                .setElectionYear(electionYear)
                .setStateId(stateId)
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