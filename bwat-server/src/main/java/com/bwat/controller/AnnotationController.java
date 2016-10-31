package com.bwat.controller;

import com.bwat.core.service.ApiService;
import com.bwat.exceptions.RequestNotValidException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import retrofit2.Response;

import java.io.IOException;

import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@RequestMapping("/api/annotation")
public class AnnotationController {


    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    ApiService apiService;

    @RequestMapping(value = "", method = POST)
    public Object addAnnotation(@RequestBody Object object) {
        System.out.println("request sent");
        try {
            Response<Object> response = apiService.addAnnotation(object).execute();
            if (response.isSuccessful()) {
                return response.body();
            } else {
                return objectMapper.readValue(response.errorBody().string(), Object.class);
            }
        } catch (IOException e) {
            throw new RequestNotValidException();
        }
    }
}
