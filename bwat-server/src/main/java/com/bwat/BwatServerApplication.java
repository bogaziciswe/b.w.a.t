package com.bwat;

import com.bwat.config.DataLoader;
import com.bwat.core.repository.IAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BwatServerApplication {

    @Autowired
    IAccountRepository accountRepository;

    @Autowired
    DataLoader dataLoader;

	public static void main(String[] args) {
		SpringApplication.run(BwatServerApplication.class, args);
	}
}
