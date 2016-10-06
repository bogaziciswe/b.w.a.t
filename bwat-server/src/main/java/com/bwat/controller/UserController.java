package com.bwat.controller;

import com.bwat.core.domain.User;
import com.bwat.core.request.RegisterReq;
import com.bwat.core.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.security.Principal;

/**
 * Created by ugur.hicyilmam on 6.10.2016.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/user")
    public Principal user(Principal user) {
        return user;
    }

    @PreAuthorize("isAnonymous()")
    @RequestMapping(value = "", method = RequestMethod.POST)
    public User create(@RequestBody @Valid RegisterReq req) {
        User user = new User();
        modelMapper.map(req, user);
        return userService.register(user);
    }
}
