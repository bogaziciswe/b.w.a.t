package com.bwat.representation.message;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class SimpleResponse implements Response {
    public HttpStatus status;
    public String message;

    public SimpleResponse(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
