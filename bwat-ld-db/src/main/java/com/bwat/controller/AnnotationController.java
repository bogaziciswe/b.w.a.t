package com.bwat.controller;

import com.bwat.config.AnnotationValidator;
import com.bwat.core.documents.AnnotationDocument;
import com.bwat.repository.AnnotationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;

@RepositoryRestController
public class AnnotationController {
    @Autowired
    private AnnotationRepository repository;

    @Autowired
    private AnnotationValidator validator;

    @RequestMapping(value = "/annotation", method = RequestMethod.POST ,consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(value = HttpStatus.CREATED)
    public @ResponseBody void addAnnotation(@RequestBody Object object) {

        LinkedHashMap annotation = validator.validateAndExtractRawAnnotation(object);
        AnnotationDocument s = new AnnotationDocument();
        repository.save(s.load(annotation));
    }
}
