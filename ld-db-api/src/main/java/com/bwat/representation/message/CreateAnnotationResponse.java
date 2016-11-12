package com.bwat.representation.message;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class CreateAnnotationResponse implements Response {
    public String documentId;
    public String annotationId;

    public CreateAnnotationResponse(String documentId, String annotationId) {
        this.documentId = documentId;
        this.annotationId = annotationId;
    }
}
