package org.erijl.wahlentwicklung;

import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ElectionParser {
    private static final char DELIMITER = ';'; //TODO make delimiter configurable

    private final String year;
    private File fileToRead;
    private final List<List<String>> csvRecords;

    public ElectionParser(String year) {
        this.year = year;
        this.ensureFileExists();
        this.csvRecords = new ArrayList<>();

        CSVParser csvParser = new CSVParserBuilder().withSeparator(DELIMITER).build();

        boolean skippedComments = false;
        try (CSVReader csvReader = new CSVReaderBuilder(new FileReader(this.fileToRead)).withCSVParser(csvParser).build()) {
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
        URL electionFilePath = getClass().getClassLoader().getResource("raw-election-data/btw" + this.year + "_kerg.csv");
        assert electionFilePath != null;

        this.fileToRead = new File(electionFilePath.getPath());
        assert this.fileToRead.exists();
    }

    public List<String> getParties() {
        List<String> parties = new ArrayList<>();

        for (int i = 19; i < this.csvRecords.getFirst().size(); i += 4) {
            parties.add(this.csvRecords.getFirst().get(i));
        }

        return parties;
    }

}
