package org.erijl.wahlentwicklung;

import org.apache.commons.lang3.time.StopWatch;
import org.erijl.wahlentwicklung.enums.ConfigKeyEnum;
import org.erijl.wahlentwicklung.enums.ElectionEnum;
import org.erijl.wahlentwicklung.errors.AssertionsNotEnabledError;
import org.erijl.wahlentwicklung.statistics.StatisticsImporter;
import org.erijl.wahlentwicklung.utils.ValidationUtil;

import java.io.IOException;
import java.sql.SQLException;

public class Main {
    public static void main(String[] args) throws SQLException, IOException {
        ensureAssertionsAreEnabled();
        Config.verifyIntegrity();

        Config config = Config.getInstance();
        DatabaseManager dbManager = new DatabaseManager();

        for (String yearString : config.getArrayProperty(ConfigKeyEnum.YEARS_TO_IMPORT)) {
            int year = Integer.parseInt(yearString.trim());
            System.out.println(year);
            StopWatch stopWatch = new StopWatch();
            stopWatch.start();

            ElectionEnum[] modern = ElectionEnum.getElectionsInArray(new String[]{yearString.trim()});
            if (modern.length == 1) {
                ElectionParser parser = new ElectionParser(modern[0]);
                parser.parse();
                ValidationUtil.validateElectionParser(parser);
                dbManager.insertElectionData(parser, modern[0]);
            } else {
                // pre-2005: old kerg format, own parser (docs/09)
                HistoricalElectionParser parser = new HistoricalElectionParser(year);
                parser.parse();
                ValidationUtil.validateElectionParser(parser);
                dbManager.insertElectionData(parser, year);
            }

            stopWatch.stop();
            System.out.println(stopWatch.formatTime());
        }

        assert dbManager.executePostImportFixes();

        StopWatch statisticsStopWatch = new StopWatch();
        statisticsStopWatch.start();
        new StatisticsImporter(dbManager.getConnection()).run();
        statisticsStopWatch.stop();
        System.out.println("statistics: " + statisticsStopWatch.formatTime());
    }

    /**
     * Throws an error when assertions are not enabled
     */
    private static void ensureAssertionsAreEnabled() {
        try {
            assert false;
        } catch (AssertionError error) {
            return;
        }

        throw new AssertionsNotEnabledError();
    }
}