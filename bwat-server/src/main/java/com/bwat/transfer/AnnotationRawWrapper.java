package com.bwat.transfer;

import java.util.Date;

public class AnnotationRawWrapper {
    public String id;
    public Date createdAt;
    public Date updatedAt;
    public Object type;
    public Target target;
    public Object body;

    public AnnotationRawWrapper(AnnotationRaw raw) {
        this.id = raw.getAnnotationId();
        this.createdAt = raw.getCreatedAt();
        this.updatedAt = raw.getUpdatedAt();
        this.type = raw.getType();
        this.target = raw.getTarget();
        this.body = raw.getBody();
    }
}
