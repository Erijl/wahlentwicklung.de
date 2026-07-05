package org.erijl.wahlentwicklung.statistics;

import org.erijl.wahlentwicklung.protos.objects.StructureValue;

import java.nio.charset.Charset;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Parses one election's Strukturdaten CSV against the canonical indicator
 * catalog (insert_indicator-catalog.sql). Columns are matched by the file's
 * own Spalten-Nr. — the mapping row's source_label must equal the file's
 * column label, so catalog and file cannot drift apart silently.
 * area_nr rows: 1–299 Wahlkreis, 901–916 Land, 999 Bund (kerg convention).
 */
public class StrukturdatenParser {

    private final int year;
    private final Charset charset;
    /** column_no -> indicator_id */
    private final Map<Integer, Integer> columnIndicators = new HashMap<>();
    /** column_no -> expected source label */
    private final Map<Integer, String> columnLabels = new HashMap<>();

    final List<StructureValue> values = new ArrayList<>();

    public StrukturdatenParser(int year, Charset charset, Connection connection) throws SQLException {
        this.year = year;
        this.charset = charset;
        try (PreparedStatement stmt = connection.prepareStatement(
                "SELECT column_no, indicator_id, source_label FROM indicator_source_column WHERE election_year = ?")) {
            stmt.setInt(1, year);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    columnIndicators.put(rs.getInt(1), rs.getInt(2));
                    columnLabels.put(rs.getInt(1), rs.getString(3));
                }
            }
        }
        assert !columnIndicators.isEmpty() : "no indicator mapping seeded for " + year;
    }

    public void parse() {
        CsvFile csv = CsvFile.load("additional-data/strukturdaten/btw" + year + "_strukturdaten.csv", charset);
        int header = csv.indexOf(row -> {
            String first = CsvFile.normalize(row.getFirst());
            return first.equals("Land") || (first.startsWith("Land") && CsvFile.normalize(row.get(1)).startsWith("Wahlkreis-Nr"));
        });
        List<String> headerRow = csv.rows().get(header);

        // data columns start at CSV index 3 = Spalten-Nr. 1; verify the catalog
        // against the file's labels before trusting it
        columnLabels.forEach((columnNo, expected) -> {
            String actual = CsvFile.normalize(headerRow.get(columnNo + 2));
            assert CsvFile.normalize(expected).equals(actual)
                    : year + " Spalte " + columnNo + ": catalog '" + expected + "' vs file '" + actual + "'";
        });

        int constituencyRows = 0;
        for (List<String> row : csv.rows().subList(header + 1, csv.rows().size())) {
            if (row.size() < 4) {
                continue;
            }
            String nr = CsvFile.normalize(row.get(1));
            if (!nr.matches("\\d{1,3}") || CsvFile.normalize(row.getFirst()).startsWith("#")) {
                continue;
            }
            long areaNr = Long.parseLong(nr);
            if (areaNr <= 299) {
                constituencyRows++;
            }
            for (Map.Entry<Integer, Integer> entry : columnIndicators.entrySet()) {
                Double value = CsvFile.decimal(row.get(entry.getKey() + 2));
                StructureValue.Builder builder = StructureValue.newBuilder()
                        .setElectionYear(year)
                        .setAreaNr(areaNr)
                        .setIndicatorId(entry.getValue());
                if (value != null) {
                    builder.setValue(value);
                }
                values.add(builder.build());
            }
        }
        assert constituencyRows == 299 : year + ": expected 299 Wahlkreis rows, got " + constituencyRows;
    }
}
