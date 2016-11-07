package com.bwat.core.service.impl;

import com.bwat.core.service.ApiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ApiServiceImpl implements ApiService {

    @Value("${app.config.annotation-server-base-url}")
    private String annotationServer;

    private static RestTemplate rest = new RestTemplate();

    @Override
    public Object createAnnotation(Object object) {
        return rest.postForObject(annotationServer+"/annotation", object, Object.class);
    }
}
