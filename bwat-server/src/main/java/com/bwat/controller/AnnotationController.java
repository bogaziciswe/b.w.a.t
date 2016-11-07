package com.bwat.controller;

import com.bwat.core.service.ApiService;
import com.bwat.exceptions.RequestNotValidException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import retrofit2.Response;

import java.io.IOException;

import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@RequestMapping("/api/annotation")
public class AnnotationController {


    @Autowired
    private ApiService apiService;

//    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "", method = POST)
    @ResponseStatus(HttpStatus.CREATED)
    public Object addAnnotation(@RequestBody Object object) {
        return apiService.createAnnotation(object);
    }
}
