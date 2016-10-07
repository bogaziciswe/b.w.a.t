package com.bwat.core.request;

import com.bwat.core.validation.UniqueMail;
import lombok.Data;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Size;

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
    @UniqueMail
    @Size(min = 1, max = 60)
    private String mail;
}
