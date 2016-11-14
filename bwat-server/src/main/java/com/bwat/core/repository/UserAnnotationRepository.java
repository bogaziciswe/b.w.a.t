package com.bwat.core.repository;

import com.bwat.core.domain.UserAnnotation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAnnotationRepository extends CrudRepository<UserAnnotation, Long> {
}
