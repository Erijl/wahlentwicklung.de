package org.erijl.wahlentwicklung;

import org.erijl.wahlentwicklung.protos.builder.*;
import org.erijl.wahlentwicklung.protos.objects.*;
import org.erijl.wahlentwicklung.statistics.CsvFile;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Parses the pre-2005 kerg files (the Bundeswahlleiter "2016 edition" layout,
 * uniform 1949–2002), which differs from the modern format ElectionParser
 * reads: two-row header (party names as Erst/Zweit column pairs + a marker
 * row), no Vorperiode columns, no appended seat/coalition rows, and 1949 is
 * a single-vote election. Documented quirks (docs/09):
 * - previous-election columns do not exist -> all *_previous fields are 0.
 * - seat_count / part_of_coalition are 0 (open item; sources not in the files).
 * - 1949: the single vote is stored as BOTH Erst- and Zweitstimme (it legally
 *   served both functions); some parties in other years have only one column
 *   (e.g. Übrige 1972 Erststimmen only) -> the missing side stays 0.
 * - state rows are keyed 9xx, but the numbering scheme changes per era
 *   (1990/94 use the unification-treaty order) -> canonical joins only via
 *   state_mapping. Constituency Land refs are letters until 1994, 9xx after.
 * - 1949–1987 totals are "Bundesgebiet ohne Berlin"; Saarland from 1957.
 */
public class HistoricalElectionParser {

    private final int year;
    private final List<List<String>> rows;
    private final int headerIndex;

    /**
     * One party = 1 or 2 consecutive columns with the same label; columnIndex
     * (the first physical column) is the election_party key, primary/secondary
     * are -1 when that vote type does not exist for the party.
     */
    private record PartyColumns(String name, int columnIndex, int primaryColumn, int secondaryColumn) {
    }

    private final List<PartyColumns> partyColumns = new ArrayList<>();
    private int invalidPrimaryColumn, invalidSecondaryColumn, validPrimaryColumn, validSecondaryColumn;

    List<ElectionParty> parties;
    List<ElectionState> states;
    List<ElectionConstituency> constituencies;
    ElectionVoteBase electionBaseVotes;
    List<StateVoteBase> stateBaseVotes;
    List<ConstituencyVoteBase> constituencyVotesBase;
    List<ElectionVoteParty> electionPartyVotes;
    List<StateVoteParty> statePartyVotes;
    List<ConstituencyVoteParty> constituencyPartyVotes;

    public HistoricalElectionParser(int year) {
        this.year = year;
        this.rows = CsvFile.load("raw-election-data/btw" + year + "_kerg.csv", Charset.forName("windows-1252")).rows();
        this.headerIndex = indexOfHeader();
        parseHeader();
    }

    public void parse() {
        this.states = readStates();
        Map<String, Long> stateRowIdsByAbbreviation = readStateAbbreviations();

        this.parties = new ArrayList<>();
        this.constituencies = new ArrayList<>();
        this.stateBaseVotes = new ArrayList<>();
        this.constituencyVotesBase = new ArrayList<>();
        this.electionPartyVotes = new ArrayList<>();
        this.statePartyVotes = new ArrayList<>();
        this.constituencyPartyVotes = new ArrayList<>();

        for (PartyColumns party : partyColumns) {
            parties.add(ElectionPartyBuilder.buildElectionParty(year, party.columnIndex(), party.name(), 0, 0));
        }

        for (List<String> row : rows.subList(headerIndex + 2, rows.size())) {
            String first = CsvFile.normalize(row.getFirst());
            if (!first.matches("\\d{1,3}")) {
                continue;
            }
            long rowId = Long.parseLong(first);
            if (rowId == 999) {
                this.electionBaseVotes = buildVoteBase(row);
                for (PartyColumns party : partyColumns) {
                    electionPartyVotes.add(ElectionVotePartyBuilder.buildElectionVoteParty(
                            year, party.columnIndex(), 0, votes(row, party.primaryColumn()), 0, votes(row, party.secondaryColumn())));
                }
            } else if (rowId >= 900) {
                continue; // state rows are handled in the second pass below
            } else {
                // constituency row: Land ref is a letter until 1994, a 9xx number after
                String landRef = CsvFile.normalize(row.get(2));
                long stateRowId = landRef.matches("9\\d\\d")
                        ? Long.parseLong(landRef)
                        : stateRowIdsByAbbreviation.get(landRef);
                constituencies.add(ElectionConstituencyBuilder.buildElectionState((int) stateRowId, year, (int) rowId, CsvFile.normalize(row.get(1))));
                constituencyVotesBase.add(buildConstituencyVoteBase(row, stateRowId, rowId));
                for (PartyColumns party : partyColumns) {
                    constituencyPartyVotes.add(ConstituencyVotePartyBuilder.buildConstituencyVoteParty(
                            year, (int) stateRowId, party.columnIndex(), (int) rowId,
                            0, votes(row, party.primaryColumn()), 0, votes(row, party.secondaryColumn())));
                }
            }
        }

        // state rows need their own pass with the same column logic
        for (List<String> row : rows.subList(headerIndex + 2, rows.size())) {
            String first = CsvFile.normalize(row.getFirst());
            if (!first.matches("9\\d\\d") || first.equals("999")) {
                continue;
            }
            long rowId = Long.parseLong(first);
            stateBaseVotes.add(buildStateVoteBase(row, rowId));
            for (PartyColumns party : partyColumns) {
                statePartyVotes.add(StateVotePartyBuilder.buildStateVoteParty(
                        year, party.columnIndex(), (int) rowId,
                        0, votes(row, party.primaryColumn()), 0, votes(row, party.secondaryColumn())));
            }
        }

        assert electionBaseVotes != null : year + ": no 999 row";
        assert !constituencies.isEmpty() && !states.isEmpty() && !parties.isEmpty();
    }

