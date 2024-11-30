package org.erijl.wahlentwicklung;

import org.erijl.wahlentwicklung.enums.ConfigKeys;
import org.erijl.wahlentwicklung.errors.AssertionsNotEnabledError;

import java.io.IOException;
import java.sql.SQLException;

public class Main {
    public static void main(String[] args) throws SQLException, IOException { //TODO proper error handling to
        ensureAssertionsAreEnabled();
        Config.verifyIntegrity();

        Config config = Config.getInstance();
        DatabaseManager dbManager = new DatabaseManager();

        for (String electionYear : config.getArrayProperty(ConfigKeys.YEARS_TO_IMPORT)) {
            System.out.println(electionYear);
            CsvParser parser = new CsvParser(electionYear);
        }
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