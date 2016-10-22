package com.bwat.advice;


import com.bwat.exception.MissingMustFieldException;
import com.bwat.representation.message.Response;
import com.bwat.representation.message.SimpleResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class AnnotationControllerAdvice {

    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MissingMustFieldException.class)
    @ResponseBody
    public Response matchForMissingMustFieldException(Exception ex){
        return new SimpleResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }
}