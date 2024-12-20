package org.erijl.wahlentwicklung.protos.builder;

import org.erijl.wahlentwicklung.protos.objects.Party;

public class PartyBuilder {

    public static Party buildParty(int id, String name, String abbreviation, String color){
        return Party.newBuilder()
                .setId(id)
                .setName(name)
                .setAbbreviation(abbreviation)
                .setColor(color)
                .build();
    }
}
