package org.erijl.wahlentwicklung.mapper;

import org.erijl.wahlentwicklung.DatabaseManager;
import org.erijl.wahlentwicklung.protos.objects.ElectionState;
import org.erijl.wahlentwicklung.protos.objects.State;

import java.sql.SQLException;
import java.util.Optional;

public class StateMapper {

    public static Long tryMap(ElectionState electionState, DatabaseManager dbManager) throws SQLException {
            Optional<State> possibleState = dbManager.getAllStates().stream().filter(state ->
                    state.getName().equalsIgnoreCase(electionState.getName())).findFirst();

            if (possibleState.isPresent()) return possibleState.get().getId();
            return null;
    }
}
