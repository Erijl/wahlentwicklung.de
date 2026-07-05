package org.erijl.wahlentwicklung.statistics;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Cross-domain QA gates (docs/08 §4), run after all statistics inserts.
 * 2021 checks are reported instead of asserted: RWS 2021 covers the Hauptwahl
 * only, while brief_wkr/kreis 2021 include the Berlin 2024 rerun — whether
 * kerg-2021 in the DB matches either depends on which download it came from.
 */
public class StatisticsValidator {

    private final Connection connection;

    public StatisticsValidator(Connection connection) {
        this.connection = connection;
    }

    public void validate() throws SQLException {
        assertZero("""
                SELECT COUNT(*) FROM (
                    SELECT b.election_year, b.wkr_nr, SUM(b.voters) AS voters
                    FROM constituency_ballot_vote_base b GROUP BY 1, 2
                ) x
                JOIN constituency_vote_base k
                  ON k.election_year = x.election_year AND k.constituency_id = x.wkr_nr
                WHERE x.voters <> k.actualvoters_secondaryvote_definitive
                  AND x.election_year <> 2021
                """, "brief_wkr Urne+Brief Wählende == kerg per Wahlkreis");

        assertZero("""
                SELECT COUNT(*) FROM (
                    SELECT kv.election_year, k.state_id, SUM(kv.voters) AS voters
                    FROM kreis_vote_base kv JOIN kreis k
                      ON k.election_year = kv.election_year AND k.ags = kv.ags
                    GROUP BY 1, 2
                ) x
                JOIN state_vote_base s
                  ON s.election_year = x.election_year AND s.state_id = x.state_id + 900
                WHERE x.voters <> s.actualvoters_secondaryvote_definitive
                  AND x.election_year <> 2021
                """, "kreis Wählende == kerg per Land");

        assertZero("""
                SELECT COUNT(*) FROM rws_vote r
                JOIN election_vote_base e ON e.election_year = r.election_year
                WHERE r.land_code = 'Bund' AND r.gender = 'total' AND r.cohort_id = 0
                  AND r.stat_party_id = 1 AND r.is_memo = 0 AND r.vote_type = 2
                  AND r.election_year <> 2021
                  AND r.votes <> e.actualvoters_secondaryvote_definitive
                """, "RWS Bund total (kalibriert) == kerg Wählende");

        assertZero("""
                SELECT COUNT(*) FROM (
                    SELECT election_year, COUNT(DISTINCT area_nr) AS areas
                    FROM structure_value GROUP BY 1
                ) WHERE areas <> 316
                """, "Strukturdaten cover 299 WK + 16 Länder + Bund per year");

        report("""
                SELECT x.election_year || ' WK ' || x.wkr_nr || ': brief_wkr ' || x.voters || ' vs kerg ' || k.actualvoters_secondaryvote_definitive
                FROM (
                    SELECT b.election_year, b.wkr_nr, SUM(b.voters) AS voters
                    FROM constituency_ballot_vote_base b WHERE b.election_year = 2021 GROUP BY 1, 2
                ) x
                JOIN constituency_vote_base k
                  ON k.election_year = x.election_year AND k.constituency_id = x.wkr_nr
                WHERE x.voters <> k.actualvoters_secondaryvote_definitive
                """, "2021 brief_wkr vs kerg (informational, Berlin rerun)");

        report("""
                SELECT b.year || ' ' || b.land_code || ' ' || b.ballot_type || ': valid+invalid=' || (b.valid + b.invalid) || ' vs voters=' || b.voters
                FROM ts_ballot_base b
                WHERE b.valid IS NOT NULL AND b.invalid IS NOT NULL AND b.voters IS NOT NULL
                  AND b.valid + b.invalid <> b.voters
                """, "ab57 valid+invalid == voters (informational)");
    }

    private void assertZero(String sql, String gate) throws SQLException {
        try (Statement stmt = connection.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            rs.next();
            long violations = rs.getLong(1);
            assert violations == 0 : "QA gate failed (" + violations + " violations): " + gate;
            System.out.println("  [gate ok] " + gate);
        }
    }

    private void report(String sql, String label) throws SQLException {
        try (Statement stmt = connection.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            int count = 0;
            while (rs.next() && count < 5) {
                System.out.println("  [info] " + rs.getString(1));
                count++;
            }
            if (count == 0) {
                System.out.println("  [info] no deviations: " + label);
            }
        }
    }
}
