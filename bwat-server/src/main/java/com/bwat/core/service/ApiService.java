package com.bwat.core.service;

import com.bwat.transfer.AnnotationTransfer;

public interface ApiService {
    AnnotationTransfer createAnnotation(Object object);

    Object getAnnotations();

    AnnotationTransfer findById(String id);

    AnnotationTransfer[] findAll();

}
