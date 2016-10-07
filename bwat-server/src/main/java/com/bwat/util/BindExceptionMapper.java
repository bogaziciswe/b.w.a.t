package com.bwat.util;

import com.bwat.transfer.ValidationError;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;


public class BindExceptionMapper {
    public static ValidationError mapToValidationError(MethodArgumentNotValidException from) {
        ValidationError to = new ValidationError(400, "Validation failed");
        List<FieldError> fieldErrors = from.getBindingResult().getFieldErrors();
        fieldErrors.forEach(to::addFieldError);
        return to;
    }
}
