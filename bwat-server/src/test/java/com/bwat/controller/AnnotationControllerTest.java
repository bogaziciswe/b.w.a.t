package com.bwat.controller;

import com.bwat.core.domain.User;
import com.bwat.core.domain.UserAnnotation;
import com.bwat.core.repository.UserRepository;
import com.bwat.core.request.AnnotationCreationReq;
import com.bwat.core.service.UserAnnotationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.transaction.Transactional;
import java.util.List;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class AnnotationControllerTest {

    @Autowired
    WebApplicationContext webApplicationContext;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserAnnotationService userAnnotationService;

    @Autowired
    private ObjectMapper mapper;

    private MockMvc mockMvc;

    private User savedUser;


    @Before
    @Transactional
    public void setUp() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();

        savedUser = new User();
        savedUser.setFirstName("John");
        savedUser.setLastName("Doe");
        savedUser.setPassword(passwordEncoder.encode("12345678"));
        savedUser.setMail("john.doe@example.com");
        userRepository.save(savedUser);

    }

    @After
    public void tearDown() throws Exception {
        userRepository.deleteAll();
    }

    @Test
    public void addAnnotation_shouldSetVisibility() throws Exception {
        AnnotationCreationReq req = new AnnotationCreationReq();
        req.setPublic(true);
        req.setAnnotation(null);

        MvcResult result = mockMvc.perform(post("/api/annotation")
                .content(mapper.writeValueAsString(req))
                .contentType(MediaType.APPLICATION_JSON)
                .with(user(savedUser.getMail())))
                .andExpect(status().is2xxSuccessful())
                .andReturn();
        String jsonRes = result.getResponse().getContentAsString();

        //check if it is public
        List<UserAnnotation> userAnnotations = userAnnotationService.userAnnotations(savedUser);
        Assert.assertTrue(userAnnotations.get(0).isPublic());

        //check it's annotation id
        String annotationId = JsonPath.read(jsonRes, "$.data.id");
        Assert.assertEquals(annotationId, userAnnotations.get(0).getAnnotationId());
    }

    @Test
    public void getAnnotations() throws Exception {

    }

    @Test
    public void findBySource() throws Exception {

    }

}