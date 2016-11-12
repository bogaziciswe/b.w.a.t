package com.bwat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnotationRepository extends MongoRepository<AnnotationDocument, String> {
}
