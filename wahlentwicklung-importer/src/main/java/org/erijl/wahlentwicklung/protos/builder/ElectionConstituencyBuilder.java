package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.ElectionConstituency;

public class ElectionConstituencyBuilder {

    private ElectionConstituencyBuilder() {}

    public static ElectionConstituency buildElectionState(int stateId, int electionYear, int row_id, String name) {
        return ElectionConstituency.newBuilder()
                .setElectionYear(electionYear)
                .setRowId(row_id)
                .setName(name)
                .build();
    }

}
