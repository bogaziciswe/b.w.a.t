package com.bwat.core.service.impl;

import com.bwat.core.service.ApiService;
import com.bwat.transfer.AnnotationTransfer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class ApiServiceImpl implements ApiService {

    @Value("${app.config.annotation-server-base-url}")
    private String annotationServer;

    private static RestTemplate rest = new RestTemplate();

    @Override
    public AnnotationTransfer createAnnotation(Object object) {
        return rest.postForObject(annotationServer+"/annotation", object, AnnotationTransfer.class);
    }

    @Override
    public Object getAnnotations() {
        return rest.getForObject(annotationServer + "/annotation", Object.class);
    }

    @Override
    public AnnotationTransfer findById(String id) {
        return rest.getForObject(annotationServer + "/annotation/" + id, AnnotationTransfer.class);
    }

    @Override
    public AnnotationTransfer[] findAll() {
        return rest.getForObject(annotationServer + "/annotation/all", AnnotationTransfer[].class);
    }
}
