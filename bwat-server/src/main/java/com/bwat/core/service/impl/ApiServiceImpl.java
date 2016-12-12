package com.bwat.core.service.impl;

import com.bwat.core.service.ApiService;
import com.bwat.transfer.AnnotationRaw;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Profile({"default", "dev"})
public class ApiServiceImpl implements ApiService {

    @Value("${app.config.annotation-server-base-url}")
    private String annotationServer;

    private static RestTemplate rest = new RestTemplate();

    @Override
    public AnnotationRaw createAnnotation(Object object) {
        return rest.postForObject(annotationServer + "/annotation", object, AnnotationRaw.class);
    }

    @Override
    public Object getAnnotations() {
        return rest.getForObject(annotationServer + "/annotation", Object.class);
    }

    @Override
    public AnnotationRaw findById(String id) {
        return rest.getForObject(annotationServer + "/annotation/" + id, AnnotationRaw.class);
    }

    @Override
    public AnnotationRaw[] findAll() {
        return rest.getForObject(annotationServer + "/annotation/all", AnnotationRaw[].class);
    }

    @Override
    public void removeAnnotation(String annotationId) {
        rest.delete(annotationServer + "/annotation/" + annotationId);
    }

    @Override
    public void updateAnnotation(String annotationId, Object object) {
        rest.put(annotationServer + "/annotation/" + annotationId, object);
    }
}
