package com.bwat.controller;

import com.bwat.core.domain.User;
import com.bwat.core.domain.UserAnnotation;
import com.bwat.core.request.RegisterReq;
import com.bwat.core.service.ApiService;
import com.bwat.core.service.UserService;
import com.bwat.exceptions.AuthenticationFailed;
import com.bwat.transfer.AnnotationTransfer;
import com.bwat.transfer.Response;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ApiService apiService;


    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public Response login(Principal user) {
        if (user == null) {
            throw new AuthenticationFailed();
        }
        return Response.builder().data(userService.findByMail(user.getName())).status("success").build();
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public Response create(@RequestBody @Valid RegisterReq req) {
        User user = new User();
        modelMapper.map(req, user);
        return Response.builder().data(userService.register(user)).status("success").build();

    }

    //todo remove this in production, it is here for testing
    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/restricted", method = RequestMethod.GET)
    public void restricted() {

    }

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public Response logout() {
        return Response.builder().data("Hint: Server is stateless").status("success").build();
    }

    @RequestMapping(value = "/getTestUser", method = RequestMethod.GET)
    public Response getTestUser() {
        User user = userService.findByMail("test@example.com");
        if (user == null) {
            user = new User();
            user.setFirstName("John");
            user.setLastName("Doe");
            user.setPassword("test123");
            user.setMail("test@example.com");
            user.setEnabled(true);
            userService.register(user);
        }
        return Response.builder().data(user).status("success").build();
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/annotations", method = RequestMethod.GET)
    public Response getUserAnnotation(Principal principal) {
        User user = userService.findByMail(principal.getName());
        List<AnnotationTransfer> annotationTransferList = user.getUserAnnotations().stream().map(annotation -> apiService.findById(annotation.getAnnotationId())).collect(Collectors.toList());
        return Response.builder().data(annotationTransferList).status("success").build();
    }
}
