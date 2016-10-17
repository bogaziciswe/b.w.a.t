package com.bwat.core.repository;

import com.bwat.core.domain.Annotation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface AnnotationRepository extends CrudRepository<Annotation, Long> {
}
