package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.ElectionParty;

public class ElectionPartyBuilder {

    private ElectionPartyBuilder() {}

    public static ElectionParty buildElectionParty(int electionYear, int columnIndex, String name) {
        System.out.println(name);
        return ElectionParty.newBuilder()
                .setElectionYear(electionYear)
                .setColumnIndex(columnIndex)
                .setName(name)
                .build();
    }

}
