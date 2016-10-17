package com.bwat.core.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Created by ugur.hicyilmam on 17.10.2016.
 */
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
