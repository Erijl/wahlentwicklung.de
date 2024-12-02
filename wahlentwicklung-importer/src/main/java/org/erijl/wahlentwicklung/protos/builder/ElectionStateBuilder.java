package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.ElectionState;

public class ElectionStateBuilder {

    private ElectionStateBuilder() {}

    public static ElectionState buildElectionState(int electionYear, int row_id, String name) {
        return ElectionState.newBuilder()
                .setElectionYear(electionYear)
                .setRowId(row_id)
                .setName(name)
                .build();
    }

}
