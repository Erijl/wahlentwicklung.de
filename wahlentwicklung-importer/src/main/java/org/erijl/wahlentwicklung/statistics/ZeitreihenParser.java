package org.erijl.wahlentwicklung.statistics;

import org.erijl.wahlentwicklung.protos.objects.TsAbsentee;
import org.erijl.wahlentwicklung.protos.objects.TsAgeTurnout;
import org.erijl.wahlentwicklung.protos.objects.TsAgeVoteShare;
import org.erijl.wahlentwicklung.protos.objects.TsBallotBase;
import org.erijl.wahlentwicklung.protos.objects.TsBallotParty;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Parses the four whole-history time-series files (docs/08 §Zeitreihen):
 * btw_rws_wb-1953 (turnout by gender x age), btw_rws_zwst-1953 (Zweitstimmen
 * shares by gender x age, %-only), btw_ab57_wahlschein (Wahlschein/Briefwahl
 * participation per Land), btw_ab57_brief_urne (Zweitstimmen Urne vs. Brief
 * per Land). All four are UTF-8 downloads from the 2025 pages.
 */
public class ZeitreihenParser {

    private static final String DIR = "additional-data/zeitreihen/";

    private final StatLookups lookups;

    final List<TsAgeTurnout> ageTurnout = new ArrayList<>();
    final List<TsAgeVoteShare> ageVoteShares = new ArrayList<>();
    final List<TsAbsentee> absentee = new ArrayList<>();
    final List<TsBallotBase> ballotBase = new ArrayList<>();
    final List<TsBallotParty> ballotParties = new ArrayList<>();

    public ZeitreihenParser(StatLookups lookups) {
        this.lookups = lookups;
    }

    public void parse() {
        parseAgeTurnout();
        parseAgeVoteShares();
        parseAbsentee();
        parseBallot();
    }

    private void parseAgeTurnout() {
        CsvFile csv = CsvFile.load(DIR + "btw_rws_wb-1953.csv", StandardCharsets.UTF_8);
        int header = csv.indexOf(row -> row.getFirst().startsWith("Bundestagswahl"));

        for (List<String> row : csv.rows().subList(header + 1, csv.rows().size())) {
            if (CsvFile.normalize(row.getFirst()).isEmpty()) {
                continue;
            }
            TsAgeTurnout.Builder builder = TsAgeTurnout.newBuilder()
                    .setYear(Long.parseLong(row.get(0)))
                    .setGender(lookups.gender(row.get(1)))
                    .setAgeGroupId(lookups.ageGroup(row.get(2)));
            Long eligible = CsvFile.count(row.get(3));
            Long eligiblePlain = CsvFile.count(row.get(4));
            Long eligibleWahlschein = CsvFile.count(row.get(5));
            Long voters = CsvFile.count(row.get(6));
            Double turnout = CsvFile.decimal(row.get(7));
            if (eligible != null) builder.setEligible(eligible);
            if (eligiblePlain != null) builder.setEligiblePlain(eligiblePlain);
            if (eligibleWahlschein != null) builder.setEligibleWahlschein(eligibleWahlschein);
            if (voters != null) builder.setVoters(voters);
            if (turnout != null) builder.setTurnoutPct(turnout);
            ageTurnout.add(builder.build());
        }
        assert !ageTurnout.isEmpty();
    }

    private void parseAgeVoteShares() {
        CsvFile csv = CsvFile.load(DIR + "btw_rws_zwst-1953.csv", StandardCharsets.UTF_8);
        int header = csv.indexOf(row -> row.getFirst().startsWith("Bundestagswahl"));
        List<String> headerRow = csv.rows().get(header);

        for (List<String> row : csv.rows().subList(header + 1, csv.rows().size())) {
            if (CsvFile.normalize(row.getFirst()).isEmpty()) {
                continue;
            }
            long year = Long.parseLong(row.get(0));
            String gender = lookups.gender(row.get(1));
            int ageGroup = lookups.ageGroup(row.get(2));
            for (int i = 3; i < headerRow.size(); i++) {
                Double share = CsvFile.decimal(row.get(i));
                if (share == null) {
                    continue; // party did not stand that year
                }
                ageVoteShares.add(TsAgeVoteShare.newBuilder()
                        .setYear(year)
                        .setGender(gender)
                        .setAgeGroupId(ageGroup)
                        .setStatPartyId(lookups.party(headerRow.get(i)).statPartyId())
                        .setSharePct(share)
                        .build());
            }
        }
        assert !ageVoteShares.isEmpty();
    }

