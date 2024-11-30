package org.erijl.wahlentwicklung;

import org.erijl.wahlentwicklung.enums.ConfigKeys;
import org.erijl.wahlentwicklung.errors.AssertionsNotEnabledError;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class Main {
    public static void main(String[] args) {
        ensureAssertionsAreEnabled();
        Config.verifyIntegrity();

        Config config = Config.getInstance();

        String url = "jdbc:sqlite:" + config.getProperty(ConfigKeys.DB_FILE_NAME);

        try (Connection connection = DriverManager.getConnection(url)) {
            assert connection != null;

            URL databaseFile = Main.class.getClassLoader().getResource("create_tables.sql");
            assert databaseFile != null;

            Statement createTableStatement = connection.createStatement();

            String sql = readSqlFile(databaseFile.getPath());
            System.out.println(sql);

            createTableStatement.executeUpdate(sql);
        } catch (SQLException | IOException e) {
            e.printStackTrace();
        }
    }

    private static String readSqlFile(String filePath) throws IOException {
        System.out.println(filePath);
        StringBuilder sql = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                sql.append(line).append("\n");
            }
        }
        return sql.toString();
    }


    /**
     * Deletes old database files, and creates a new one.
     * Throws {@link Error} when file could not be created
     */
    public static void prepareFile() {
        Config config = Config.getInstance();

        URL sqliteFile = Main.class.getClassLoader().getResource(config.getProperty(ConfigKeys.DB_FILE_NAME));

        if(sqliteFile != null) {
            // TODO nuke file
        }
        File sqliteDatabase = new File(config.getProperty(ConfigKeys.DB_FILE_NAME));

        //TODO check if it exists
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