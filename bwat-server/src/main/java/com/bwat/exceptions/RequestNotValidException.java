package com.bwat.exceptions;

public class RequestNotValidException extends RuntimeException {
    public RequestNotValidException(String s) {
        super(s);
    }
}
