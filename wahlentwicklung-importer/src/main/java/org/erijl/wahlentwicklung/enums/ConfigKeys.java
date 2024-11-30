package org.erijl.wahlentwicklung.enums;

import java.sql.Array;

public enum ConfigKeys {
    DB_FILE_NAME(true),
    YEARS_TO_IMPORT(true, Array.class);

    final boolean isRequired;
    final Class type;

    ConfigKeys(boolean isRequired) {
        this.isRequired = isRequired;
        this.type = String.class;
    }

    ConfigKeys(boolean isRequired, Class type) {
        this.isRequired = isRequired;
        this.type = type;
    }

    public boolean isRequired() {
        return this.isRequired;
    }
    public Class getType() {
        return this.type;
    }
}
