package com.bwat.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.annotation.Generated;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
@Data
public class UserAnnotation {
    @Id
    @GeneratedValue
    private long id;

    private String annotationId;

    @ManyToOne
    @JsonIgnore
    private User user;

    private boolean isPublic;
}
