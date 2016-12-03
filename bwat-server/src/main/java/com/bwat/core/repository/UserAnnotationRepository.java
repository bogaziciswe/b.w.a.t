package com.bwat.core.repository;

import com.bwat.core.domain.User;
import com.bwat.core.domain.UserAnnotation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAnnotationRepository extends CrudRepository<UserAnnotation, Long> {
    List<UserAnnotation> findAll();
    List<UserAnnotation> findByIsPublic(boolean isPublic);
    List<UserAnnotation> findByUser(User user);
}
