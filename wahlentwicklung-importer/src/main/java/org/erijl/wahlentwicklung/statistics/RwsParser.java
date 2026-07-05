package org.erijl.wahlentwicklung.statistics;

import org.erijl.wahlentwicklung.protos.objects.RwsBallotVote;
import org.erijl.wahlentwicklung.protos.objects.RwsTurnout;
import org.erijl.wahlentwicklung.protos.objects.RwsVote;
import org.erijl.wahlentwicklung.protos.objects.RwsVoteCombo;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Parses one election's Repräsentative Wahlstatistik files (2017/2021/2025,
 * uniform format): bw2 (turnout), bst2 (votes), bst2-kombi (Erst-x-Zweit
 * combination matrix), bst2-ba (votes by Bezirksart, Bund only). bst3 and
 * the divergent 2013 publication are deliberately not imported (docs/08 §1).
 */
public class RwsParser {

    private final int year;
    private final String dir;
    private final String prefix;
    private final StatLookups lookups;
    final StatLookups.CohortRegistry cohorts;

    final List<RwsTurnout> turnout = new ArrayList<>();
    final List<RwsVote> votes = new ArrayList<>();
    final List<RwsVoteCombo> combos = new ArrayList<>();
    final List<RwsBallotVote> ballotVotes = new ArrayList<>();

    public RwsParser(int year, StatLookups lookups) {
        this.year = year;
        this.dir = "additional-data/rws/" + year + "/";
        this.prefix = "btw" + (year % 100) + "_rws_";
        this.lookups = lookups;
        this.cohorts = new StatLookups.CohortRegistry(year);
    }

    public void parse() {
        parseTurnout();
        parseVotes();
        parseCombos();
        parseBallotVotes();
    }

    private CsvFile load(String suffix) {
        return CsvFile.load(dir + prefix + suffix + ".csv", StandardCharsets.UTF_8);
    }

    private void parseTurnout() {
        CsvFile csv = load("bw2");
        int header = csv.indexOf(row -> CsvFile.normalize(row.getFirst()).equals("Land"));

        for (List<String> row : csv.rows().subList(header + 1, csv.rows().size())) {
            String landCode = CsvFile.normalize(row.getFirst());
            if (landCode.isEmpty()) {
                continue;
            }
            RwsTurnout.Builder builder = RwsTurnout.newBuilder()
                    .setElectionYear(year)
                    .setLandCode(landCode)
                    .setGender(lookups.gender(row.get(1)))
                    .setCohortId(cohorts.resolve(row.get(2)));
            Integer stateId = lookups.stateId(landCode);
            if (stateId != null) builder.setStateId(stateId);
            Long eligible = CsvFile.count(row.get(3));
            Long eligiblePlain = CsvFile.count(row.get(4));
            Long eligibleWahlschein = CsvFile.count(row.get(5));
            Long voters = CsvFile.count(row.get(6));
            Long votersPlain = CsvFile.count(row.get(7));
            Long votersWahlschein = CsvFile.count(row.get(8));
            Double turnoutPct = CsvFile.decimal(row.get(9));
            if (eligible != null) builder.setEligible(eligible);
            if (eligiblePlain != null) builder.setEligiblePlain(eligiblePlain);
            if (eligibleWahlschein != null) builder.setEligibleWahlschein(eligibleWahlschein);
            if (voters != null) builder.setVoters(voters);
            if (votersPlain != null) builder.setVotersPlain(votersPlain);
            if (votersWahlschein != null) builder.setVotersWahlschein(votersWahlschein);
            if (turnoutPct != null) builder.setTurnoutPct(turnoutPct);
            turnout.add(builder.build());
        }
        assert !turnout.isEmpty();
    }

