package com.bwat.core.service;

import com.bwat.core.domain.User;
import com.bwat.core.domain.UserAnnotation;

import java.util.List;

public interface UserAnnotationService {
    UserAnnotation create(User user, String annotationId, boolean isPublic);
    List<UserAnnotation> findAll();
    List<UserAnnotation> publicAnnotations();
    List<UserAnnotation> userAnnotations(User user);
    UserAnnotation findByAnnotationId(String annotationId);
    void update(UserAnnotation userAnnotation);
}
