package org.erijl.wahlentwicklung.statistics;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Resolves the source files' label vocabulary against the seeded dimension
 * tables. Every resolver hard-fails on unknown labels — an unknown party
 * label or Land code means either a new source variant or a typo, and both
 * must surface at import time, not as silently dropped data.
 */
public class StatLookups {

    /**
     * A resolved party label: the stat_party id plus whether the label was a
     * nachrichtlich "dar. X" memo column (subset of Sonstige, non-additive).
     */
    public record PartyRef(long statPartyId, boolean memo) {
    }

    private static final String MEMO_PREFIX = "dar. ";

    private final Map<String, Long> partyAliases = new HashMap<>();
    private final Map<String, Integer> stateAbbreviations = new HashMap<>();
    private final Map<String, Integer> ageGroups = new HashMap<>();

    public StatLookups(Connection connection) throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            try (ResultSet rs = stmt.executeQuery("SELECT alias, stat_party_id FROM stat_party_alias")) {
                while (rs.next()) {
                    partyAliases.put(rs.getString(1), rs.getLong(2));
                }
            }
            try (ResultSet rs = stmt.executeQuery("SELECT abbreviation, id FROM state")) {
                while (rs.next()) {
                    stateAbbreviations.put(rs.getString(1), rs.getInt(2));
                }
            }
            try (ResultSet rs = stmt.executeQuery("SELECT label, id FROM age_group")) {
                while (rs.next()) {
                    ageGroups.put(rs.getString(1), rs.getInt(2));
                }
            }
        }
        assert !partyAliases.isEmpty() && stateAbbreviations.size() == 16 && !ageGroups.isEmpty();
    }

    public PartyRef party(String label) {
        String normalized = CsvFile.normalize(label);
        boolean memo = normalized.startsWith(MEMO_PREFIX);
        if (memo) {
            normalized = normalized.substring(MEMO_PREFIX.length()).trim();
        }
        Long id = partyAliases.get(normalized);
        assert id != null : "unknown party label: '" + normalized + "'";
        return new PartyRef(id, memo);
    }

    /**
     * Canonical state id for a Land code, or null for 'Bund'/'BE-O'/'BE-W'.
     */
    public Integer stateId(String landCode) {
        String code = CsvFile.normalize(landCode);
        if (code.equals("Bund") || code.equals("BE-O") || code.equals("BE-W")) {
            return null;
        }
        Integer id = stateAbbreviations.get(code);
        assert id != null : "unknown Land code: '" + code + "'";
        return id;
    }

    /**
     * total | m | w — 'm|d|o' (2021+) collapses to m, documented in gender.note.
     */
    public String gender(String label) {
        String s = CsvFile.normalize(label);
        return switch (s) {
            case "Summe" -> "total";
            case "m", "m|d|o" -> "m";
            case "w" -> "w";
            default -> throw new IllegalArgumentException("unknown gender label: '" + s + "'");
        };
    }

    public int ageGroup(String label) {
        String s = CsvFile.normalize(label);
        if (s.equals("Summe")) {
            s = "total";
        }
        Integer id = ageGroups.get(s);
        assert id != null : "unknown age group label: '" + s + "'";
        return id;
    }

    /**
     * Per-election birth-cohort registry: labels differ per year and file
     * ("1947 und früher", "1952 – 1961", "&lt;=1955", "2005-2007"); ids are
     * assigned in first-seen order, 0 is always the total row.
     */
    public static class CohortRegistry {
        private final long electionYear;
        private final Map<String, Long> idsByLabel = new HashMap<>();

        public CohortRegistry(long electionYear) {
            this.electionYear = electionYear;
            idsByLabel.put("total", 0L);
        }

        public long resolve(String label) {
            String s = CsvFile.normalize(label);
            if (s.equals("Summe")) {
                s = "total";
            }
            return idsByLabel.computeIfAbsent(s, key -> (long) idsByLabel.size());
        }

        /**
         * All registered cohorts as proto rows (bounds parsed from the label:
         * every 4-digit number contributes; "und früher"/"&lt;=" mean open lower bound).
         */
        public java.util.List<org.erijl.wahlentwicklung.protos.objects.BirthCohort> toRows() {
            java.util.List<org.erijl.wahlentwicklung.protos.objects.BirthCohort> rows = new java.util.ArrayList<>();
            idsByLabel.forEach((label, id) -> {
                var builder = org.erijl.wahlentwicklung.protos.objects.BirthCohort.newBuilder()
                        .setElectionYear(electionYear)
                        .setId(id)
                        .setLabel(label);
                if (!label.equals("total")) {
                    Matcher m = Pattern.compile("\\d{4}").matcher(label);
                    java.util.List<Integer> years = new java.util.ArrayList<>();
                    while (m.find()) {
                        years.add(Integer.parseInt(m.group()));
                    }
                    assert !years.isEmpty() : "unparseable cohort label: " + label;
                    boolean openLower = label.contains("früher") || label.contains("<=");
                    if (years.size() == 2) {
                        builder.setYearFrom(years.get(0)).setYearTo(years.get(1));
                    } else if (openLower) {
                        builder.setYearTo(years.get(0));
                    } else {
                        builder.setYearFrom(years.get(0));
                    }
                }
                rows.add(builder.build());
            });
            return rows;
        }
    }
}
