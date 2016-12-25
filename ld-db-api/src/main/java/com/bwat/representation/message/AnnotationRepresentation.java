package com.bwat.representation.message;

import com.bwat.repository.AnnotationDocument;
import lombok.Data;

import java.util.Date;

@Data
public class AnnotationRepresentation implements Response {
    private String id;
    private String annotationId;
    private Date createdAt;
    private Date updatedAt;
    private Object type;
    private Object target;
    private Object body;

    public AnnotationRepresentation(AnnotationDocument document, String serverUrl) {
        createdAt = document.createdAt;
        updatedAt = document.updatedAt;
        type = document.type;
        target = document.target;
        body = document.body;
        id = document.id.toString();
        annotationId = serverUrl + document.id.toString();
    }
}
