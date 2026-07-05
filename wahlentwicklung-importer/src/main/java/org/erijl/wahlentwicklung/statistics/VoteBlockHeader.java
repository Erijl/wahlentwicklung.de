package org.erijl.wahlentwicklung.statistics;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Column layout of the kerg-shaped statistics files (brief_wkr, kreis):
 * an Erststimmen block and a Zweitstimmen block, each [Ungültige, Gültige,
 * party...]. 2009–2021 files use a two-row header (names + an
 * Erststimmen/Zweitstimmen marker row); 2025 uses a single row with
 * " - Erststimmen"/" - Zweitstimmen" suffixes.
 */
public class VoteBlockHeader {

    /**
     * One vote-type block: column indexes of Ungültige/Gültige plus the
     * party columns by (whitespace-normalized) label in file order.
     */
    public static class Block {
        int invalidIndex = -1;
        int validIndex = -1;
        final Map<String, Integer> partyColumns = new LinkedHashMap<>();

        public int invalidIndex() {
            return invalidIndex;
        }

        public int validIndex() {
            return validIndex;
        }

        public Map<String, Integer> partyColumns() {
            return partyColumns;
        }
    }

    private final Block primary = new Block();
    private final Block secondary = new Block();

    public Block primary() {
        return primary;
    }

    public Block secondary() {
        return secondary;
    }

    public static VoteBlockHeader parse(List<List<String>> rows, int headerIndex) {
        VoteBlockHeader result = new VoteBlockHeader();
        List<String> names = rows.get(headerIndex);
        List<String> marker = rows.get(headerIndex + 1);
        boolean twoRow = marker.stream().map(CsvFile::normalize)
                .anyMatch(cell -> cell.equals("Erststimmen") || cell.equals("Zweitstimmen"));

        for (int i = 0; i < names.size(); i++) {
            String label = CsvFile.normalize(names.get(i));
            Block block;
            if (twoRow) {
                String kind = i < marker.size() ? CsvFile.normalize(marker.get(i)) : "";
                block = switch (kind) {
                    case "Erststimmen" -> result.primary;
                    case "Zweitstimmen" -> result.secondary;
                    default -> null;
                };
            } else if (label.endsWith(" - Erststimmen")) {
                block = result.primary;
                label = label.substring(0, label.length() - " - Erststimmen".length());
            } else if (label.endsWith(" - Zweitstimmen")) {
                block = result.secondary;
                label = label.substring(0, label.length() - " - Zweitstimmen".length());
            } else {
                block = null;
            }
            if (block == null || label.isEmpty()) {
                continue;
            }
            switch (label) {
                case "Ungültige" -> block.invalidIndex = i;
                case "Gültige" -> block.validIndex = i;
                default -> {
                    Integer previous = block.partyColumns.put(label, i);
                    assert previous == null : "duplicate party column: " + label;
                }
            }
        }
        assert result.primary.invalidIndex >= 0 && result.primary.validIndex >= 0;
        assert result.secondary.invalidIndex >= 0 && result.secondary.validIndex >= 0;
        assert !result.primary.partyColumns.isEmpty() && !result.secondary.partyColumns.isEmpty();
        return result;
    }
}
