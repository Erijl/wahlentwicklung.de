package org.erijl.wahlentwicklung.errors;

public class AssertionsNotEnabledError extends Error {

    public AssertionsNotEnabledError() {
        super("Assertions must be enabled for this application to function correctly. " +
                "Please use the -ea flag as a VM argument when running the application.");
    }
}
