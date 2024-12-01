package org.erijl.wahlentwicklung;

import org.erijl.wahlentwicklung.enums.ConfigKeys;
import org.erijl.wahlentwicklung.errors.AssertionsNotEnabledError;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class Main {
    public static void main(String[] args) throws SQLException, IOException { //TODO proper error handling to
        ensureAssertionsAreEnabled();
        Config.verifyIntegrity();

        Config config = Config.getInstance();
        DatabaseManager dbManager = new DatabaseManager();

        for (String electionYear : config.getArrayProperty(ConfigKeys.YEARS_TO_IMPORT)) {
            ElectionParser parser = new ElectionParser(electionYear);

            List<String> parties = parser.getParties();

            parties.stream().forEach(System.out::println);
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