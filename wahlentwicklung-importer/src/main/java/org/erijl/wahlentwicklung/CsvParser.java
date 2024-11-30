package org.erijl.wahlentwicklung;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CsvParser {

    private final String year;
    private File fileToRead;

    public CsvParser(String year) {
        this.year = year;
        this.ensurefileExists();

        List<List<String>> records = new ArrayList<>();
        try (CSVReader csvReader = new CSVReader(new FileReader(this.fileToRead))) {
            String[] values;
            while ((values = csvReader.readNext()) != null) {
                records.add(Arrays.asList(values));
            }
        } catch (CsvValidationException | IOException e) {
            throw new RuntimeException(e);
        }
        System.out.println(records.getLast());
    }

    private void ensurefileExists() {
        URL electionFilePath = getClass().getClassLoader().getResource("raw-election-data/btw" + this.year + "_kerg.csv");
        assert electionFilePath != null;

        this.fileToRead = new File(electionFilePath.getPath());
        assert this.fileToRead.exists();
    }
}
