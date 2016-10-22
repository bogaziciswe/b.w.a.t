package com.bwat;

import com.bwat.config.AnnotationValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;

@SpringBootApplication
public class BwatLdDbApplication {

	@Autowired
	public AnnotationValidator annotationValidator;

    public static void main(String[] args) {
		SpringApplication.run(BwatLdDbApplication.class, args);
	}
}
