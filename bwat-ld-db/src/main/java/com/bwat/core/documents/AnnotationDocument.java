package com.bwat.core.documents;


import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.LinkedHashMap;

@Document
@Data
public class AnnotationDocument {
    @Id
    public ObjectId documentId;
    public String id;
    public Date createdAt;
    public Date updatedAt;
    public Object type;
    public Object target;
    public Object body;


    public AnnotationDocument load(LinkedHashMap rawAnnotation){
        documentId = new ObjectId();
        createdAt = new Date();
        updatedAt = new Date();
        id = rawAnnotation.get("id").toString();
        type = rawAnnotation.get("type");
        target = rawAnnotation.get("target");
        body = rawAnnotation.get("body");

        return this;
    }
}
