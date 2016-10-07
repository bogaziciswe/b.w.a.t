package com.bwat.advice;


import com.bwat.transfer.ErrorMessage;
import com.bwat.transfer.ErrorResponse;
import com.bwat.util.BindExceptionMapper;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;


@ControllerAdvice
public class GlobalControllerExceptionHandler {
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    public ErrorMessage processValidationError(MethodArgumentNotValidException ex) {
        return new ErrorResponse(BindExceptionMapper.mapToValidationError(ex));
    }
}


