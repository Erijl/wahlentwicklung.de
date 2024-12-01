package org.erijl.wahlentwicklung.enums;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

public enum ElectionEnum {
    YEAR_2021(2021, StandardCharsets.UTF_8),
    YEAR_2017(2017, StandardCharsets.UTF_8),
    YEAR_2013(2013, Charset.forName("windows-1252")),
    YEAR_2009(2009, Charset.forName("windows-1252")),
    YEAR_2005(2005, Charset.forName("windows-1252"));

    private final int year;
    private final Charset charset;

    ElectionEnum(int year, Charset charset) {
        this.year = year;
        this.charset = charset;
    }

    public Charset getCharset() {
        return this.charset;
    }

    public int getYear() {
        return this.year;
    }

    public static ElectionEnum[] getElectionsInArray(String[] electionYears) {
        return Arrays.stream(electionYears)
                .map(Integer::parseInt)
                .flatMap(year -> Arrays.stream(ElectionEnum.values())
                        .filter(electionEnum -> electionEnum.getYear() == year))
                .toArray(ElectionEnum[]::new);
    }
}
