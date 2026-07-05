package org.erijl.wahlentwicklung.statistics;

import org.erijl.wahlentwicklung.protos.objects.Kreis;
import org.erijl.wahlentwicklung.protos.objects.KreisVoteBase;
import org.erijl.wahlentwicklung.protos.objects.KreisVoteParty;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Parses one election's btwYYYYkreis.csv (results per kreisfreie Stadt /
 * Landkreis, 2009–2025). Keyed by the official Statistische Kennziffer (AGS);
 * deliberately no canonical Kreis entity (docs/08 §5).
 */
public class KreisParser {

    private final int year;
    private final Charset charset;
    private final StatLookups lookups;

    final List<Kreis> kreise = new ArrayList<>();
    final List<KreisVoteBase> base = new ArrayList<>();
    final List<KreisVoteParty> parties = new ArrayList<>();

    public KreisParser(int year, Charset charset, StatLookups lookups) {
        this.year = year;
        this.charset = charset;
        this.lookups = lookups;
    }

    public void parse() {
        CsvFile csv = CsvFile.load("additional-data/weitere-ergebnisse/" + year + "/btw" + year + "kreis.csv", charset);
        int header = csv.indexOf(row -> CsvFile.normalize(row.getFirst()).equals("Land"));
        VoteBlockHeader blocks = VoteBlockHeader.parse(csv.rows(), header);

        for (List<String> row : csv.rows().subList(header + 1, csv.rows().size())) {
            if (row.size() < 5) {
                continue;
            }
            String landCode = CsvFile.normalize(row.getFirst());
            String ags = CsvFile.normalize(row.get(1));
            if (!ags.matches("\\d{4,5}")) {
                continue;
            }
            Integer stateId = lookups.stateId(landCode);
            assert stateId != null : "Kreis row without Land: " + ags;

            kreise.add(Kreis.newBuilder()
                    .setElectionYear(year).setAgs(ags)
                    .setName(CsvFile.normalize(row.get(2)))
                    .setStateId(stateId)
                    .build());

            KreisVoteBase.Builder baseBuilder = KreisVoteBase.newBuilder()
                    .setElectionYear(year).setAgs(ags);
            Long eligible = CsvFile.count(row.get(3));
            Long voters = CsvFile.count(row.get(4));
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

            Map<Long, KreisVoteParty.Builder> byParty = new HashMap<>();
            blocks.primary().partyColumns().forEach((label, column) -> {
                Long votes = CsvFile.count(row.get(column));
                if (votes != null) {
                    partyBuilder(byParty, ags, label).setPrimaryVotes(votes);
                }
            });
            blocks.secondary().partyColumns().forEach((label, column) -> {
                Long votes = CsvFile.count(row.get(column));
                if (votes != null) {
                    partyBuilder(byParty, ags, label).setSecondaryVotes(votes);
                }
            });
            byParty.values().forEach(builder -> parties.add(builder.build()));
        }
        assert kreise.size() > 290 : year + ": suspiciously few Kreise: " + kreise.size();
    }

    private KreisVoteParty.Builder partyBuilder(Map<Long, KreisVoteParty.Builder> byParty, String ags, String label) {
        long statPartyId = lookups.party(label).statPartyId();
        return byParty.computeIfAbsent(statPartyId, id -> KreisVoteParty.newBuilder()
                .setElectionYear(year).setAgs(ags).setStatPartyId(id));
    }
}
