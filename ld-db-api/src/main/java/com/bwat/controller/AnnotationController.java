package com.bwat.controller;

import com.bwat.ld.AnnotationValidator;
import com.bwat.repository.AnnotationDocument;
import com.bwat.repository.AnnotationRepository;
import com.bwat.representation.message.AnnotationRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class AnnotationController {
    @Autowired
    private AnnotationRepository repository;

    @Autowired
    private AnnotationValidator validator;

    @Value("${server-url}")
    private String serverUrl;

    @RequestMapping(value = "/annotation", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public
    @ResponseBody
    AnnotationRepresentation addAnnotation(@RequestBody Object object) {
        System.out.println("request fetched");
        LinkedHashMap annotation = validator.validateAndExtractRawAnnotation(object);
        AnnotationDocument s = new AnnotationDocument();
        AnnotationDocument savedAnnotation = repository.save(s.load(annotation));
        return new AnnotationRepresentation(savedAnnotation, serverUrl);
    }

    @RequestMapping("/annotation/{id}")
    public AnnotationRepresentation greeting(@PathVariable String id) {
        return new AnnotationRepresentation(repository.findOne(id), serverUrl);
    }

    @RequestMapping("annotation/all")
    public List<AnnotationRepresentation> annotations() {
        return repository.findAll().stream().map(annotationDocument -> new AnnotationRepresentation(annotationDocument, serverUrl)).collect(Collectors.toList());
    }

    @RequestMapping(value = "/annotation/{id}", method = RequestMethod.PUT)
    public String update(@RequestBody Object object, @PathVariable String id) {
        LinkedHashMap annotation = validator.validateAndExtractRawAnnotation(object);
        if (repository.exists(id)) {
            AnnotationDocument updatedAnnotation = repository.findOne(id);
            updatedAnnotation.update(annotation);
            repository.save(updatedAnnotation);
            return "Success";
        }
        return "Not found";
}

    @RequestMapping(value = "/annotation/{id}", method = RequestMethod.DELETE)
    public String delete(@PathVariable String id) {
        boolean exists = repository.exists(id);
        if (exists) {
            repository.delete(id);
            return "Success";
        }
        return "Not found";
    }

}
