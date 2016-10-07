package com.bwat.transfer;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.FieldError;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class ValidationError {

    private int code;
    private String message;
    private List<FieldErrorData> fieldErrors = new ArrayList<>();

    public ValidationError(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public void addFieldError(FieldError fieldError) {
        fieldErrors.add(new FieldErrorData(
                fieldError.getField(),
                fieldError.getRejectedValue().toString(),
                fieldError.getDefaultMessage()
        ));
    }

}
