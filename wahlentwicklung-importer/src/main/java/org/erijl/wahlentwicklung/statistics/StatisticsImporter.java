package org.erijl.wahlentwicklung.statistics;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Imports the statistics domains (docs/08): Zeitreihen, RWS 2017–2025,
 * Urne/Brief per Wahlkreis 2009–2025, Kreisergebnisse 2009–2025 and
 * Strukturdaten 2013–2025. Runs after the kerg elections are imported
 * (the QA gates compare against them).
 */
public class StatisticsImporter {

    private static final Charset CP1252 = Charset.forName("windows-1252");

    /** downloads before 2021 are windows-1252, 2021+ UTF-8 (kerg pattern) */
    private static final Map<Integer, Charset> WEITERE_CHARSETS = Map.of(
            2009, CP1252, 2013, CP1252, 2017, CP1252,
            2021, StandardCharsets.UTF_8, 2025, StandardCharsets.UTF_8);

    private final Connection connection;

    public StatisticsImporter(Connection connection) {
        this.connection = connection;
    }

    public void run() throws SQLException {
        StatLookups lookups = new StatLookups(connection);
        StatisticsDatabaseWriter writer = new StatisticsDatabaseWriter(connection);

        System.out.println("statistics: zeitreihen");
        ZeitreihenParser zeitreihen = new ZeitreihenParser(lookups);
        zeitreihen.parse();
        writer.writeZeitreihen(zeitreihen);

        for (int year : List.of(2017, 2021, 2025)) {
            System.out.println("statistics: rws " + year);
            RwsParser rws = new RwsParser(year, lookups);
            rws.parse();
            writer.writeRws(rws);
        }

        for (int year : List.of(2009, 2013, 2017, 2021, 2025)) {
            System.out.println("statistics: weitere-ergebnisse " + year);
            BriefWkrParser briefWkr = new BriefWkrParser(year, WEITERE_CHARSETS.get(year), lookups);
            briefWkr.parse();
            writer.writeBriefWkr(briefWkr);

            KreisParser kreis = new KreisParser(year, WEITERE_CHARSETS.get(year), lookups);
            kreis.parse();
            writer.writeKreis(kreis);
        }

        for (int year : List.of(2013, 2017, 2021, 2025)) {
            System.out.println("statistics: strukturdaten " + year);
            StrukturdatenParser strukturdaten = new StrukturdatenParser(year, WEITERE_CHARSETS.get(year), connection);
            strukturdaten.parse();
            writer.writeStrukturdaten(strukturdaten);
        }

        System.out.println("statistics: QA gates");
        new StatisticsValidator(connection).validate();
    }
}
