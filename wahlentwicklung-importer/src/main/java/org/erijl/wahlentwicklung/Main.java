package org.erijl.wahlentwicklung;

import org.apache.commons.lang3.time.StopWatch;
import org.erijl.wahlentwicklung.enums.ConfigKeyEnum;
import org.erijl.wahlentwicklung.enums.ElectionEnum;
import org.erijl.wahlentwicklung.errors.AssertionsNotEnabledError;
import org.erijl.wahlentwicklung.utils.ValidationUtil;

import java.io.IOException;
import java.sql.SQLException;

public class Main {
    public static void main(String[] args) throws SQLException, IOException {
        ensureAssertionsAreEnabled();
        Config.verifyIntegrity();

        Config config = Config.getInstance();
        DatabaseManager dbManager = new DatabaseManager();

        for (ElectionEnum election : ElectionEnum.getElectionsInArray(config.getArrayProperty(ConfigKeyEnum.YEARS_TO_IMPORT))) {
            System.out.println(election.getYear());
            StopWatch stopWatch = new StopWatch();
            stopWatch.start();
            ElectionParser parser = new ElectionParser(election);

            parser.parse();

            ValidationUtil.validateElectionParser(parser);

            dbManager.insertElectionData(parser, election);
            stopWatch.stop();
            System.out.println(stopWatch.formatTime());
        }

        assert dbManager.executePostImportFixes();
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