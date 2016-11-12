package com.bwat.exception;

public class MissingMustFieldException extends RuntimeException {
    public MissingMustFieldException(String field) {
        super("Missing annotation field according to the standard: " + field);
    }
}