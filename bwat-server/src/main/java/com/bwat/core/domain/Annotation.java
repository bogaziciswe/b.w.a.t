package com.bwat.core.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Annotation {

    @JsonProperty("@context")
    private String context;

    @Id
    @GeneratedValue
    private long id;

    private String type;

    private String body;

    private String target;
}
