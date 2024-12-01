package org.erijl.wahlentwicklung;

import org.erijl.wahlentwicklung.enums.ConfigKeyEnum;
import org.erijl.wahlentwicklung.errors.ConfigFileMissingRequiredKeysError;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Array;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

public class Config {

    private final Properties properties;

    private Config() {
        this.properties = new Properties();
        try (InputStream input = getClass().getClassLoader().getResourceAsStream(".env")) {
            assert input != null;

            this.properties.load(input);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        this.verifyConfigIntegrity();
    }

    private void verifyConfigIntegrity() {
        List<String> missingRequiredConfigKeys = Arrays.stream(ConfigKeyEnum.values())
                .filter(key -> this.getRawPropertyValue(key) == null && key.isRequired())
                .map(ConfigKeyEnum::name)
                .toList();

        if (!missingRequiredConfigKeys.isEmpty()) {
            String errorString = "Missing Configkeys, that are required: " +
                    String.join(", ", missingRequiredConfigKeys);

            throw new ConfigFileMissingRequiredKeysError(errorString);
        }
    }

    private static final class InstanceHolder {
        private static final Config instance = new Config();
    }

    public static Config getInstance() {
        return InstanceHolder.instance;
    }

    public String getStringProperty(ConfigKeyEnum key) {
        assert String.class == key.getType();
        return this.properties.getProperty(key.name());
    }

    public String[] getArrayProperty(ConfigKeyEnum key) {
        assert Array.class == key.getType();
        return this.properties.getProperty(key.name()).split(",");
    }

    public static void verifyIntegrity() {
        getInstance();
    }

    private String getRawPropertyValue(ConfigKeyEnum key) {
        return this.properties.getProperty(key.name());
    }

}
