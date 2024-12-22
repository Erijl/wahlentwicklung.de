package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.State;

public class StateBuilder {

    public static State buildState(int id, String name){
        return State.newBuilder()
                .setId(id)
                .setName(name)
                .build();
    }
}
