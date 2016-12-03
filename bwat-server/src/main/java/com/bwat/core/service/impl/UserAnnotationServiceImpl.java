package com.bwat.core.service.impl;

import com.bwat.core.domain.User;
import com.bwat.core.domain.UserAnnotation;
import com.bwat.core.repository.UserAnnotationRepository;
import com.bwat.core.service.UserAnnotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserAnnotationServiceImpl implements UserAnnotationService {

    @Autowired
    private UserAnnotationRepository userAnnotationRepository;

    @Override
    public UserAnnotation create(User user, String annotationId, boolean isPublic) {
        UserAnnotation userAnnotation = new UserAnnotation();
        userAnnotation.setUser(user);
        userAnnotation.setAnnotationId(annotationId);
        userAnnotation.setPublic(isPublic);
        userAnnotationRepository.save(userAnnotation);
        return userAnnotation;
    }

    @Override
    public List<UserAnnotation> findAll() {
        return userAnnotationRepository.findAll();
    }

    @Override
    public List<UserAnnotation> publicAnnotations() {
        return userAnnotationRepository.findByIsPublic(true);
    }

    @Override
    public List<UserAnnotation> userAnnotations(User user) {
        return userAnnotationRepository.findByUser(user);
    }

    @Override
    public UserAnnotation findByAnnotationId(String annotationId) {
        return userAnnotationRepository.findByAnnotationId(annotationId);
    }

}
