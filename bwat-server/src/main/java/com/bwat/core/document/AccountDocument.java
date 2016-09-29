package com.bwat.core.document;


import lombok.Data;


public @Data class AccountDocument extends DocumentObject {
    private String username;
    private String password;
    private String email;
}
