package com.bwat.controller;

import com.bwat.core.domain.User;
import com.bwat.core.domain.UserAnnotation;
import com.bwat.core.request.AnnotationCreationReq;
import com.bwat.core.service.ApiService;
import com.bwat.core.service.UserAnnotationService;
import com.bwat.core.service.UserService;
import com.bwat.transfer.AnnotationRaw;
import com.bwat.transfer.AnnotationRawWrapper;
import com.bwat.transfer.AnnotationTransfer;
import com.bwat.transfer.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
        AnnotationRaw annotationRaw = apiService.createAnnotation(req.getAnnotation());
        User user = userService.findByMail(principal.getName());
        //save annotation id and user id to db.
        userAnnotationService.create(user, annotationRaw.getId(), req.isPublicAnnotation(), req.getMotivation());
        return Response.builder().data(new AnnotationRawWrapper(annotationRaw)).status("success").build();
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
        if (principal != null) {
            User user = userService.findByMail(principal.getName());
            userAnnotations = userAnnotationService.userAnnotations(user);
        }
        Set<String> validAnnotationIds = new HashSet<>();
        publicAnnotations.forEach(publicAnnotation -> validAnnotationIds.add(publicAnnotation.getAnnotationId()));
        userAnnotations.forEach(userAnnotation -> validAnnotationIds.add(userAnnotation.getAnnotationId()));

        AnnotationRaw[] annotationRaws = apiService.findAll();

        List<AnnotationRaw> annotationRawList = new ArrayList<>();

        for (AnnotationRaw annotationRaw : annotationRaws) {
            if (annotationRaw.target.getSource().equals(source) && validAnnotationIds.contains(annotationRaw.getId()))
                annotationRawList.add(annotationRaw);
        }

        List<AnnotationTransfer> annotationTransferList = new ArrayList<>();

        for (AnnotationRaw annotationRaw : annotationRawList) {
            AnnotationTransfer annotationTransfer = new AnnotationTransfer();
            annotationTransfer.setAnnotation(annotationRaw);
            UserAnnotation userAnnotation =userAnnotationService.findByAnnotationId(annotationRaw.getId());
            annotationTransfer.setUser(userAnnotation.getUser());
            annotationTransfer.setMotivation(userAnnotation.getMotivation());
            annotationTransferList.add(annotationTransfer);
        }

        return Response.builder().data(annotationTransferList).status("success").build();
    }

    @RequestMapping(value = "/{annotationId}/delete", method = RequestMethod.GET)
    @PreAuthorize("isAuthenticated()")
    public Response deleteAnnotation(@PathVariable String annotationId, Principal principal) {
        //check if user is the creator of annotation, then send request
        UserAnnotation userAnnotation = userAnnotationService.findByAnnotationId(annotationId);
        User user = userService.findByMail(principal.getName());
        if (userAnnotation != null && userAnnotation.getUser().getId() == user.getId()) {
            apiService.removeAnnotation(annotationId);
            return Response.builder().status("success").build();
        }
        return Response.builder().status("error").build();
    }

    @RequestMapping(value = "/{annotationId}/update", method = RequestMethod.POST)
    @PreAuthorize("isAuthenticated()")
    public Response updateAnnotation(@PathVariable String annotationId, @RequestBody AnnotationCreationReq req, Principal principal) {
        //check if user is the creator of annotation, then send request
        UserAnnotation userAnnotation = userAnnotationService.findByAnnotationId(annotationId);
        User user = userService.findByMail(principal.getName());
        if (userAnnotation != null && userAnnotation.getUser().getId() == user.getId()) {
            apiService.updateAnnotation(annotationId, req.getAnnotation());
            //update visibility
            userAnnotation.setPublicAnnotation(req.isPublicAnnotation());
            userAnnotationService.update(userAnnotation);
            return Response.builder().status("success").build();
        }

        return Response.builder().status("error").build();
    }
}
