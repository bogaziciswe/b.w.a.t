package com.bwat.transfer;

import lombok.Data;
import java.util.Date;

@Data
public class AnnotationTransfer {
    public String id;
    public String annotationId;
    public Date createdAt;
    public Date updatedAt;
    public Object type;
    public Target target;
    public Object body;
}