    private int indexOfHeader() {
        for (int i = 0; i < rows.size(); i++) {
            if (CsvFile.normalize(rows.get(i).getFirst()).equals("Wahlkreis")) {
                return i;
            }
        }
        throw new IllegalStateException(year + ": header not found");
    }

    /**
     * Base columns are fixed (3 Wahlberechtigte, 4 Wähler), then Ungültige and
     * Gültige as pairs (single columns in 1949), then the party groups.
     */
    private void parseHeader() {
        List<String> names = rows.get(headerIndex);
        List<String> markers = rows.get(headerIndex + 1);
        boolean singleVote = markers.stream().map(CsvFile::normalize).noneMatch(m -> m.equals("Zweitstimmen"));

        int column = 5;
        assert CsvFile.normalize(names.get(3)).startsWith("Wahlbe") && CsvFile.normalize(names.get(4)).startsWith("Wähler");

        invalidPrimaryColumn = column;
        invalidSecondaryColumn = singleVote ? column : column + 1;
        column += singleVote ? 1 : 2;
        validPrimaryColumn = column;
        validSecondaryColumn = singleVote ? column : column + 1;
        column += singleVote ? 1 : 2;

        while (column < names.size()) {
            String name = CsvFile.normalize(names.get(column));
            if (name.isEmpty()) {
                break;
            }
            boolean paired = column + 1 < names.size() && CsvFile.normalize(names.get(column + 1)).equals(name);
            if (singleVote) {
                partyColumns.add(new PartyColumns(name, column, column, column));
                column++;
            } else if (paired) {
                partyColumns.add(new PartyColumns(name, column, column, column + 1));
                column += 2;
            } else {
                // one-sided party (e.g. Übrige 1972) — the marker row says which side
                String marker = column < markers.size() ? CsvFile.normalize(markers.get(column)) : "";
                assert marker.equals("Erststimmen") || marker.equals("Zweitstimmen")
                        : year + " column " + column + " (" + name + "): unpaired without marker";
                boolean primaryOnly = marker.equals("Erststimmen");
                partyColumns.add(new PartyColumns(name, column, primaryOnly ? column : -1, primaryOnly ? -1 : column));
                column++;
            }
        }
        assert !partyColumns.isEmpty() : year + ": no party columns";
    }

    private List<ElectionState> readStates() {
        List<ElectionState> result = new ArrayList<>();
        for (List<String> row : rows.subList(headerIndex + 2, rows.size())) {
            String first = CsvFile.normalize(row.getFirst());
            if (first.matches("9\\d\\d") && !first.equals("999")) {
                result.add(ElectionStateBuilder.buildElectionState(year, Integer.parseInt(first), CsvFile.normalize(row.get(1))));
            }
        }
        return result;
    }

