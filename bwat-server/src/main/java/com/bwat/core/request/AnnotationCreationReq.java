package com.bwat.core.request;

import lombok.Data;

@Data
public class AnnotationCreationReq {
    private Object annotation;
    private boolean isPublic;
}
