package com.bwat.transfer;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GenericError implements ErrorMessage {
    private int code;
    private String message;

}
