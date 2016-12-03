package com.bwat.core.service.impl;

import com.bwat.core.service.ApiService;
import com.bwat.transfer.AnnotationTransfer;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

@Service
@Profile("test")
public class ApiServiceTestImpl implements ApiService {
    @Override
    public AnnotationTransfer createAnnotation(Object object) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = AnnotationTransfer.class.getResourceAsStream("/newAnnotation.json");
            return mapper.readValue(is, AnnotationTransfer.class);
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
    public AnnotationTransfer findById(String id) {
        return null;
    }

    @Override
    public AnnotationTransfer[] findAll() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = AnnotationTransfer.class.getResourceAsStream("/allAnnotations.json");
            return mapper.readValue(is, AnnotationTransfer[].class);
        } catch (IOException ignore) {
            //ignoring is bliss
        }
        return null;
    }
}
