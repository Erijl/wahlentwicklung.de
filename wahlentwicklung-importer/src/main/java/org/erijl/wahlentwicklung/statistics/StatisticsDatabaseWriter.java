package org.erijl.wahlentwicklung.statistics;

import org.erijl.wahlentwicklung.protos.objects.*;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;

/**
 * Batch inserts for the statistics tables. Mirrors DatabaseManager's insert
 * style but with a shared batch helper — the statistics tables are narrow
 * long-form facts, a method per column list would triple the file.
 * proto3 optional fields (hasX()) map to SQL NULL.
 */
public class StatisticsDatabaseWriter {

    @FunctionalInterface
    interface Binder<T> {
        void bind(PreparedStatement stmt, T row) throws SQLException;
    }

    private final Connection connection;

    public StatisticsDatabaseWriter(Connection connection) {
        this.connection = connection;
    }

    private <T> void insertBatch(String sql, List<T> rows, Binder<T> binder) throws SQLException {
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            connection.setAutoCommit(false);
            for (T row : rows) {
                binder.bind(stmt, row);
                stmt.addBatch();
            }
            stmt.executeBatch();
            connection.commit();
        } finally {
            connection.setAutoCommit(true);
        }
    }

    private static Object nullable(boolean has, long value) {
        return has ? value : null;
    }

    private static Object nullable(boolean has, double value) {
        return has ? value : null;
    }

    public void writeZeitreihen(ZeitreihenParser parser) throws SQLException {
        insertBatch("INSERT INTO ts_age_turnout (year, gender, age_group_id, eligible, eligible_plain, eligible_wahlschein, voters, turnout_pct) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                parser.ageTurnout, (stmt, r) -> {
                    stmt.setLong(1, r.getYear());
                    stmt.setString(2, r.getGender());
                    stmt.setLong(3, r.getAgeGroupId());
                    stmt.setObject(4, nullable(r.hasEligible(), r.getEligible()), Types.INTEGER);
                    stmt.setObject(5, nullable(r.hasEligiblePlain(), r.getEligiblePlain()), Types.INTEGER);
                    stmt.setObject(6, nullable(r.hasEligibleWahlschein(), r.getEligibleWahlschein()), Types.INTEGER);
                    stmt.setObject(7, nullable(r.hasVoters(), r.getVoters()), Types.INTEGER);
                    stmt.setObject(8, nullable(r.hasTurnoutPct(), r.getTurnoutPct()), Types.REAL);
                });
        insertBatch("INSERT INTO ts_age_vote_share (year, gender, age_group_id, stat_party_id, share_pct) VALUES (?, ?, ?, ?, ?)",
                parser.ageVoteShares, (stmt, r) -> {
                    stmt.setLong(1, r.getYear());
                    stmt.setString(2, r.getGender());
                    stmt.setLong(3, r.getAgeGroupId());
                    stmt.setLong(4, r.getStatPartyId());
                    stmt.setDouble(5, r.getSharePct());
                });
        insertBatch("INSERT INTO ts_absentee (year, land_code, state_id, eligible, eligible_plain, eligible_sperrvermerk, voters, voters_plain, voters_simple_ws, voters_brief) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                parser.absentee, (stmt, r) -> {
                    stmt.setLong(1, r.getYear());
                    stmt.setString(2, r.getLandCode());
                    stmt.setObject(3, nullable(r.hasStateId(), r.getStateId()), Types.INTEGER);
                    stmt.setObject(4, nullable(r.hasEligible(), r.getEligible()), Types.INTEGER);
                    stmt.setObject(5, nullable(r.hasEligiblePlain(), r.getEligiblePlain()), Types.INTEGER);
                    stmt.setObject(6, nullable(r.hasEligibleSperrvermerk(), r.getEligibleSperrvermerk()), Types.INTEGER);
                    stmt.setObject(7, nullable(r.hasVoters(), r.getVoters()), Types.INTEGER);
                    stmt.setObject(8, nullable(r.hasVotersPlain(), r.getVotersPlain()), Types.INTEGER);
                    stmt.setObject(9, nullable(r.hasVotersSimpleWs(), r.getVotersSimpleWs()), Types.INTEGER);
                    stmt.setObject(10, nullable(r.hasVotersBrief(), r.getVotersBrief()), Types.INTEGER);
                });
        insertBatch("INSERT INTO ts_ballot_base (year, land_code, state_id, ballot_type, voters, invalid, valid) VALUES (?, ?, ?, ?, ?, ?, ?)",
                parser.ballotBase, (stmt, r) -> {
                    stmt.setLong(1, r.getYear());
                    stmt.setString(2, r.getLandCode());
                    stmt.setObject(3, nullable(r.hasStateId(), r.getStateId()), Types.INTEGER);
                    stmt.setString(4, r.getBallotType());
                    stmt.setObject(5, nullable(r.hasVoters(), r.getVoters()), Types.INTEGER);
                    stmt.setObject(6, nullable(r.hasInvalid(), r.getInvalid()), Types.INTEGER);
                    stmt.setObject(7, nullable(r.hasValid(), r.getValid()), Types.INTEGER);
                });
        insertBatch("INSERT INTO ts_ballot_party (year, land_code, state_id, ballot_type, stat_party_id, votes) VALUES (?, ?, ?, ?, ?, ?)",
                parser.ballotParties, (stmt, r) -> {
                    stmt.setLong(1, r.getYear());
                    stmt.setString(2, r.getLandCode());
                    stmt.setObject(3, nullable(r.hasStateId(), r.getStateId()), Types.INTEGER);
                    stmt.setString(4, r.getBallotType());
                    stmt.setLong(5, r.getStatPartyId());
                    stmt.setLong(6, r.getVotes());
                });
    }

    public void writeRws(RwsParser parser) throws SQLException {
        insertBatch("INSERT INTO birth_cohort (election_year, id, label, year_from, year_to) VALUES (?, ?, ?, ?, ?)",
                parser.cohorts.toRows(), (stmt, r) -> {
                    stmt.setLong(1, r.getElectionYear());
                    stmt.setLong(2, r.getId());
                    stmt.setString(3, r.getLabel());
                    stmt.setObject(4, nullable(r.hasYearFrom(), r.getYearFrom()), Types.INTEGER);
                    stmt.setObject(5, nullable(r.hasYearTo(), r.getYearTo()), Types.INTEGER);
                });
        insertBatch("INSERT INTO rws_turnout (election_year, land_code, state_id, gender, cohort_id, eligible, eligible_plain, eligible_wahlschein, voters, voters_plain, voters_wahlschein, turnout_pct) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                parser.turnout, (stmt, r) -> {
                    stmt.setLong(1, r.getElectionYear());
                    stmt.setString(2, r.getLandCode());
                    stmt.setObject(3, nullable(r.hasStateId(), r.getStateId()), Types.INTEGER);
                    stmt.setString(4, r.getGender());
                    stmt.setLong(5, r.getCohortId());
                    stmt.setObject(6, nullable(r.hasEligible(), r.getEligible()), Types.INTEGER);
                    stmt.setObject(7, nullable(r.hasEligiblePlain(), r.getEligiblePlain()), Types.INTEGER);
                    stmt.setObject(8, nullable(r.hasEligibleWahlschein(), r.getEligibleWahlschein()), Types.INTEGER);
                    stmt.setObject(9, nullable(r.hasVoters(), r.getVoters()), Types.INTEGER);
                    stmt.setObject(10, nullable(r.hasVotersPlain(), r.getVotersPlain()), Types.INTEGER);
                    stmt.setObject(11, nullable(r.hasVotersWahlschein(), r.getVotersWahlschein()), Types.INTEGER);
                    stmt.setObject(12, nullable(r.hasTurnoutPct(), r.getTurnoutPct()), Types.REAL);
                });
        insertBatch("INSERT INTO rws_vote (election_year, land_code, state_id, vote_type, gender, cohort_id, stat_party_id, is_memo, votes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                parser.votes, (stmt, r) -> {
                    stmt.setLong(1, r.getElectionYear());
                    stmt.setString(2, r.getLandCode());
                    stmt.setObject(3, nullable(r.hasStateId(), r.getStateId()), Types.INTEGER);
                    stmt.setInt(4, r.getVoteType());
                    stmt.setString(5, r.getGender());
                    stmt.setLong(6, r.getCohortId());
                    stmt.setLong(7, r.getStatPartyId());
                    stmt.setInt(8, r.getIsMemo());
                    stmt.setLong(9, r.getVotes());
                });
        insertBatch("INSERT INTO rws_vote_combo (election_year, land_code, state_id, gender, cohort_id, secondary_stat_party_id, secondary_is_memo, primary_stat_party_id, primary_is_memo, votes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                parser.combos, (stmt, r) -> {
                    stmt.setLong(1, r.getElectionYear());
                    stmt.setString(2, r.getLandCode());
                    stmt.setObject(3, nullable(r.hasStateId(), r.getStateId()), Types.INTEGER);
                    stmt.setString(4, r.getGender());
                    stmt.setLong(5, r.getCohortId());
                    stmt.setLong(6, r.getSecondaryStatPartyId());
                    stmt.setInt(7, r.getSecondaryIsMemo());
                    stmt.setLong(8, r.getPrimaryStatPartyId());
                    stmt.setInt(9, r.getPrimaryIsMemo());
                    stmt.setLong(10, r.getVotes());
                });
        insertBatch("INSERT INTO rws_ballot_vote (election_year, vote_type, ballot_type, gender, cohort_id, stat_party_id, is_memo, votes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                parser.ballotVotes, (stmt, r) -> {
                    stmt.setLong(1, r.getElectionYear());
                    stmt.setInt(2, r.getVoteType());
                    stmt.setString(3, r.getBallotType());
                    stmt.setString(4, r.getGender());
                    stmt.setLong(5, r.getCohortId());
                    stmt.setLong(6, r.getStatPartyId());
                    stmt.setInt(7, r.getIsMemo());
                    stmt.setLong(8, r.getVotes());
                });
    }

    public void writeBriefWkr(BriefWkrParser parser) throws SQLException {
        insertBatch("INSERT INTO constituency_ballot_vote_base (election_year, wkr_nr, ballot_type, eligible, voters, invalid_primary, valid_primary, invalid_secondary, valid_secondary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                parser.base, (stmt, r) -> {
                    stmt.setLong(1, r.getElectionYear());
                    stmt.setLong(2, r.getWkrNr());
                    stmt.setString(3, r.getBallotType());
                    stmt.setObject(4, nullable(r.hasEligible(), r.getEligible()), Types.INTEGER);
                    stmt.setObject(5, nullable(r.hasVoters(), r.getVoters()), Types.INTEGER);
                    stmt.setObject(6, nullable(r.hasInvalidPrimary(), r.getInvalidPrimary()), Types.INTEGER);
                    stmt.setObject(7, nullable(r.hasValidPrimary(), r.getValidPrimary()), Types.INTEGER);
                    stmt.setObject(8, nullable(r.hasInvalidSecondary(), r.getInvalidSecondary()), Types.INTEGER);
                    stmt.setObject(9, nullable(r.hasValidSecondary(), r.getValidSecondary()), Types.INTEGER);
                });
        insertBatch("INSERT INTO constituency_ballot_vote_party (election_year, wkr_nr, ballot_type, stat_party_id, primary_votes, secondary_votes) VALUES (?, ?, ?, ?, ?, ?)",
                parser.parties, (stmt, r) -> {
                    stmt.setLong(1, r.getElectionYear());
                    stmt.setLong(2, r.getWkrNr());
                    stmt.setString(3, r.getBallotType());
                    stmt.setLong(4, r.getStatPartyId());
                    stmt.setObject(5, nullable(r.hasPrimaryVotes(), r.getPrimaryVotes()), Types.INTEGER);
                    stmt.setObject(6, nullable(r.hasSecondaryVotes(), r.getSecondaryVotes()), Types.INTEGER);
                });
    }

    public void writeKreis(KreisParser parser) throws SQLException {
        insertBatch("INSERT INTO kreis (election_year, ags, name, state_id) VALUES (?, ?, ?, ?)",
                parser.kreise, (stmt, r) -> {
                    stmt.setLong(1, r.getElectionYear());
                    stmt.setString(2, r.getAgs());
                    stmt.setString(3, r.getName());
                    stmt.setLong(4, r.getStateId());
                });
        insertBatch("INSERT INTO kreis_vote_base (election_year, ags, eligible, voters, invalid_primary, valid_primary, invalid_secondary, valid_secondary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                parser.base, (stmt, r) -> {
                    stmt.setLong(1, r.getElectionYear());
                    stmt.setString(2, r.getAgs());
                    stmt.setObject(3, nullable(r.hasEligible(), r.getEligible()), Types.INTEGER);
                    stmt.setObject(4, nullable(r.hasVoters(), r.getVoters()), Types.INTEGER);
                    stmt.setObject(5, nullable(r.hasInvalidPrimary(), r.getInvalidPrimary()), Types.INTEGER);
                    stmt.setObject(6, nullable(r.hasValidPrimary(), r.getValidPrimary()), Types.INTEGER);
                    stmt.setObject(7, nullable(r.hasInvalidSecondary(), r.getInvalidSecondary()), Types.INTEGER);
                    stmt.setObject(8, nullable(r.hasValidSecondary(), r.getValidSecondary()), Types.INTEGER);
                });
        insertBatch("INSERT INTO kreis_vote_party (election_year, ags, stat_party_id, primary_votes, secondary_votes) VALUES (?, ?, ?, ?, ?)",
                parser.parties, (stmt, r) -> {
                    stmt.setLong(1, r.getElectionYear());
                    stmt.setString(2, r.getAgs());
                    stmt.setLong(3, r.getStatPartyId());
                    stmt.setObject(4, nullable(r.hasPrimaryVotes(), r.getPrimaryVotes()), Types.INTEGER);
                    stmt.setObject(5, nullable(r.hasSecondaryVotes(), r.getSecondaryVotes()), Types.INTEGER);
                });
    }

    public void writeStrukturdaten(StrukturdatenParser parser) throws SQLException {
        insertBatch("INSERT INTO structure_value (election_year, area_nr, indicator_id, value) VALUES (?, ?, ?, ?)",
                parser.values, (stmt, r) -> {
                    stmt.setLong(1, r.getElectionYear());
                    stmt.setLong(2, r.getAreaNr());
                    stmt.setLong(3, r.getIndicatorId());
                    stmt.setObject(4, nullable(r.hasValue(), r.getValue()), Types.REAL);
                });
    }
}
