package com.bwat.representation.message;

import com.bwat.repository.AnnotationDocument;
import lombok.Data;

import java.util.Date;

@Data
public class AnnotationRepresentation implements Response {
    public String id;
    public String annotationId;
    public Date createdAt;
    public Date updatedAt;
    public Object type;
    public Object target;
    public Object body;

    public AnnotationRepresentation(AnnotationDocument document) {
        createdAt = document.createdAt;
        updatedAt = document.updatedAt;
        type = document.type;
        target = document.target;
        body = document.body;
        id = document.id.toString();
        annotationId = "http://example.com/" + document.id.toString();
    }
}
