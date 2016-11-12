package com.bwat;

import com.bwat.ld.AnnotationValidator;
import com.github.fakemongo.Fongo;
import com.mongodb.MongoClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BwatLdDbApplication {

	@Autowired
	public AnnotationValidator annotationValidator;

	public static void main(String[] args) {
		SpringApplication.run(BwatLdDbApplication.class, args);
	}

	@Bean
	public MongoClient mongo() {
		return new Fongo("test").getMongo();
	}
}
