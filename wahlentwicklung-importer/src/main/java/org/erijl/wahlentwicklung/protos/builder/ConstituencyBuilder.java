package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.Constituency;
import org.erijl.wahlentwicklung.protos.objects.Party;

public class ConstituencyBuilder {

    public static Constituency buildConstituency(int id, int stateId, String name){
        return Constituency.newBuilder()
                .setId(id)
                .setStateId(stateId)
                .setName(name)
                .build();
    }
}
