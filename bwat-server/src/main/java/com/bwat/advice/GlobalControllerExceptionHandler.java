package com.bwat.advice;


import com.bwat.exceptions.RequestNotValidException;
import com.bwat.transfer.ErrorMessage;
import com.bwat.transfer.ErrorResponse;
import com.bwat.transfer.Response;
import com.bwat.util.BindExceptionMapper;
import org.springframework.http.HttpStatus;
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
    public Response processValidationError(MethodArgumentNotValidException ex) {
        return Response.builder().error("Validation error").errors(BindExceptionMapper.mapToValidationError(ex)).status("error").build();
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(RequestNotValidException.class)
    @ResponseBody
    public Response processRequestNotValidError(RequestNotValidException ex) {
        return Response.builder().error(ex.getMessage()).status("error").build();
    }
}


