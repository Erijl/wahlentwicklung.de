package org.erijl.wahlentwicklung.mapper;

import org.erijl.wahlentwicklung.DatabaseManager;
import org.erijl.wahlentwicklung.protos.objects.Constituency;
import org.erijl.wahlentwicklung.protos.objects.ElectionConstituency;

import java.sql.SQLException;
import java.util.Optional;

public class ConstituencyMapper {

    //TODO add javadoc to publc methods & optimize, no need to fetch all constituency for each mapping try
    public static Long tryMap(ElectionConstituency electionState, DatabaseManager dbManager) throws SQLException {
        Optional<Constituency> possibleConstituency = dbManager.getAllConstituencies().stream().filter(constituency ->
                constituency.getName().equalsIgnoreCase(electionState.getName())).findFirst();

        if (possibleConstituency.isPresent()) return possibleConstituency.get().getId();
        return null;
    }
}
