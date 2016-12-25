package com.bwat.transfer;

import com.bwat.core.domain.User;
import lombok.Data;

@Data
public class AnnotationTransfer {
    private AnnotationRawWrapper annotation;
    private User user;

    public void setAnnotation(AnnotationRaw raw) {
        this.annotation = new AnnotationRawWrapper(raw);
    }

    public void setAnnotation(AnnotationRawWrapper wrapper) {
        this.annotation = wrapper;
    }
}
