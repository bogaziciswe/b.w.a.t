package com.bwat.core.domain;


import com.bwat.core.document.AccountDocument;
import lombok.Data;
import org.bson.types.ObjectId;

import java.util.Date;


public @Data class Account extends BaseDomainObject<AccountDocument> {
    private String username;
    private String password;
    private String email;

    public Account(String userName, String password, String email){
        this.id = new ObjectId();
        this.createdAt = new Date();
        this.username = userName;
        this.password = password;
        this.email = email;
    }

    @Override
    public AccountDocument ToDocument() {
        AccountDocument doc = new AccountDocument();
        doc.setEmail(email);
        doc.setId(id);
        doc.setPassword(password);
        doc.setUsername(username);

        return doc;
    }

    @Override
    public void Load(AccountDocument accountDocument) {
        this.id = accountDocument.getId();
        this.username = accountDocument.getUsername();
        this.password = accountDocument.getPassword();
        this.email = accountDocument.getEmail();
    }
}
