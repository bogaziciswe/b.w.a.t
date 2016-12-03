package com.bwat.transfer;

import com.bwat.core.domain.User;
import lombok.Data;

@Data
public class AnnotationTransfer {
    private AnnotationRaw annotation;
    private User user;
}
