package org.erijl.wahlentwicklung.mapper;

import org.erijl.wahlentwicklung.DatabaseManager;
import org.erijl.wahlentwicklung.protos.objects.ElectionParty;
import org.erijl.wahlentwicklung.protos.objects.Party;

import java.sql.SQLException;
import java.util.Optional;

public class PartyMapper {

    public static Long tryMap(ElectionParty electionParty, DatabaseManager dbManager) throws SQLException {
        Optional<Party> possibleParty = dbManager.getAllParties().stream().filter(party ->
                party.getName().equalsIgnoreCase(electionParty.getName()) ||
                        party.getAbbreviation().equalsIgnoreCase(electionParty.getName())).findFirst();
        if (possibleParty.isPresent()) return possibleParty.get().getId();
        return null;
    }
}
