package org.erijl.wahlentwicklung;

import org.erijl.wahlentwicklung.enums.ConfigKeyEnum;
import org.erijl.wahlentwicklung.enums.ElectionEnum;
import org.erijl.wahlentwicklung.errors.AssertionsNotEnabledError;
import org.erijl.wahlentwicklung.protos.objects.*;
import org.erijl.wahlentwicklung.utils.ValidationUtil;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) throws SQLException, IOException { //TODO proper error handling to
        ensureAssertionsAreEnabled();
        Config.verifyIntegrity();

        Config config = Config.getInstance();
        DatabaseManager dbManager = new DatabaseManager();

        for (ElectionEnum election : ElectionEnum.getElectionsInArray(config.getArrayProperty(ConfigKeyEnum.YEARS_TO_IMPORT))) {
            ElectionParser parser = new ElectionParser(election);

            parser.parse();

            ValidationUtil.validateElectionParser(parser);




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