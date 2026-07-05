package org.erijl.wahlentwicklung.statistics;

import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

/**
 * Loads one statistics CSV from the additional-data resources. Handles the
 * quirks shared by all Bundeswahlleiterin downloads: per-file charset, UTF-8
 * BOM, '#'-comment and title rows before the header, quoted cells with
 * embedded line breaks (2013 kreis header).
 */
public class CsvFile {

    private final List<List<String>> rows;

    private CsvFile(List<List<String>> rows) {
        this.rows = rows;
    }

    public static CsvFile load(String resourcePath, Charset charset) {
        URL url = CsvFile.class.getClassLoader().getResource(resourcePath);
        assert url != null : "missing resource: " + resourcePath;

        File file = new File(url.getPath().replace("%20", " "));
        assert file.exists();

        List<List<String>> rows = new ArrayList<>();
        try (CSVReader reader = new CSVReaderBuilder(new FileReader(file, charset))
                .withCSVParser(new CSVParserBuilder().withSeparator(';').build()).build()) {
            String[] values;
            boolean first = true;
            while ((values = reader.readNext()) != null) {
                if (first && values.length > 0 && values[0].startsWith("﻿")) {
                    values[0] = values[0].substring(1);
                }
                first = false;
                rows.add(List.of(values));
            }
        } catch (CsvValidationException | IOException e) {
            throw new RuntimeException(resourcePath, e);
        }
        return new CsvFile(rows);
    }

    public List<List<String>> rows() {
        return rows;
    }

    /**
     * Index of the first row matching the predicate (typically the header).
     */
    public int indexOf(Predicate<List<String>> predicate) {
        for (int i = 0; i < rows.size(); i++) {
            if (predicate.test(rows.get(i))) {
                return i;
            }
        }
        throw new IllegalStateException("no row matched");
    }

    /**
     * Collapses all whitespace (incl. line breaks from wrapped header cells)
     * to single spaces and trims — label cells are compared in this form.
     */
    public static String normalize(String cell) {
        return cell == null ? "" : cell.replaceAll("\\s+", " ").trim();
    }

    /**
     * Parses integer counts: plain ("123"), dotted thousands ("1.301.543"),
     * padded (" 81.712 "). Returns null for empty cells and "X" (not standing).
     */
    public static Long count(String cell) {
        String s = normalize(cell).replace(".", "");
        if (s.isEmpty() || s.equals("X") || s.equals("-") || s.equals("–")) {
            return null;
        }
        return Long.parseLong(s);
    }

    /**
     * Parses German decimal values ("82,5", "-2,3"); strips footnote remains.
     * Returns null for empty, "X", "-", "." cells.
     */
    public static Double decimal(String cell) {
        String s = normalize(cell);
        if (s.isEmpty() || s.equals("X") || s.equals("-") || s.equals("–") || s.equals(".")) {
            return null;
        }
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("-?\\d+(?:\\.\\d{3})*(?:,\\d+)?").matcher(s);
        if (!m.find()) {
            return null;
        }
        return Double.parseDouble(m.group().replace(".", "").replace(',', '.'));
    }
}
