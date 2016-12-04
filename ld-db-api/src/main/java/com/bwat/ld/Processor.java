package com.bwat.ld;

import com.github.jsonldjava.core.JsonLdError;

import java.util.LinkedHashMap;

public interface Processor {
    LinkedHashMap extractAnnotationModel(Object rawLD) throws JsonLdError;
}
