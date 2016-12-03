package com.bwat.controller;

import com.bwat.core.domain.User;
import com.bwat.core.domain.UserAnnotation;
import com.bwat.core.request.AnnotationCreationReq;
import com.bwat.core.service.ApiService;
import com.bwat.core.service.UserAnnotationService;
import com.bwat.core.service.UserService;
import com.bwat.transfer.AnnotationTransfer;
import com.bwat.transfer.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@RequestMapping("/api/annotation")
public class AnnotationController {

    @Autowired
    private ApiService apiService;

    @Autowired
    private UserAnnotationService userAnnotationService;

    @Autowired
    private UserService userService;

    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "", method = POST)
    @ResponseStatus(HttpStatus.CREATED)
    public Response addAnnotation(@RequestBody AnnotationCreationReq req, Principal principal) {
        AnnotationTransfer annotationTransfer = apiService.createAnnotation(req.getAnnotation());
        User user = userService.findByMail(principal.getName());
        //save annotation id and user id to db.
        userAnnotationService.create(user, annotationTransfer.getId(), req.isPublic());
        return Response.builder().data(annotationTransfer).status("success").build();
    }

    @RequestMapping(value = "", method = GET)
    @ResponseStatus(HttpStatus.CREATED)
    public Object getAnnotations() {
        return apiService.findAll();
    }

    @RequestMapping(value = "/source", method = RequestMethod.GET)
    public Response findBySource(@RequestParam String source, Principal principal) {
        List<UserAnnotation> publicAnnotations = userAnnotationService.publicAnnotations();
        List<UserAnnotation> userAnnotations = new ArrayList<>();
        if(principal != null) {
            User user = userService.findByMail(principal.getName());
            userAnnotations = userAnnotationService.userAnnotations(user);
        }
        Set<String> validAnnotationIds = new HashSet<>();
        publicAnnotations.forEach(publicAnnotation -> validAnnotationIds.add(publicAnnotation.getAnnotationId()));
        userAnnotations.forEach(userAnnotation -> validAnnotationIds.add(userAnnotation.getAnnotationId()));

        AnnotationTransfer[] annotationTransfers = apiService.findAll();
        Object[] objects = Arrays.stream(annotationTransfers)
                .filter(annotationTransfer -> annotationTransfer.target.getSource().equals(source))
                .filter(annotationTransfer -> !validAnnotationIds.contains(annotationTransfer.getId()))
                .toArray();

        return Response.builder().data(objects).status("success").build();
    }
}
