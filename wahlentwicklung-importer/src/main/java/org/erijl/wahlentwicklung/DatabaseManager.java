package org.erijl.wahlentwicklung;

import org.erijl.wahlentwicklung.enums.ConfigKeyEnum;
import org.erijl.wahlentwicklung.enums.ElectionEnum;
import org.erijl.wahlentwicklung.mapper.ConstituencyMapper;
import org.erijl.wahlentwicklung.mapper.PartyMapper;
import org.erijl.wahlentwicklung.mapper.StateMapper;
import org.erijl.wahlentwicklung.protos.builder.ConstituencyBuilder;
import org.erijl.wahlentwicklung.protos.builder.PartyBuilder;
import org.erijl.wahlentwicklung.protos.builder.StateBuilder;
import org.erijl.wahlentwicklung.protos.objects.*;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DatabaseManager {
    private static final String JDBC_CONNECTION_PATTERN = "jdbc:sqlite:";

    private final Config config;
    private final Connection sqliteConnection;

    public DatabaseManager() throws SQLException, IOException {
        this.config = Config.getInstance();
        this.dropOldDatabase();
        this.sqliteConnection = DriverManager.getConnection(JDBC_CONNECTION_PATTERN + config.getStringProperty(ConfigKeyEnum.DB_FILE_NAME));

        assert sqliteConnection != null;
        this.executeSQLFile("create_tables.sql");
        this.executeSQLFile("insert_default-data.sql");
    }

    public void insertElectionData(ElectionParser parser, ElectionEnum election) throws SQLException {
        insertElection(election);
        insertStates(parser.getStates());
        insertConstituencies(parser.getConstituencies());
        insertParties(parser.getParties());

        insertElectionBaseVotes(parser.getElectionBaseVotes());
        insertStateBaseVotes(parser.getStateBaseVotes());
        insertConstituencyVotesBase(parser.getConstituencyVotesBase());

        insertElectionPartyVotes(parser.getElectionPartyVotes());
        insertStatePartyVotes(parser.getStatePartyVotes());
        insertConstituencyPartyVotes(parser.getConstituencyPartyVotes());

        insertPartyMappings(parser.getParties());
        insertStateMappings(parser.getStates());
        insertConstituencyMappings(parser.getConstituencies());
    }

    public void insertElection(ElectionEnum electionEnum) throws SQLException {
        String sql = "INSERT INTO election (year) VALUES (?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            stmt.setInt(1, electionEnum.getYear());
            stmt.executeUpdate();
        }
    }

    private void insertStates(List<ElectionState> states) throws SQLException {
        String sql = "INSERT INTO election_state (election_year, row_id, name) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            sqliteConnection.setAutoCommit(false);
            for (ElectionState state : states) {
                stmt.setLong(1, state.getElectionYear());
                stmt.setLong(2, state.getRowId());
                stmt.setString(3, state.getName());
                stmt.addBatch();
            }
            stmt.executeBatch();
            sqliteConnection.commit();
        } finally {
            sqliteConnection.setAutoCommit(true);
        }
    }

    private void insertConstituencies(List<ElectionConstituency> constituencies) throws SQLException {
        String sql = "INSERT INTO election_constituency (election_year, state_id, row_id, name) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            sqliteConnection.setAutoCommit(false);
            for (ElectionConstituency constituency : constituencies) {
                stmt.setLong(1, constituency.getElectionYear());
                stmt.setLong(2, constituency.getStateId());
                stmt.setLong(3, constituency.getRowId());
                stmt.setString(4, constituency.getName());
                stmt.addBatch();
            }
            stmt.executeBatch();
            sqliteConnection.commit();
        } finally {
            sqliteConnection.setAutoCommit(true);
        }
    }

    private void insertParties(List<ElectionParty> parties) throws SQLException {
        String sql = "INSERT INTO election_party (election_year, column_index, name, seat_count) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            sqliteConnection.setAutoCommit(false);
            for (ElectionParty party : parties) {
                stmt.setLong(1, party.getElectionYear());
                stmt.setLong(2, party.getColumnIndex());
                stmt.setString(3, party.getName());
                stmt.setLong(4, party.getSeatCount());
                stmt.addBatch();
            }
            stmt.executeBatch();
            sqliteConnection.commit();
        } finally {
            sqliteConnection.setAutoCommit(true);
        }
    }

    private void insertElectionBaseVotes(ElectionVoteBase electionBaseVotes) throws SQLException {
        String sql = "INSERT INTO election_vote_base (election_year, eligiblevoters_primaryvote_preliminary, eligiblevoters_primaryvote_definitive, eligiblevoters_secondaryvote_preliminary, eligiblevoters_secondaryvote_definitive, actualvoters_primaryvote_preliminary, actualvoters_primaryvote_definitive, actualvoters_secondaryvote_preliminary, actualvoters_secondaryvote_definitive, validvoters_primaryvote_preliminary, validvoters_primaryvote_definitive, validvoters_secondaryvote_preliminary, validvoters_secondaryvote_definitive, invalidvoters_primaryvote_preliminary, invalidvoters_primaryvote_definitive, invalidvoters_secondaryvote_preliminary, invalidvoters_secondaryvote_definitive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            stmt.setLong(1, electionBaseVotes.getElectionYear());
            stmt.setLong(2, electionBaseVotes.getEligiblevotersPrimaryvotePreliminary());
            stmt.setLong(3, electionBaseVotes.getEligiblevotersPrimaryvoteDefinitive());
            stmt.setLong(4, electionBaseVotes.getEligiblevotersSecondaryvotePreliminary());
            stmt.setLong(5, electionBaseVotes.getEligiblevotersSecondaryvoteDefinitive());
            stmt.setLong(6, electionBaseVotes.getActualvotersPrimaryvotePreliminary());
            stmt.setLong(7, electionBaseVotes.getActualvotersPrimaryvoteDefinitive());
            stmt.setLong(8, electionBaseVotes.getActualvotersSecondaryvotePreliminary());
            stmt.setLong(9, electionBaseVotes.getActualvotersSecondaryvoteDefinitive());
            stmt.setLong(10, electionBaseVotes.getValidvotersPrimaryvotePreliminary());
            stmt.setLong(11, electionBaseVotes.getValidvotersPrimaryvoteDefinitive());
            stmt.setLong(12, electionBaseVotes.getValidvotersSecondaryvotePreliminary());
            stmt.setLong(13, electionBaseVotes.getValidvotersSecondaryvoteDefinitive());
            stmt.setLong(14, electionBaseVotes.getInvalidvotersPrimaryvotePreliminary());
            stmt.setLong(15, electionBaseVotes.getInvalidvotersPrimaryvoteDefinitive());
            stmt.setLong(16, electionBaseVotes.getInvalidvotersSecondaryvotePreliminary());
            stmt.setLong(17, electionBaseVotes.getInvalidvotersSecondaryvoteDefinitive());
            stmt.executeUpdate();
        }
    }

    private void insertStateBaseVotes(List<StateVoteBase> stateBaseVotes) throws SQLException {
        String sql = "INSERT INTO state_vote_base (election_year, state_id, eligiblevoters_primaryvote_preliminary, eligiblevoters_primaryvote_definitive, eligiblevoters_secondaryvote_preliminary, eligiblevoters_secondaryvote_definitive, actualvoters_primaryvote_preliminary, actualvoters_primaryvote_definitive, actualvoters_secondaryvote_preliminary, actualvoters_secondaryvote_definitive, validvoters_primaryvote_preliminary, validvoters_primaryvote_definitive, validvoters_secondaryvote_preliminary, validvoters_secondaryvote_definitive, invalidvoters_primaryvote_preliminary, invalidvoters_primaryvote_definitive, invalidvoters_secondaryvote_preliminary, invalidvoters_secondaryvote_definitive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            sqliteConnection.setAutoCommit(false);
            for (StateVoteBase stateVoteBase : stateBaseVotes) {
                stmt.setLong(1, stateVoteBase.getElectionYear());
                stmt.setLong(2, stateVoteBase.getStateId());
                stmt.setLong(3, stateVoteBase.getEligiblevotersPrimaryvotePreliminary());
                stmt.setLong(4, stateVoteBase.getEligiblevotersPrimaryvoteDefinitive());
                stmt.setLong(5, stateVoteBase.getEligiblevotersSecondaryvotePreliminary());
                stmt.setLong(6, stateVoteBase.getEligiblevotersSecondaryvoteDefinitive());
                stmt.setLong(7, stateVoteBase.getActualvotersPrimaryvotePreliminary());
                stmt.setLong(8, stateVoteBase.getActualvotersPrimaryvoteDefinitive());
                stmt.setLong(9, stateVoteBase.getActualvotersSecondaryvotePreliminary());
                stmt.setLong(10, stateVoteBase.getActualvotersSecondaryvoteDefinitive());
                stmt.setLong(11, stateVoteBase.getValidvotersPrimaryvotePreliminary());
                stmt.setLong(12, stateVoteBase.getValidvotersPrimaryvoteDefinitive());
                stmt.setLong(13, stateVoteBase.getValidvotersSecondaryvotePreliminary());
                stmt.setLong(14, stateVoteBase.getValidvotersSecondaryvoteDefinitive());
                stmt.setLong(15, stateVoteBase.getInvalidvotersPrimaryvotePreliminary());
                stmt.setLong(16, stateVoteBase.getInvalidvotersPrimaryvoteDefinitive());
                stmt.setLong(17, stateVoteBase.getInvalidvotersSecondaryvotePreliminary());
                stmt.setLong(18, stateVoteBase.getInvalidvotersSecondaryvoteDefinitive());
                stmt.addBatch();
            }
            stmt.executeBatch();
            sqliteConnection.commit();
        } finally {
            sqliteConnection.setAutoCommit(true);
        }
    }

    private void insertConstituencyVotesBase(List<ConstituencyVoteBase> constituencyVotesBase) throws SQLException {
        String sql = "INSERT INTO constituency_vote_base (election_year, state_id, constituency_id, eligiblevoters_primaryvote_preliminary, eligiblevoters_primaryvote_definitive, eligiblevoters_secondaryvote_preliminary, eligiblevoters_secondaryvote_definitive, actualvoters_primaryvote_preliminary, actualvoters_primaryvote_definitive, actualvoters_secondaryvote_preliminary, actualvoters_secondaryvote_definitive, validvoters_primaryvote_preliminary, validvoters_primaryvote_definitive, validvoters_secondaryvote_preliminary, validvoters_secondaryvote_definitive, invalidvoters_primaryvote_preliminary, invalidvoters_primaryvote_definitive, invalidvoters_secondaryvote_preliminary, invalidvoters_secondaryvote_definitive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            sqliteConnection.setAutoCommit(false);
            for (ConstituencyVoteBase constituencyVoteBase : constituencyVotesBase) {
                stmt.setLong(1, constituencyVoteBase.getElectionYear());
                stmt.setLong(2, constituencyVoteBase.getStateId());
                stmt.setLong(3, constituencyVoteBase.getConstituencyId());
                stmt.setLong(4, constituencyVoteBase.getEligiblevotersPrimaryvotePreliminary());
                stmt.setLong(5, constituencyVoteBase.getEligiblevotersPrimaryvoteDefinitive());
                stmt.setLong(6, constituencyVoteBase.getEligiblevotersSecondaryvotePreliminary());
                stmt.setLong(7, constituencyVoteBase.getEligiblevotersSecondaryvoteDefinitive());
                stmt.setLong(8, constituencyVoteBase.getActualvotersPrimaryvotePreliminary());
                stmt.setLong(9, constituencyVoteBase.getActualvotersPrimaryvoteDefinitive());
                stmt.setLong(10, constituencyVoteBase.getActualvotersSecondaryvotePreliminary());
                stmt.setLong(11, constituencyVoteBase.getActualvotersSecondaryvoteDefinitive());
                stmt.setLong(12, constituencyVoteBase.getValidvotersPrimaryvotePreliminary());
                stmt.setLong(13, constituencyVoteBase.getValidvotersPrimaryvoteDefinitive());
                stmt.setLong(14, constituencyVoteBase.getValidvotersSecondaryvotePreliminary());
                stmt.setLong(15, constituencyVoteBase.getValidvotersSecondaryvoteDefinitive());
                stmt.setLong(16, constituencyVoteBase.getInvalidvotersPrimaryvotePreliminary());
                stmt.setLong(17, constituencyVoteBase.getInvalidvotersPrimaryvoteDefinitive());
                stmt.setLong(18, constituencyVoteBase.getInvalidvotersSecondaryvotePreliminary());
                stmt.setLong(19, constituencyVoteBase.getInvalidvotersSecondaryvoteDefinitive());
                stmt.addBatch();
            }
            stmt.executeBatch();
            sqliteConnection.commit();
        } finally {
            sqliteConnection.setAutoCommit(false);
        }
    }

    private void insertElectionPartyVotes(List<ElectionVoteParty> electionPartyVotes) throws SQLException {
        String sql = "INSERT INTO election_vote_party (election_year, party_id, primaryvote_preliminary, primaryvote_definitive, secondaryvote_preliminary, secondaryvote_definitive) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            sqliteConnection.setAutoCommit(false);
            for (ElectionVoteParty electionVoteParty : electionPartyVotes) {
                stmt.setLong(1, electionVoteParty.getElectionYear());
                stmt.setLong(2, electionVoteParty.getPartyId());
                stmt.setLong(3, electionVoteParty.getPrimaryvotePreliminary());
                stmt.setLong(4, electionVoteParty.getPrimaryvoteDefinitive());
                stmt.setLong(5, electionVoteParty.getSecondaryvotePreliminary());
                stmt.setLong(6, electionVoteParty.getSecondaryvoteDefinitive());
                stmt.addBatch();
            }
            stmt.executeBatch();
            sqliteConnection.commit();
        } finally {
            sqliteConnection.setAutoCommit(true);
        }
    }

    private void insertStatePartyVotes(List<StateVoteParty> statePartyVotes) throws SQLException {
        String sql = "INSERT INTO state_vote_party (election_year, party_id, state_id, primaryvote_preliminary, primaryvote_definitive, secondaryvote_preliminary, secondaryvote_definitive) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            sqliteConnection.setAutoCommit(false);
            for (StateVoteParty stateVoteParty : statePartyVotes) {
                stmt.setLong(1, stateVoteParty.getElectionYear());
                stmt.setLong(2, stateVoteParty.getPartyId());
                stmt.setLong(3, stateVoteParty.getStateId());
                stmt.setLong(4, stateVoteParty.getPrimaryvotePreliminary());
                stmt.setLong(5, stateVoteParty.getPrimaryvoteDefinitive());
                stmt.setLong(6, stateVoteParty.getSecondaryvotePreliminary());
                stmt.setLong(7, stateVoteParty.getSecondaryvoteDefinitive());
                stmt.addBatch();
            }
            stmt.executeBatch();
            sqliteConnection.commit();
        } finally {
            sqliteConnection.setAutoCommit(true);
        }
    }

    private void insertConstituencyPartyVotes(List<ConstituencyVoteParty> constituencyPartyVotes) throws SQLException {
        String sql = "INSERT INTO constituency_vote_party (election_year, party_id, state_id, constituency_id, primaryvote_preliminary, primaryvote_definitive, secondaryvote_preliminary, secondaryvote_definitive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            sqliteConnection.setAutoCommit(false);
            for (ConstituencyVoteParty constituencyVoteParty : constituencyPartyVotes) {
                stmt.setLong(1, constituencyVoteParty.getElectionYear());
                stmt.setLong(2, constituencyVoteParty.getPartyId());
                stmt.setLong(3, constituencyVoteParty.getStateId());
                stmt.setLong(4, constituencyVoteParty.getConstituencyId());
                stmt.setLong(5, constituencyVoteParty.getPrimaryvotePreliminary());
                stmt.setLong(6, constituencyVoteParty.getPrimaryvoteDefinitive());
                stmt.setLong(7, constituencyVoteParty.getSecondaryvotePreliminary());
                stmt.setLong(8, constituencyVoteParty.getSecondaryvoteDefinitive());
                stmt.addBatch();
            }
            stmt.executeBatch();
            sqliteConnection.commit();
        } finally {
            sqliteConnection.setAutoCommit(true);
        }
    }

    private void insertStateMappings(List<ElectionState> states) throws SQLException {
        String sql = "INSERT INTO state_mapping (state_id, election_year, row_id) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            sqliteConnection.setAutoCommit(false);
            for (ElectionState state : states) {
                stmt.setObject(1, StateMapper.tryMap(state, this), Types.INTEGER);
                stmt.setLong(2, state.getElectionYear());
                stmt.setLong(3, state.getRowId());
                stmt.addBatch();
            }
            stmt.executeBatch();
            sqliteConnection.commit();
        } finally {
            sqliteConnection.setAutoCommit(true);
        }
    }

    private void insertConstituencyMappings(List<ElectionConstituency> constituencies) throws SQLException {
        String sql = "INSERT INTO constituency_mapping (constituency_id, election_state_id, election_year, row_id) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            sqliteConnection.setAutoCommit(false);
            for (ElectionConstituency constituency : constituencies) {
                stmt.setObject(1, ConstituencyMapper.tryMap(constituency, this), Types.INTEGER);
                stmt.setLong(2, constituency.getStateId());
                stmt.setLong(3, constituency.getElectionYear());
                stmt.setLong(4, constituency.getRowId());
                stmt.addBatch();
            }
            stmt.executeBatch();
            sqliteConnection.commit();
        } finally {
            sqliteConnection.setAutoCommit(true);
        }
    }

    private void insertPartyMappings(List<ElectionParty> parties) throws SQLException {
        String sql = "INSERT INTO party_mapping (party_id, election_year, column_index) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            sqliteConnection.setAutoCommit(false);
            for (ElectionParty party : parties) {
                stmt.setObject(1, PartyMapper.tryMap(party, this), Types.INTEGER);
                stmt.setLong(2, party.getElectionYear());
                stmt.setLong(3, party.getColumnIndex());
                stmt.addBatch();
            }
            stmt.executeBatch();
            sqliteConnection.commit();
        } finally {
            sqliteConnection.setAutoCommit(true);
        }
    }

    public List<Party> getAllParties() throws SQLException {
        List<Party> parties = new ArrayList<>();
        String sql = "SELECT id, name, abbreviation, color FROM party";
        try (Statement stmt = sqliteConnection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                parties.add(PartyBuilder.buildParty(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("abbreviation"),
                        rs.getString("color")
                ));
            }
        }
        return parties;
    }

    public List<State> getAllStates() throws SQLException {
        List<State> states = new ArrayList<>();
        String sql = "SELECT id, name FROM state";
        try (Statement stmt = sqliteConnection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                states.add(StateBuilder.buildState(
                        rs.getInt("id"),
                        rs.getString("name")
                ));
            }
        }
        return states;
    }

    public List<Constituency> getAllConstituencies() throws SQLException {
        List<Constituency> constituencies = new ArrayList<>();
        String sql = "SELECT id, state_id, name FROM constituency";
        try (Statement stmt = sqliteConnection.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                constituencies.add(ConstituencyBuilder.buildConstituency(
                        rs.getInt("id"),
                        rs.getInt("state_id"),
                        rs.getString("name")
                ));
            }
        }
        return constituencies;
    }

    private void executeSQLFile(String fileName) throws SQLException, IOException {
        URL databaseFile = Main.class.getClassLoader().getResource(fileName);
        assert databaseFile != null;

        Statement createTableStatement = this.sqliteConnection.createStatement();

        String sql = readSqlFile(databaseFile.getPath().replace("%20", " "));
        createTableStatement.executeUpdate(sql);
    }

    private void dropOldDatabase() {
        File existingDbFile = new File(System.getProperty("user.dir") + "\\" + config.getStringProperty(ConfigKeyEnum.DB_FILE_NAME));
        assert !existingDbFile.exists() || existingDbFile.delete();
    }

    private static String readSqlFile(String filePath) throws IOException {
        StringBuilder sql = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                sql.append(line).append("\n");
            }
        }
        return sql.toString();
    }
}
