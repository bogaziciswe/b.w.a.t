package com.bwat.core.service;

import com.bwat.transfer.AnnotationRaw;

public interface ApiService {
    AnnotationRaw createAnnotation(Object object);

    Object getAnnotations();

    AnnotationRaw findById(String id);

    AnnotationRaw[] findAll();

}
