package com.bwat.representation.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
public class SimpleResponse implements Response {
    private HttpStatus status;
    private String message;
}