    private void parseVotes() {
        CsvFile csv = load("bst2");
        int header = csv.indexOf(row -> CsvFile.normalize(row.getFirst()).equals("Land"));
        List<String> headerRow = csv.rows().get(header);

        for (List<String> row : csv.rows().subList(header + 1, csv.rows().size())) {
            String landCode = CsvFile.normalize(row.getFirst());
            if (landCode.isEmpty()) {
                continue;
            }
            Integer stateId = lookups.stateId(landCode);
            int voteType = Integer.parseInt(CsvFile.normalize(row.get(1)));
            String gender = lookups.gender(row.get(2));
            long cohortId = cohorts.resolve(row.get(3));

            for (int i = 4; i < headerRow.size(); i++) {
                String label = CsvFile.normalize(headerRow.get(i));
                if (label.isEmpty()) {
                    continue;
                }
                Long voteCount = CsvFile.count(row.get(i));
                if (voteCount == null) {
                    continue;
                }
                StatLookups.PartyRef party = lookups.party(label);
                RwsVote.Builder builder = RwsVote.newBuilder()
                        .setElectionYear(year)
                        .setLandCode(landCode)
                        .setVoteType(voteType)
                        .setGender(gender)
                        .setCohortId(cohortId)
                        .setStatPartyId(party.statPartyId())
                        .setIsMemo(party.memo() ? 1 : 0)
                        .setVotes(voteCount);
                if (stateId != null) builder.setStateId(stateId);
                votes.add(builder.build());
            }
        }
        assert !votes.isEmpty();
    }

    private void parseCombos() {
        CsvFile csv = load("bst2-kombi");
        int header = csv.indexOf(row -> CsvFile.normalize(row.getFirst()).equals("Land"));
        List<String> headerRow = csv.rows().get(header);
        final String columnPrefix = "Erststimme: ";

        for (List<String> row : csv.rows().subList(header + 1, csv.rows().size())) {
            String landCode = CsvFile.normalize(row.getFirst());
            if (landCode.isEmpty()) {
                continue;
            }
            Integer stateId = lookups.stateId(landCode);
            String gender = lookups.gender(row.get(1));
            long cohortId = cohorts.resolve(row.get(2));
            StatLookups.PartyRef secondary = lookups.party(row.get(3));

            for (int i = 4; i < headerRow.size(); i++) {
                String label = CsvFile.normalize(headerRow.get(i));
                if (label.isEmpty()) {
                    continue;
                }
                assert label.startsWith(columnPrefix) : label;
                Long voteCount = CsvFile.count(row.get(i));
                if (voteCount == null) {
                    continue;
                }
                StatLookups.PartyRef primary = lookups.party(label.substring(columnPrefix.length()));
                RwsVoteCombo.Builder builder = RwsVoteCombo.newBuilder()
                        .setElectionYear(year)
                        .setLandCode(landCode)
                        .setGender(gender)
                        .setCohortId(cohortId)
                        .setSecondaryStatPartyId(secondary.statPartyId())
                        .setSecondaryIsMemo(secondary.memo() ? 1 : 0)
                        .setPrimaryStatPartyId(primary.statPartyId())
                        .setPrimaryIsMemo(primary.memo() ? 1 : 0)
                        .setVotes(voteCount);
                if (stateId != null) builder.setStateId(stateId);
                combos.add(builder.build());
            }
        }
        assert !combos.isEmpty();
    }

    private void parseBallotVotes() {
        CsvFile csv = load("bst2-ba");
        int header = csv.indexOf(row -> CsvFile.normalize(row.getFirst()).equals("Land"));
        List<String> headerRow = csv.rows().get(header);

        for (List<String> row : csv.rows().subList(header + 1, csv.rows().size())) {
            String landCode = CsvFile.normalize(row.getFirst());
            if (landCode.isEmpty()) {
                continue;
            }
            assert landCode.equals("Bund") : "bst2-ba is Bund-only, got: " + landCode;
            int voteType = Integer.parseInt(CsvFile.normalize(row.get(1)));
            String ballotType = ZeitreihenParser.ballotType(row.get(2));
            String gender = lookups.gender(row.get(3));
            long cohortId = cohorts.resolve(row.get(4));

            for (int i = 5; i < headerRow.size(); i++) {
                String label = CsvFile.normalize(headerRow.get(i));
                if (label.isEmpty()) {
                    continue;
                }
                Long voteCount = CsvFile.count(row.get(i));
                if (voteCount == null) {
                    continue;
                }
                StatLookups.PartyRef party = lookups.party(label);
                ballotVotes.add(RwsBallotVote.newBuilder()
                        .setElectionYear(year)
                        .setVoteType(voteType)
                        .setBallotType(ballotType)
                        .setGender(gender)
                        .setCohortId(cohortId)
                        .setStatPartyId(party.statPartyId())
                        .setIsMemo(party.memo() ? 1 : 0)
                        .setVotes(voteCount)
                        .build());
            }
        }
        assert !ballotVotes.isEmpty();
    }
}
