package com.bwat.controller;

import com.bwat.core.domain.User;
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
import java.util.Arrays;

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
    public Object addAnnotation(@RequestBody Object object, Principal principal) {
        AnnotationTransfer annotationTransfer = apiService.createAnnotation(object);
        User user = userService.findByMail(principal.getName());
        //save annotation id and user id to db.
        userAnnotationService.create(user, annotationTransfer.getId());
        return annotationTransfer;
    }

    @RequestMapping(value = "", method = GET)
    @ResponseStatus(HttpStatus.CREATED)
    public Object getAnnotations() {
        return apiService.findAll();
    }

    @RequestMapping(value = "/source", method = RequestMethod.GET)
    public Response findBySource(@RequestParam String source) {
        AnnotationTransfer[] annotationTransfers = apiService.findAll();
        Object[] objects = Arrays.stream(annotationTransfers).filter(annotationTransfer -> annotationTransfer.target.getSource().equals(source)).toArray();
        return Response.builder().data(objects).status("success").build();
    }

}
