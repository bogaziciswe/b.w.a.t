package com.bwat.core.service.impl;

import com.bwat.core.domain.User;
import com.bwat.core.domain.UserAnnotation;
import com.bwat.core.repository.UserAnnotationRepository;
import com.bwat.core.service.UserAnnotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAnnotationServiceImpl implements UserAnnotationService {

    @Autowired
    private UserAnnotationRepository userAnnotationRepository;

    @Override
    public UserAnnotation create(User user, String annotationId) {
        UserAnnotation userAnnotation = new UserAnnotation();
        userAnnotation.setUser(user);
        userAnnotation.setAnnotationId(annotationId);
        userAnnotationRepository.save(userAnnotation);
        return userAnnotation;
    }
}
