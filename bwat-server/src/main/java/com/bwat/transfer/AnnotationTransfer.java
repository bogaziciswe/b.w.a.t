package com.bwat.transfer;

import com.bwat.core.domain.User;
import lombok.Data;

@Data
public class AnnotationTransfer {
    private AnnotationRawWrapper annotation;
    private User user;
    private String motivation;

    public String getMotivation() {
        if(motivation == null) {
            return "";
        }
        return motivation;
    }

    public void setAnnotation(AnnotationRaw raw) {
        this.annotation = new AnnotationRawWrapper(raw);
    }

    public void setAnnotation(AnnotationRawWrapper wrapper) {
        this.annotation = wrapper;
    }
}
