package com.bwat.controller;

import com.bwat.core.domain.User;
import com.bwat.core.request.RegisterReq;
import com.bwat.core.service.UserService;
import com.bwat.exceptions.AuthenticationFailed;
import com.bwat.transfer.SuccessMessage;
import com.bwat.transfer.SuccessResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @RequestMapping(value = "/login")
    public SuccessMessage login(Principal user) {
        if (user == null) {
            throw new AuthenticationFailed();
        }
        return new SuccessResponse(userService.findByMail(user.getName()));
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public SuccessResponse create(@RequestBody @Valid RegisterReq req) {
        User user = new User();
        modelMapper.map(req, user);
        return new SuccessResponse(userService.register(user));
    }

    //todo remove this in production, it is here for testing
    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/restricted", method = RequestMethod.GET)
    public void restricted() {

    }

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public SuccessMessage logout() {
        return new SuccessResponse("Hint: The server works stateless. To logout, remove authentication header on client.");
    }


}
