package com.bwat.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.annotation.Generated;
import javax.persistence.*;

@Entity
@Data
public class UserAnnotation {
    @Id
    @GeneratedValue
    private long id;

    private String annotationId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnore
    private User user;

    private boolean publicAnnotation;
}
