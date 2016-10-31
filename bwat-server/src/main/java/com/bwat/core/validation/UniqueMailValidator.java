package com.bwat.core.validation;

import com.bwat.core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class UniqueMailValidator implements ConstraintValidator<UniqueMail, String> {

    @Autowired
    private UserService userService;

    public void initialize(UniqueMail constraint) {
    }

    public boolean isValid(String mail, ConstraintValidatorContext context) {
        return (userService.findByMail(mail) == null);
    }
}
