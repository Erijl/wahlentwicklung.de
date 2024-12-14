package org.erijl.wahlentwicklung;

import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;
import org.erijl.wahlentwicklung.enums.ElectionEnum;
import org.erijl.wahlentwicklung.protos.builder.*;
import org.erijl.wahlentwicklung.protos.objects.*;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class ElectionParser {
    private static final char DELIMITER = ';'; //TODO make delimiter configurable

    private final ElectionEnum election;
    private File fileToRead;
    private final List<List<String>> csvRecords;

    public ElectionParser(ElectionEnum election) {
        this.election = election;
        this.ensureFileExists();
        this.csvRecords = new ArrayList<>();

        CSVParser csvParser = new CSVParserBuilder().withSeparator(DELIMITER).build();

        boolean skippedComments = false;
        try (CSVReader csvReader = new CSVReaderBuilder(new FileReader(this.fileToRead, this.election.getCharset())).withCSVParser(csvParser).build()) {
            String[] values;
            while ((values = csvReader.readNext()) != null) {
                if (values[0].startsWith("Nr")) {
                    skippedComments = true;
                }

                if (skippedComments) {
                    this.csvRecords.add(List.of(values));
                }
            }
        } catch (CsvValidationException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void ensureFileExists() {
        URL electionFilePath = getClass().getClassLoader().getResource("raw-election-data/btw" + this.election.getYear() + "_kerg.csv");
        assert electionFilePath != null;

        this.fileToRead = new File(electionFilePath.getPath());
        assert this.fileToRead.exists();
    }

    public List<ElectionParty> getParties() {
        List<ElectionParty> parties = new ArrayList<>();

        for (int i = 19; i < this.csvRecords.getFirst().size(); i += 4) {
            parties.add(ElectionPartyBuilder.buildElectionParty(this.election.getYear(), i, this.csvRecords.getFirst().get(i)));
        }

        return parties;
    }

    public List<ElectionState> getStates() {
        List<ElectionState> states = new ArrayList<>();

        this.csvRecords.forEach(record -> {
            String entry = record.getFirst();
            if (entry.startsWith("9") && !entry.equals("999") && Integer.parseInt(entry) >= 900) {
                states.add(ElectionStateBuilder.buildElectionState(this.election.getYear(), Integer.parseInt(entry), record.get(1)));
            }
        });

        return states;
    }

    public List<ElectionConstituency> getConstituencies() {
        List<ElectionConstituency> constituencies = new ArrayList<>();

        this.csvRecords.forEach(record -> {
            String entry = record.getFirst();
            if (!entry.startsWith("N") && !entry.isBlank() && Integer.parseInt(entry) <= 900) {
                constituencies.add(ElectionConstituencyBuilder.buildElectionState(Integer.parseInt(record.get(2)), this.election.getYear(), Integer.parseInt(entry), record.get(1)));
            }
        });

        return constituencies;
    }

    public ElectionVoteBase getElectionVotesBase() { //TODO refactor this to use one method for all three (or one object)
        List<ElectionVoteBase> baseVotes = new ArrayList<>();

        this.csvRecords.forEach(record -> {
            String entry = record.getFirst();
            if (entry.startsWith("999") && Integer.parseInt(entry) == 999) {
                baseVotes.add(ElectionVoteBaseBuilder.buildElectionVoteBase(
                        this.election.getYear(),
                        parseVoteCount(record.get(3)),
                        parseVoteCount(record.get(4)),
                        parseVoteCount(record.get(5)),
                        parseVoteCount(record.get(6)),
                        parseVoteCount(record.get(7)),
                        parseVoteCount(record.get(8)),
                        parseVoteCount(record.get(9)),
                        parseVoteCount(record.get(10)),
                        parseVoteCount(record.get(11)),
                        parseVoteCount(record.get(12)),
                        parseVoteCount(record.get(13)),
                        parseVoteCount(record.get(14)),
                        parseVoteCount(record.get(15)),
                        parseVoteCount(record.get(16)),
                        parseVoteCount(record.get(17)),
                        parseVoteCount(record.get(18))
                ));
            }
        });

        assert baseVotes.size() == 1;
        return baseVotes.getFirst();
    }

    public List<StateVoteBase> getStateVotesBase() {
        List<StateVoteBase> stateVotes = new ArrayList<>();

        this.csvRecords.forEach(record -> {
            String entry = record.getFirst();
            if (entry.startsWith("9") && !entry.equals("999") && Integer.parseInt(entry) >= 900) {
                stateVotes.add(StateVoteBaseBuilder.buildStateVoteBase(
                        this.election.getYear(),
                        parseVoteCount(entry),
                        parseVoteCount(record.get(3)),
                        parseVoteCount(record.get(4)),
                        parseVoteCount(record.get(5)),
                        parseVoteCount(record.get(6)),
                        parseVoteCount(record.get(7)),
                        parseVoteCount(record.get(8)),
                        parseVoteCount(record.get(9)),
                        parseVoteCount(record.get(10)),
                        parseVoteCount(record.get(11)),
                        parseVoteCount(record.get(12)),
                        parseVoteCount(record.get(13)),
                        parseVoteCount(record.get(14)),
                        parseVoteCount(record.get(15)),
                        parseVoteCount(record.get(16)),
                        parseVoteCount(record.get(17)),
                        parseVoteCount(record.get(18))
                ));
            }
        });

        return stateVotes;
    }

    public List<ConstituencyVoteBase> getConstituencyVotesBase() {
        List<ConstituencyVoteBase> constituencyVotes = new ArrayList<>();

        this.csvRecords.forEach(record -> {
            String entry = record.getFirst();
            if (!entry.isBlank() && !entry.startsWith("N") && Integer.parseInt(entry) < 900) {
                constituencyVotes.add(ConstituencyVoteBaseBuilder.buildConstituencyVoteBase(
                        this.election.getYear(),
                        parseVoteCount(record.get(2)),
                        parseVoteCount(entry),
                        parseVoteCount(record.get(3)),
                        parseVoteCount(record.get(4)),
                        parseVoteCount(record.get(5)),
                        parseVoteCount(record.get(6)),
                        parseVoteCount(record.get(7)),
                        parseVoteCount(record.get(8)),
                        parseVoteCount(record.get(9)),
                        parseVoteCount(record.get(10)),
                        parseVoteCount(record.get(11)),
                        parseVoteCount(record.get(12)),
                        parseVoteCount(record.get(13)),
                        parseVoteCount(record.get(14)),
                        parseVoteCount(record.get(15)),
                        parseVoteCount(record.get(16)),
                        parseVoteCount(record.get(17)),
                        parseVoteCount(record.get(18))
                ));
            }
        });

        return constituencyVotes;
    }

    public List<ElectionVoteParty> getElectionVotesParty(List<ElectionParty> parties) {
        ArrayList<ElectionVoteParty> electionVoteParties = new ArrayList<>();

        this.csvRecords.forEach(record -> {
            String entry = record.getFirst();
            if (entry.startsWith("999") && Integer.parseInt(entry) == 999) {
                parties.forEach(party -> {
                    electionVoteParties.add(ElectionVotePartyBuilder.buildElectionVoteParty(
                            this.election.getYear(),
                            party.getColumnIndex(),
                            parseVoteCount(record.get((int) (party.getColumnIndex() + 1))),
                            parseVoteCount(record.get((int) (party.getColumnIndex()))),
                            parseVoteCount(record.get((int) (party.getColumnIndex() + 3))),
                            parseVoteCount(record.get((int) (party.getColumnIndex() + 2)))
                    ));
                });
            }
        });

        return electionVoteParties;
    }

    public List<StateVoteParty> getStateVotesParty(List<ElectionParty> parties) {
        ArrayList<StateVoteParty> stateVoteParties = new ArrayList<>();

        this.csvRecords.forEach(record -> {
            String entry = record.getFirst();
            if (entry.startsWith("9") && !entry.equals("999") && Integer.parseInt(entry) >= 900) {
                parties.forEach(party -> {
                    stateVoteParties.add(StateVotePartyBuilder.buildStateVoteParty(
                            this.election.getYear(),
                            party.getColumnIndex(),
                            Integer.parseInt(record.getFirst()),
                            parseVoteCount(record.get((int) (party.getColumnIndex() + 1))),
                            parseVoteCount(record.get((int) (party.getColumnIndex()))),
                            parseVoteCount(record.get((int) (party.getColumnIndex() + 3))),
                            parseVoteCount(record.get((int) (party.getColumnIndex() + 2)))
                    ));
                });
            }
        });

        return stateVoteParties;
    }

    public List<ConstituencyVoteParty> getConstituencyVotesParty(List<ElectionParty> parties) {
        ArrayList<ConstituencyVoteParty> constituencyVoteParties = new ArrayList<>();

        this.csvRecords.forEach(record -> {
            String entry = record.getFirst();
            if (!entry.isBlank() && !entry.startsWith("N") && Integer.parseInt(entry) < 900) {
                parties.forEach(party -> {
                    constituencyVoteParties.add(ConstituencyVotePartyBuilder.buildConstituencyVoteParty(
                            this.election.getYear(),
                            Integer.parseInt(record.get(2)),
                            party.getColumnIndex(),
                            Integer.parseInt(record.getFirst()),
                            parseVoteCount(record.get((int) (party.getColumnIndex() + 1))),
                            parseVoteCount(record.get((int) (party.getColumnIndex()))),
                            parseVoteCount(record.get((int) (party.getColumnIndex() + 3))),
                            parseVoteCount(record.get((int) (party.getColumnIndex() + 2)))
                    ));
                });
            }
        });

        return constituencyVoteParties;
    }


    private long parseVoteCount(String voteCount) {
        if (voteCount == null || voteCount.isEmpty()) {
            return 0L;
        }

        return Long.parseLong(voteCount);
    }

}
