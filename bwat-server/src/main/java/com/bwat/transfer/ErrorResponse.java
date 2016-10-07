package com.bwat.transfer;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class ErrorResponse<T> implements ErrorMessage {

    private Object error;

}
