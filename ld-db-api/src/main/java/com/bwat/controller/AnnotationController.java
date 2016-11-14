package com.bwat.controller;

import com.bwat.ld.AnnotationValidator;
import com.bwat.repository.AnnotationDocument;
import com.bwat.repository.AnnotationRepository;
import com.bwat.representation.message.AnnotationRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class AnnotationController {
    @Autowired
    private AnnotationRepository repository;

    @Autowired
    private AnnotationValidator validator;

    @RequestMapping(value = "/annotation", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public @ResponseBody
    AnnotationRepresentation addAnnotation(@RequestBody Object object) {
        LinkedHashMap annotation = validator.validateAndExtractRawAnnotation(object);
        AnnotationDocument s;
        s = new AnnotationDocument();
        AnnotationDocument savedAnnotation = repository.save(s.load(annotation));
        return new AnnotationRepresentation(savedAnnotation);
    }

    @RequestMapping("/annotation/{id}")
    public AnnotationRepresentation greeting(@PathVariable String id) {
        return new AnnotationRepresentation(repository.findOne(id));
    }

    @RequestMapping("annotation/all")
    public List<AnnotationRepresentation> annotations() {
        return repository.findAll().stream().map(AnnotationRepresentation::new).collect(Collectors.toList());
    }

}
