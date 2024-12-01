package org.erijl.wahlentwicklung;

import org.erijl.wahlentwicklung.enums.ConfigKeyEnum;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseManager {
    private static final String JDBC_CONNECTION_PATTERN = "jdbc:sqlite:";

    private final Config config;
    private final Connection sqliteConnection;

    public DatabaseManager() throws SQLException, IOException {
        this.config = Config.getInstance();
        this.dropOldDatabase();
        this.sqliteConnection = DriverManager.getConnection(JDBC_CONNECTION_PATTERN + config.getStringProperty(ConfigKeyEnum.DB_FILE_NAME));

        assert sqliteConnection != null;
        this.createTables();
    }


    private void createTables() throws SQLException, IOException {
        URL databaseFile = Main.class.getClassLoader().getResource("create_tables.sql");
        assert databaseFile != null;

        Statement createTableStatement = this.sqliteConnection.createStatement();

        String sql = readSqlFile(databaseFile.getPath());
        createTableStatement.executeUpdate(sql);
    }

    private void dropOldDatabase() {
        File existingDbFile = new File(System.getProperty("user.dir") + "\\" + config.getStringProperty(ConfigKeyEnum.DB_FILE_NAME));
        assert !existingDbFile.exists() || existingDbFile.delete();
    }

    private static String readSqlFile(String filePath) throws IOException {
        StringBuilder sql = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                sql.append(line).append("\n");
            }
        }
        return sql.toString();
    }
}
