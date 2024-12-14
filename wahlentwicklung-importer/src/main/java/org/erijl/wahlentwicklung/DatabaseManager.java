package org.erijl.wahlentwicklung;

import org.erijl.wahlentwicklung.enums.ConfigKeyEnum;
import org.erijl.wahlentwicklung.enums.ElectionEnum;
import org.erijl.wahlentwicklung.protos.objects.*;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.sql.*;
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
        this.createTables();
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
            for (ElectionState state : states) {
                stmt.setLong(1, state.getElectionYear());
                stmt.setLong(2, state.getRowId());
                stmt.setString(3, state.getName());
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    private void insertConstituencies(List<ElectionConstituency> constituencies) throws SQLException {
        String sql = "INSERT INTO election_constituency (election_year, state_id, row_id, name) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            for (ElectionConstituency constituency : constituencies) {
                stmt.setLong(1, constituency.getElectionYear());
                stmt.setLong(2, constituency.getStateId());
                stmt.setLong(3, constituency.getRowId());
                stmt.setString(4, constituency.getName());
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    private void insertParties(List<ElectionParty> parties) throws SQLException {
        String sql = "INSERT INTO election_party (election_year, column_index, name) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            for (ElectionParty party : parties) {
                stmt.setLong(1, party.getElectionYear());
                stmt.setLong(2, party.getColumnIndex());
                stmt.setString(3, party.getName());
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    private void insertElectionBaseVotes(ElectionVoteBase electionBaseVotes) throws SQLException {
        String sql = "INSERT INTO election_vote_base (election_year, eligiblevoters_primaryvote_preliminary, eligiblevoters_primaryvote_definitiv, eligiblevoters_secondaryvote_preliminary, eligiblevoters_secondarybote_definitive, actualvoters_primaryvote_preliminary, actualvoters_primaryvote_definitiv, actualvoters_secondaryvote_preliminary, actualvoters_secondarybote_definitive, validvoters_primaryvote_preliminary, validvoters_primaryvote_definitiv, validvoters_secondaryvote_preliminary, validvoters_secondarybote_definitive, invalidvoters_primaryvote_preliminary, invalidvoters_primaryvote_definitiv, invalidvoters_secondaryvote_preliminary, invalidvoters_secondarybote_definitive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            stmt.setLong(1, electionBaseVotes.getElectionYear());
            stmt.setLong(2, electionBaseVotes.getEligiblevotersPrimaryvotePreliminary());
            stmt.setLong(3, electionBaseVotes.getEligiblevotersPrimaryvoteDefinitiv());
            stmt.setLong(4, electionBaseVotes.getEligiblevotersSecondaryvotePreliminary());
            stmt.setLong(5, electionBaseVotes.getEligiblevotersSecondaryboteDefinitive());
            stmt.setLong(6, electionBaseVotes.getActualvotersPrimaryvotePreliminary());
            stmt.setLong(7, electionBaseVotes.getActualvotersPrimaryvoteDefinitiv());
            stmt.setLong(8, electionBaseVotes.getActualvotersSecondaryvotePreliminary());
            stmt.setLong(9, electionBaseVotes.getActualvotersSecondaryboteDefinitive());
            stmt.setLong(10, electionBaseVotes.getValidvotersPrimaryvotePreliminary());
            stmt.setLong(11, electionBaseVotes.getValidvotersPrimaryvoteDefinitiv());
            stmt.setLong(12, electionBaseVotes.getValidvotersSecondaryvotePreliminary());
            stmt.setLong(13, electionBaseVotes.getValidvotersSecondaryboteDefinitive());
            stmt.setLong(14, electionBaseVotes.getInvalidvotersPrimaryvotePreliminary());
            stmt.setLong(15, electionBaseVotes.getInvalidvotersPrimaryvoteDefinitiv());
            stmt.setLong(16, electionBaseVotes.getInvalidvotersSecondaryvotePreliminary());
            stmt.setLong(17, electionBaseVotes.getInvalidvotersSecondaryboteDefinitive());
            stmt.executeUpdate();
        }
    }

    private void insertStateBaseVotes(List<StateVoteBase> stateBaseVotes) throws SQLException {
        String sql = "INSERT INTO state_vote_base (election_year, state_id, eligiblevoters_primaryvote_preliminary, eligiblevoters_primaryvote_definitiv, eligiblevoters_secondaryvote_preliminary, eligiblevoters_secondarybote_definitive, actualvoters_primaryvote_preliminary, actualvoters_primaryvote_definitiv, actualvoters_secondaryvote_preliminary, actualvoters_secondarybote_definitive, validvoters_primaryvote_preliminary, validvoters_primaryvote_definitiv, validvoters_secondaryvote_preliminary, validvoters_secondarybote_definitive, invalidvoters_primaryvote_preliminary, invalidvoters_primaryvote_definitiv, invalidvoters_secondaryvote_preliminary, invalidvoters_secondarybote_definitive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            for (StateVoteBase stateVoteBase : stateBaseVotes) {
                stmt.setLong(1, stateVoteBase.getElectionYear());
                stmt.setLong(2, stateVoteBase.getStateId());
                stmt.setLong(3, stateVoteBase.getEligiblevotersPrimaryvotePreliminary());
                stmt.setLong(4, stateVoteBase.getEligiblevotersPrimaryvoteDefinitiv());
                stmt.setLong(5, stateVoteBase.getEligiblevotersSecondaryvotePreliminary());
                stmt.setLong(6, stateVoteBase.getEligiblevotersSecondaryboteDefinitive());
                stmt.setLong(7, stateVoteBase.getActualvotersPrimaryvotePreliminary());
                stmt.setLong(8, stateVoteBase.getActualvotersPrimaryvoteDefinitiv());
                stmt.setLong(9, stateVoteBase.getActualvotersSecondaryvotePreliminary());
                stmt.setLong(10, stateVoteBase.getActualvotersSecondaryboteDefinitive());
                stmt.setLong(11, stateVoteBase.getValidvotersPrimaryvotePreliminary());
                stmt.setLong(12, stateVoteBase.getValidvotersPrimaryvoteDefinitiv());
                stmt.setLong(13, stateVoteBase.getValidvotersSecondaryvotePreliminary());
                stmt.setLong(14, stateVoteBase.getValidvotersSecondaryboteDefinitive());
                stmt.setLong(15, stateVoteBase.getInvalidvotersPrimaryvotePreliminary());
                stmt.setLong(16, stateVoteBase.getInvalidvotersPrimaryvoteDefinitiv());
                stmt.setLong(17, stateVoteBase.getInvalidvotersSecondaryvotePreliminary());
                stmt.setLong(18, stateVoteBase.getInvalidvotersSecondaryboteDefinitive());
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    private void insertConstituencyVotesBase(List<ConstituencyVoteBase> constituencyVotesBase) throws SQLException {
        String sql = "INSERT INTO constituency_vote_base (election_year, state_id, constituency_id, eligiblevoters_primaryvote_preliminary, eligiblevoters_primaryvote_definitiv, eligiblevoters_secondaryvote_preliminary, eligiblevoters_secondarybote_definitive, actualvoters_primaryvote_preliminary, actualvoters_primaryvote_definitiv, actualvoters_secondaryvote_preliminary, actualvoters_secondarybote_definitive, validvoters_primaryvote_preliminary, validvoters_primaryvote_definitiv, validvoters_secondaryvote_preliminary, validvoters_secondarybote_definitive, invalidvoters_primaryvote_preliminary, invalidvoters_primaryvote_definitiv, invalidvoters_secondaryvote_preliminary, invalidvoters_secondarybote_definitive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            for (ConstituencyVoteBase constituencyVoteBase : constituencyVotesBase) {
                stmt.setLong(1, constituencyVoteBase.getElectionYear());
                stmt.setLong(2, constituencyVoteBase.getStateId());
                stmt.setLong(3, constituencyVoteBase.getConstituencyId());
                stmt.setLong(4, constituencyVoteBase.getEligiblevotersPrimaryvotePreliminary());
                stmt.setLong(5, constituencyVoteBase.getEligiblevotersPrimaryvoteDefinitiv());
                stmt.setLong(6, constituencyVoteBase.getEligiblevotersSecondaryvotePreliminary());
                stmt.setLong(7, constituencyVoteBase.getEligiblevotersSecondaryboteDefinitive());
                stmt.setLong(8, constituencyVoteBase.getActualvotersPrimaryvotePreliminary());
                stmt.setLong(9, constituencyVoteBase.getActualvotersPrimaryvoteDefinitiv());
                stmt.setLong(10, constituencyVoteBase.getActualvotersSecondaryvotePreliminary());
                stmt.setLong(11, constituencyVoteBase.getActualvotersSecondaryboteDefinitive());
                stmt.setLong(12, constituencyVoteBase.getValidvotersPrimaryvotePreliminary());
                stmt.setLong(13, constituencyVoteBase.getValidvotersPrimaryvoteDefinitiv());
                stmt.setLong(14, constituencyVoteBase.getValidvotersSecondaryvotePreliminary());
                stmt.setLong(15, constituencyVoteBase.getValidvotersSecondaryboteDefinitive());
                stmt.setLong(16, constituencyVoteBase.getInvalidvotersPrimaryvotePreliminary());
                stmt.setLong(17, constituencyVoteBase.getInvalidvotersPrimaryvoteDefinitiv());
                stmt.setLong(18, constituencyVoteBase.getInvalidvotersSecondaryvotePreliminary());
                stmt.setLong(19, constituencyVoteBase.getInvalidvotersSecondaryboteDefinitive());
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    private void insertElectionPartyVotes(List<ElectionVoteParty> electionPartyVotes) throws SQLException {
        String sql = "INSERT INTO election_vote_party (election_year, party_id, primaryvote_preliminary, primaryvote_definitiv, secondaryvote_preliminary, secondaryvote_definitiv) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            for (ElectionVoteParty electionVoteParty : electionPartyVotes) {
                stmt.setLong(1, electionVoteParty.getElectionYear());
                stmt.setLong(2, electionVoteParty.getPartyId());
                stmt.setLong(3, electionVoteParty.getPrimaryvotePreliminary());
                stmt.setLong(4, electionVoteParty.getPrimaryvoteDefinitiv());
                stmt.setLong(5, electionVoteParty.getSecondaryvotePreliminary());
                stmt.setLong(6, electionVoteParty.getSecondaryvoteDefinitiv());
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    private void insertStatePartyVotes(List<StateVoteParty> statePartyVotes) throws SQLException {
        String sql = "INSERT INTO state_vote_party (election_year, party_id, state_id, primaryvote_preliminary, primaryvote_definitiv, secondaryvote_preliminary, secondaryvote_definitiv) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            for (StateVoteParty stateVoteParty : statePartyVotes) {
                stmt.setLong(1, stateVoteParty.getElectionYear());
                stmt.setLong(2, stateVoteParty.getPartyId());
                stmt.setLong(3, stateVoteParty.getStateId());
                stmt.setLong(4, stateVoteParty.getPrimaryvotePreliminary());
                stmt.setLong(5, stateVoteParty.getPrimaryvoteDefinitiv());
                stmt.setLong(6, stateVoteParty.getSecondaryvotePreliminary());
                stmt.setLong(7, stateVoteParty.getSecondaryvoteDefinitiv());
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    private void insertConstituencyPartyVotes(List<ConstituencyVoteParty> constituencyPartyVotes) throws SQLException {
        String sql = "INSERT INTO constituency_vote_party (election_year, party_id, state_id, constituency_id, primaryvote_preliminary, primaryvote_definitiv, secondaryvote_preliminary, secondaryvote_definitiv) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = sqliteConnection.prepareStatement(sql)) {
            for (ConstituencyVoteParty constituencyVoteParty : constituencyPartyVotes) {
                stmt.setLong(1, constituencyVoteParty.getElectionYear());
                stmt.setLong(2, constituencyVoteParty.getPartyId());
                stmt.setLong(3, constituencyVoteParty.getStateId());
                stmt.setLong(4, constituencyVoteParty.getConstituencyId());
                stmt.setLong(5, constituencyVoteParty.getPrimaryvotePreliminary());
                stmt.setLong(6, constituencyVoteParty.getPrimaryvoteDefinitiv());
                stmt.setLong(7, constituencyVoteParty.getSecondaryvotePreliminary());
                stmt.setLong(8, constituencyVoteParty.getSecondaryvoteDefinitiv());
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }


    private void createTables() throws SQLException, IOException {
        URL databaseFile = Main.class.getClassLoader().getResource("create_tables.sql");
        assert databaseFile != null;

        Statement createTableStatement = this.sqliteConnection.createStatement();

        String sql = readSqlFile(databaseFile.getPath());
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
