package com.bwat.core.service;

import com.bwat.core.domain.User;
import com.bwat.core.domain.UserAnnotation;

public interface UserAnnotationService {
    UserAnnotation create(User user, String annotationId);
}
