package com.bwat.core.service;

import com.bwat.core.domain.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    User register(User user);

    User findByMail(String email);
}
