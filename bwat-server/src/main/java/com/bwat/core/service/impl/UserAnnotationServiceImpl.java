package com.bwat.core.service.impl;

import com.bwat.core.domain.User;
import com.bwat.core.domain.UserAnnotation;
import com.bwat.core.repository.UserAnnotationRepository;
import com.bwat.core.service.UserAnnotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserAnnotationServiceImpl implements UserAnnotationService {

    @Autowired
    private UserAnnotationRepository userAnnotationRepository;

    @Override
    public UserAnnotation create(User user, String annotationId, boolean isPublic, String motivation) {
        UserAnnotation userAnnotation = new UserAnnotation();
        userAnnotation.setUser(user);
        userAnnotation.setAnnotationId(annotationId);
        userAnnotation.setPublicAnnotation(isPublic);
        userAnnotation.setMotivation(motivation);
        userAnnotationRepository.save(userAnnotation);
        return userAnnotation;
    }

    @Override
    public List<UserAnnotation> findAll() {
        return userAnnotationRepository.findAll();
    }

    @Override
    public List<UserAnnotation> publicAnnotations() {
        return userAnnotationRepository.findByPublicAnnotation(true);
    }

    @Override
    public List<UserAnnotation> userAnnotations(User user) {
        return userAnnotationRepository.findByUser(user);
    }

    @Override
    public UserAnnotation findByAnnotationId(String annotationId) {
        return userAnnotationRepository.findByAnnotationId(annotationId);
    }

    @Override
    public void update(UserAnnotation userAnnotation) {
        userAnnotationRepository.save(userAnnotation);
    }

}
