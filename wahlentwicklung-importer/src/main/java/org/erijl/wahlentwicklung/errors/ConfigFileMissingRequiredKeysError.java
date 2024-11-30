package org.erijl.wahlentwicklung.errors;

public class ConfigFileMissingRequiredKeysError extends Error {

    public ConfigFileMissingRequiredKeysError(String msg) {
        super(msg);
    }
}
