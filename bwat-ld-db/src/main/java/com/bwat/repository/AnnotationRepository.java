package com.bwat.repository;

import com.bwat.core.documents.AnnotationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource(collectionResourceRel = "annotation", path = "annotation")
public interface AnnotationRepository extends MongoRepository<AnnotationDocument, String> {
}
