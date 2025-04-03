package org.erijl.wahlentwicklung.enums;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

public enum ElectionEnum {
    YEAR_2025(2025, StandardCharsets.UTF_8, 19),
    YEAR_2021(2021, StandardCharsets.UTF_8, 19),
    YEAR_2017(2017, StandardCharsets.UTF_8, 19),
    YEAR_2013(2013, Charset.forName("windows-1252"), 19),
    YEAR_2009(2009, Charset.forName("windows-1252"), 19),
    YEAR_2005(2005, Charset.forName("windows-1252"), 19);

    private final int year;
    private final Charset charset;
    private final int partyOffset;

    ElectionEnum(int year, Charset charset, int partyOffset) {
        this.year = year;
        this.charset = charset;
        this.partyOffset = partyOffset;
    }

    public Charset getCharset() {
        return this.charset;
    }

    public int getYear() {
        return this.year;
    }

    public int getPartyOffset() {
        return this.partyOffset;
    }

    public static ElectionEnum[] getElectionsInArray(String[] electionYears) {
        return Arrays.stream(electionYears)
                .map(Integer::parseInt)
                .flatMap(year -> Arrays.stream(ElectionEnum.values())
                        .filter(electionEnum -> electionEnum.getYear() == year))
                .toArray(ElectionEnum[]::new);
    }
}
