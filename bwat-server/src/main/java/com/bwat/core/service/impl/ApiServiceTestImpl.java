package com.bwat.core.service.impl;

import com.bwat.core.service.ApiService;
import com.bwat.transfer.AnnotationRaw;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

@Service
@Profile("test")
public class ApiServiceTestImpl implements ApiService {
    @Override
    public AnnotationRaw createAnnotation(Object object) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = AnnotationRaw.class.getResourceAsStream("/newAnnotation.json");
            return mapper.readValue(is, AnnotationRaw.class);
        } catch (IOException ignore) {
            //ignoring is bliss
        }
        return null;
    }

    @Override
    public Object getAnnotations() {
        return null;
    }

    @Override
    public AnnotationRaw findById(String id) {
        return null;
    }

    @Override
    public AnnotationRaw[] findAll() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = AnnotationRaw.class.getResourceAsStream("/allAnnotations.json");
            return mapper.readValue(is, AnnotationRaw[].class);
        } catch (IOException ignore) {
            //ignoring is bliss
        }
        return null;
    }

    @Override
    public void removeAnnotation(String annotationId) {

    }

    @Override
    public void updateAnnotation(String annotationId, Object object) {

    }
}
