package com.bwat.config;

import com.bwat.core.service.ApiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import retrofit2.Retrofit;
import retrofit2.converter.jackson.JacksonConverterFactory;


@Configuration
public class RetrofitConfig {

    @Value("${app.config.annotation-server-base-url}")
    private String annotationServerBaseUrl;

    @Autowired
    private ObjectMapper objectMapper;

    @Bean
    public Retrofit retrofit() {
        return new Retrofit.Builder()
                .baseUrl(annotationServerBaseUrl)
                .addConverterFactory(jacksonConverterFactory())
                .build();
    }

    @Bean
    public JacksonConverterFactory jacksonConverterFactory() {
        return JacksonConverterFactory.create(objectMapper);
    }

    @Bean
    public ApiService apiService() {
        return retrofit().create(ApiService.class);
    }

}
