package org.erijl.wahlentwicklung;

import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;
import org.erijl.wahlentwicklung.enums.ElectionEnum;
import org.erijl.wahlentwicklung.protos.builder.ElectionConstituencyBuilder;
import org.erijl.wahlentwicklung.protos.builder.ElectionPartyBuilder;
import org.erijl.wahlentwicklung.protos.builder.ElectionStateBuilder;
import org.erijl.wahlentwicklung.protos.objects.ElectionConstituency;
import org.erijl.wahlentwicklung.protos.objects.ElectionParty;
import org.erijl.wahlentwicklung.protos.objects.ElectionState;

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
            if (entry.startsWith("9") && Integer.parseInt(record.get(2)) == 999) {
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

}
