package com.bwat.advice;


import com.bwat.exceptions.AuthenticationFailed;
import com.bwat.transfer.ErrorMessage;
import com.bwat.transfer.GenericError;
import com.bwat.transfer.Response;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Created by ugur.hicyilmam on 26.09.2016.
 */
@ControllerAdvice
public class UserControllerAdvice {
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(AuthenticationFailed.class)
    @ResponseBody
    public Response processLoginError(AuthenticationFailed ex) {
        return Response.builder().status("error").error("Wrong password or email").build();
    }
}