    private Map<String, Long> readStateAbbreviations() {
        Map<String, Long> result = new HashMap<>();
        for (List<String> row : rows.subList(headerIndex + 2, rows.size())) {
            String first = CsvFile.normalize(row.getFirst());
            if (first.matches("9\\d\\d") && !first.equals("999") && row.size() > 2 && !CsvFile.normalize(row.get(2)).isEmpty()) {
                result.put(CsvFile.normalize(row.get(2)), Long.parseLong(first));
            }
        }
        return result;
    }

    private long votes(List<String> row, int column) {
        if (column < 0 || column >= row.size()) {
            return 0;
        }
        Long value = CsvFile.count(row.get(column));
        return value == null ? 0 : value;
    }

    // the *VoteBaseBuilder signatures mirror the modern kerg column order —
    // built directly here instead, with all *_previous fields left at 0

    private ElectionVoteBase buildVoteBase(List<String> row) {
        long eligible = votes(row, 3);
        long actual = votes(row, 4);
        return ElectionVoteBase.newBuilder()
                .setElectionYear(year)
                .setEligiblevotersPrimaryvoteDefinitive(eligible)
                .setEligiblevotersSecondaryvoteDefinitive(eligible)
                .setActualvotersPrimaryvoteDefinitive(actual)
                .setActualvotersSecondaryvoteDefinitive(actual)
                .setValidvotersPrimaryvoteDefinitive(votes(row, validPrimaryColumn))
                .setValidvotersSecondaryvoteDefinitive(votes(row, validSecondaryColumn))
                .setInvalidvotersPrimaryvoteDefinitive(votes(row, invalidPrimaryColumn))
                .setInvalidvotersSecondaryvoteDefinitive(votes(row, invalidSecondaryColumn))
                .build();
    }

    private StateVoteBase buildStateVoteBase(List<String> row, long stateRowId) {
        long eligible = votes(row, 3);
        long actual = votes(row, 4);
        return StateVoteBase.newBuilder()
                .setElectionYear(year)
                .setStateId(stateRowId)
                .setEligiblevotersPrimaryvoteDefinitive(eligible)
                .setEligiblevotersSecondaryvoteDefinitive(eligible)
                .setActualvotersPrimaryvoteDefinitive(actual)
                .setActualvotersSecondaryvoteDefinitive(actual)
                .setValidvotersPrimaryvoteDefinitive(votes(row, validPrimaryColumn))
                .setValidvotersSecondaryvoteDefinitive(votes(row, validSecondaryColumn))
                .setInvalidvotersPrimaryvoteDefinitive(votes(row, invalidPrimaryColumn))
                .setInvalidvotersSecondaryvoteDefinitive(votes(row, invalidSecondaryColumn))
                .build();
    }

    private ConstituencyVoteBase buildConstituencyVoteBase(List<String> row, long stateRowId, long constituencyId) {
        long eligible = votes(row, 3);
        long actual = votes(row, 4);
        return ConstituencyVoteBase.newBuilder()
                .setElectionYear(year)
                .setStateId(stateRowId)
                .setConstituencyId(constituencyId)
                .setEligiblevotersPrimaryvoteDefinitive(eligible)
                .setEligiblevotersSecondaryvoteDefinitive(eligible)
                .setActualvotersPrimaryvoteDefinitive(actual)
                .setActualvotersSecondaryvoteDefinitive(actual)
                .setValidvotersPrimaryvoteDefinitive(votes(row, validPrimaryColumn))
                .setValidvotersSecondaryvoteDefinitive(votes(row, validSecondaryColumn))
                .setInvalidvotersPrimaryvoteDefinitive(votes(row, invalidPrimaryColumn))
                .setInvalidvotersSecondaryvoteDefinitive(votes(row, invalidSecondaryColumn))
                .build();
    }

    public List<ElectionParty> getParties() {
        return parties;
    }

    public List<ElectionState> getStates() {
        return states;
    }

    public List<ElectionConstituency> getConstituencies() {
        return constituencies;
    }

    public ElectionVoteBase getElectionBaseVotes() {
        return electionBaseVotes;
    }

    public List<StateVoteBase> getStateBaseVotes() {
        return stateBaseVotes;
    }

    public List<ConstituencyVoteBase> getConstituencyVotesBase() {
        return constituencyVotesBase;
    }

    public List<ElectionVoteParty> getElectionPartyVotes() {
        return electionPartyVotes;
    }

    public List<StateVoteParty> getStatePartyVotes() {
        return statePartyVotes;
    }

    public List<ConstituencyVoteParty> getConstituencyPartyVotes() {
        return constituencyPartyVotes;
    }
}
