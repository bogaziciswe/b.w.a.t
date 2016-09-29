package com.bwat.core.document;

import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.Date;

abstract public class DocumentObject {
    @Getter @Setter @Id
    public ObjectId id;

    @Getter @Setter public Date createdAt;
}