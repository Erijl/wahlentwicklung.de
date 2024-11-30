package org.erijl.wahlentwicklung.enums;

public enum ConfigKeys {
    DB_FILE_NAME(true);

    final boolean isRequired;

    ConfigKeys(boolean isRequired) {
        this.isRequired = isRequired;
    }

    public boolean isRequired() {
        return this.isRequired;
    }
}