    private void parseAbsentee() {
        CsvFile csv = CsvFile.load(DIR + "btw_ab57_wahlschein.csv", StandardCharsets.UTF_8);
        int header = csv.indexOf(row -> CsvFile.normalize(row.getFirst()).equals("Land"));

        for (List<String> row : csv.rows().subList(header + 2, csv.rows().size())) { // +2: unit row
            String landCode = CsvFile.normalize(row.getFirst());
            if (landCode.isEmpty()) {
                continue;
            }
            TsAbsentee.Builder builder = TsAbsentee.newBuilder()
                    .setYear(Long.parseLong(CsvFile.normalize(row.get(1))))
                    .setLandCode(landCode);
            Integer stateId = lookups.stateId(landCode);
            if (stateId != null) builder.setStateId(stateId);
            Long eligible = CsvFile.count(row.get(2));
            Long eligiblePlain = CsvFile.count(row.get(3));
            Long eligibleSperrvermerk = CsvFile.count(row.get(4));
            Long voters = CsvFile.count(row.get(6));
            Long votersPlain = CsvFile.count(row.get(7));
            Long votersSimpleWs = CsvFile.count(row.get(9));
            Long votersBrief = CsvFile.count(row.get(10));
            if (eligible != null) builder.setEligible(eligible);
            if (eligiblePlain != null) builder.setEligiblePlain(eligiblePlain);
            if (eligibleSperrvermerk != null) builder.setEligibleSperrvermerk(eligibleSperrvermerk);
            if (voters != null) builder.setVoters(voters);
            if (votersPlain != null) builder.setVotersPlain(votersPlain);
            if (votersSimpleWs != null) builder.setVotersSimpleWs(votersSimpleWs);
            if (votersBrief != null) builder.setVotersBrief(votersBrief);
            absentee.add(builder.build());
        }
        assert !absentee.isEmpty();
    }

    private void parseBallot() {
        CsvFile csv = CsvFile.load(DIR + "btw_ab57_brief_urne.csv", StandardCharsets.UTF_8);
        int header = csv.indexOf(row -> CsvFile.normalize(row.getFirst()).equals("Land"));
        List<String> headerRow = csv.rows().get(header);
        List<String> unitRow = csv.rows().get(header + 1);

        for (List<String> row : csv.rows().subList(header + 2, csv.rows().size())) {
            String landCode = CsvFile.normalize(row.getFirst());
            if (landCode.isEmpty()) {
                continue;
            }
            long year = Long.parseLong(CsvFile.normalize(row.get(2)));
            String ballotType = ballotType(row.get(1));
            Integer stateId = lookups.stateId(landCode);

            TsBallotBase.Builder base = TsBallotBase.newBuilder()
                    .setYear(year).setLandCode(landCode).setBallotType(ballotType);
            if (stateId != null) base.setStateId(stateId);
            Long voters = CsvFile.count(row.get(3));
            Long invalid = CsvFile.count(row.get(4)); // col 5 = % (skipped)
            Long valid = CsvFile.count(row.get(6));
            if (voters != null) base.setVoters(voters);
            if (invalid != null) base.setInvalid(invalid);
            if (valid != null) base.setValid(valid);
            ballotBase.add(base.build());

            // party columns come as (Anzahl, %) pairs from col 7 on — take the Anzahl ones
            for (int i = 7; i < headerRow.size(); i++) {
                String label = CsvFile.normalize(headerRow.get(i));
                if (label.isEmpty() || !CsvFile.normalize(unitRow.get(i)).equals("Anzahl")) {
                    continue;
                }
                Long votes = CsvFile.count(row.get(i));
                if (votes == null) {
                    continue; // 'X' — party not standing
                }
                TsBallotParty.Builder party = TsBallotParty.newBuilder()
                        .setYear(year).setLandCode(landCode).setBallotType(ballotType)
                        .setStatPartyId(lookups.party(label).statPartyId())
                        .setVotes(votes);
                if (stateId != null) party.setStateId(stateId);
                ballotParties.add(party.build());
            }
        }
        assert !ballotBase.isEmpty() && !ballotParties.isEmpty();
    }

    static String ballotType(String label) {
        return switch (CsvFile.normalize(label)) {
            case "Urne" -> "urne";
            case "Brief", "Briefwahl" -> "brief";
            case "Summe", "Zusammen" -> "total";
            default -> throw new IllegalArgumentException("unknown Bezirksart: " + label);
        };
    }
}
