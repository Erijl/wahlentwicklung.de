package org.erijl.wahlentwicklung.statistics;

import org.erijl.wahlentwicklung.protos.objects.ConstituencyBallotVoteBase;
import org.erijl.wahlentwicklung.protos.objects.ConstituencyBallotVoteParty;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Parses one election's btwYYYY_brief_wkr.csv (Urne/Brief per Wahlkreis,
 * 2009–2025: uniformly 299 Wahlkreise x 2 Bezirksarten). wkr_nr is the
 * per-year Wahlkreis number (= election_constituency.row_id).
 */
public class BriefWkrParser {

    private final int year;
    private final Charset charset;
    private final StatLookups lookups;

    final List<ConstituencyBallotVoteBase> base = new ArrayList<>();
    final List<ConstituencyBallotVoteParty> parties = new ArrayList<>();

    public BriefWkrParser(int year, Charset charset, StatLookups lookups) {
        this.year = year;
        this.charset = charset;
        this.lookups = lookups;
    }

    public void parse() {
        CsvFile csv = CsvFile.load("additional-data/weitere-ergebnisse/" + year + "/btw" + year + "_brief_wkr.csv", charset);
        int header = csv.indexOf(row -> CsvFile.normalize(row.getFirst()).startsWith("Wahlkreis-N"));
        VoteBlockHeader blocks = VoteBlockHeader.parse(csv.rows(), header);

        for (List<String> row : csv.rows().subList(header + 1, csv.rows().size())) {
            String nr = CsvFile.normalize(row.getFirst());
            if (!nr.matches("\\d{1,3}")) {
                continue;
            }
            long wkrNr = Long.parseLong(nr);
            String ballotType = ZeitreihenParser.ballotType(row.get(3));

            ConstituencyBallotVoteBase.Builder baseBuilder = ConstituencyBallotVoteBase.newBuilder()
                    .setElectionYear(year).setWkrNr(wkrNr).setBallotType(ballotType);
            Long eligible = CsvFile.count(row.get(4));
            Long voters = CsvFile.count(row.get(5));
            Long invalidPrimary = CsvFile.count(row.get(blocks.primary().invalidIndex()));
            Long validPrimary = CsvFile.count(row.get(blocks.primary().validIndex()));
            Long invalidSecondary = CsvFile.count(row.get(blocks.secondary().invalidIndex()));
            Long validSecondary = CsvFile.count(row.get(blocks.secondary().validIndex()));
            if (eligible != null) baseBuilder.setEligible(eligible);
            if (voters != null) baseBuilder.setVoters(voters);
            if (invalidPrimary != null) baseBuilder.setInvalidPrimary(invalidPrimary);
            if (validPrimary != null) baseBuilder.setValidPrimary(validPrimary);
            if (invalidSecondary != null) baseBuilder.setInvalidSecondary(invalidSecondary);
            if (validSecondary != null) baseBuilder.setValidSecondary(validSecondary);
            base.add(baseBuilder.build());

            Map<Long, ConstituencyBallotVoteParty.Builder> byParty = new HashMap<>();
            blocks.primary().partyColumns().forEach((label, column) -> {
                Long votes = CsvFile.count(row.get(column));
                if (votes != null) {
                    partyBuilder(byParty, wkrNr, ballotType, label).setPrimaryVotes(votes);
                }
            });
            blocks.secondary().partyColumns().forEach((label, column) -> {
                Long votes = CsvFile.count(row.get(column));
                if (votes != null) {
                    partyBuilder(byParty, wkrNr, ballotType, label).setSecondaryVotes(votes);
                }
            });
            byParty.values().forEach(builder -> parties.add(builder.build()));
        }
        assert base.size() == 598 : year + ": expected 299x2 rows, got " + base.size();
    }

    private ConstituencyBallotVoteParty.Builder partyBuilder(
            Map<Long, ConstituencyBallotVoteParty.Builder> byParty, long wkrNr, String ballotType, String label) {
        long statPartyId = lookups.party(label).statPartyId();
        return byParty.computeIfAbsent(statPartyId, id -> ConstituencyBallotVoteParty.newBuilder()
                .setElectionYear(year).setWkrNr(wkrNr).setBallotType(ballotType).setStatPartyId(id));
    }
}
