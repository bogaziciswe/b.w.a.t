package com.bwat.core.request;

import lombok.Data;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Size;

/**
 * Created by ugur.hicyilmam on 6.10.2016.
 */
@Data
public class RegisterReq {

    @NotEmpty
    @Size(min = 1, max = 20)
    private String firstName;
    @NotEmpty
    @Size(min = 1, max = 20)
    private String lastName;
    @NotEmpty
    @Size(min = 6, max = 20)
    private String password;
    @NotEmpty
    @Email
    @Size(min = 1, max = 60)
    private String mail;
}
