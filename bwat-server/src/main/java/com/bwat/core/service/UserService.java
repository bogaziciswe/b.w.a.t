package com.bwat.core.service;

import com.bwat.core.domain.User;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Created by ugur.hicyilmam on 6.10.2016.
 */
public interface UserService extends UserDetailsService {
    User register(User user);

    User findByMail(String email);
}
