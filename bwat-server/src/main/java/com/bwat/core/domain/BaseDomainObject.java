package com.bwat.core.domain;

import com.bwat.core.document.DocumentObject;
import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.Date;

public abstract class BaseDomainObject<TDocument extends DocumentObject> {
    @Id @Getter @Setter
    protected ObjectId id;

    public @Getter @Setter
    Date createdAt;

    abstract public TDocument ToDocument();
    abstract public void Load(TDocument document);
}
