package com.bwat.controller;

import com.bwat.core.domain.User;
import com.bwat.core.domain.UserAnnotation;
import com.bwat.core.repository.UserAnnotationRepository;
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

import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
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
    private UserAnnotationRepository userAnnotationRepository;

    @Autowired
    private ObjectMapper mapper;

    private MockMvc mockMvc;

    private User johnDoe;

    private User janeDoe;


    @Before
    @Transactional
    public void setUp() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();

        johnDoe = new User();
        johnDoe.setFirstName("John");
        johnDoe.setLastName("Doe");
        johnDoe.setPassword(passwordEncoder.encode("12345678"));
        johnDoe.setMail("john.doe@example.com");
        userRepository.save(johnDoe);

        janeDoe = new User();
        janeDoe.setFirstName("Jane");
        janeDoe.setLastName("Doe");
        janeDoe.setPassword(passwordEncoder.encode("12345678"));
        janeDoe.setMail("jane.doe@example.com");
        userRepository.save(janeDoe);

//      ##CREATE SOME ANNOTATIONS##
//      public1
        UserAnnotation userAnnotation = new UserAnnotation();
        userAnnotation.setAnnotationId("public1");
        userAnnotation.setUser(johnDoe);
        userAnnotation.setPublicAnnotation(true);
        userAnnotationRepository.save(userAnnotation);
//      public2
        userAnnotation = new UserAnnotation();
        userAnnotation.setAnnotationId("public2");
        userAnnotation.setUser(johnDoe);
        userAnnotation.setPublicAnnotation(true);
        userAnnotationRepository.save(userAnnotation);
//      private1
        userAnnotation = new UserAnnotation();
        userAnnotation.setAnnotationId("private1");
        userAnnotation.setUser(johnDoe);
        userAnnotation.setPublicAnnotation(false);
        userAnnotationRepository.save(userAnnotation);
//      private2
        userAnnotation = new UserAnnotation();
        userAnnotation.setAnnotationId("private2");
        userAnnotation.setUser(johnDoe);
        userAnnotation.setPublicAnnotation(false);
        userAnnotationRepository.save(userAnnotation);
//      public1OtherUser
        userAnnotation = new UserAnnotation();
        userAnnotation.setAnnotationId("public1OtherUser");
        userAnnotation.setUser(janeDoe);
        userAnnotation.setPublicAnnotation(true);
        userAnnotationRepository.save(userAnnotation);
//      public2OtherUser
        userAnnotation = new UserAnnotation();
        userAnnotation.setAnnotationId("public2OtherUser");
        userAnnotation.setUser(janeDoe);
        userAnnotation.setPublicAnnotation(true);
        userAnnotationRepository.save(userAnnotation);
//      private1OtherUser
        userAnnotation = new UserAnnotation();
        userAnnotation.setAnnotationId("private1OtherUser");
        userAnnotation.setUser(janeDoe);
        userAnnotation.setPublicAnnotation(false);
        userAnnotationRepository.save(userAnnotation);
    }

    @After
    public void tearDown() throws Exception {
        userRepository.deleteAll();
    }

    @Test
    public void addAnnotation_shouldSetVisibility() throws Exception {
        AnnotationCreationReq req = new AnnotationCreationReq();
        req.setPublicAnnotation(true);
        req.setAnnotation(null);

        MvcResult result = mockMvc.perform(post("/api/annotation")
                .content(mapper.writeValueAsString(req))
                .contentType(MediaType.APPLICATION_JSON)
                .with(user(johnDoe.getMail())))
                .andExpect(status().is2xxSuccessful())
                .andReturn();
        String jsonRes = result.getResponse().getContentAsString();

        //check if it is public
        List<UserAnnotation> userAnnotations = userAnnotationService.userAnnotations(johnDoe);
        Assert.assertTrue(userAnnotations.get(4).isPublicAnnotation());

        //check it's annotation id
        String annotationId = JsonPath.read(jsonRes, "$.data.id");
        Assert.assertEquals(annotationId, userAnnotations.get(4).getAnnotationId());
    }

    @Test
    public void getAnnotations() throws Exception {


    }

    @Test
    public void findBySource_shouldReturnPublicAnnotationsWithNoAuth() throws Exception {
        mockMvc.perform(get("/api/annotation/source?source=http://example.org/ebook")
                .contentType(MediaType.APPLICATION_JSON))
//                .with(user(johnDoe.getMail())))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.data[0].annotation.id", is("public1")))
                .andExpect(jsonPath("$.data[0].user.mail", is(johnDoe.getMail())))
                .andExpect(jsonPath("$.data[1].annotation.id", is("public2")))
                .andExpect(jsonPath("$.data[1].user.mail", is(johnDoe.getMail())))
                .andExpect(jsonPath("$.data[2].annotation.id", is("public1OtherUser")))
                .andExpect(jsonPath("$.data[2].user.mail", is(janeDoe.getMail())))
                .andExpect(jsonPath("$.data[3].annotation.id", is("public2OtherUser")))
                .andExpect(jsonPath("$.data[3].user.mail", is(janeDoe.getMail())))

                .andReturn();
    }

    @Test
    public void findBySource_shouldReturnPublicAndPrivateAnnotationsOfUser() throws Exception {
        mockMvc.perform(get("/api/annotation/source?source=http://example.org/ebook")
                .contentType(MediaType.APPLICATION_JSON)
                .with(user(johnDoe.getMail())))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.data[0].annotation.id", is("public1")))
                .andExpect(jsonPath("$.data[0].user.mail", is(johnDoe.getMail())))
                .andExpect(jsonPath("$.data[1].annotation.id", is("public2")))
                .andExpect(jsonPath("$.data[1].user.mail", is(johnDoe.getMail())))
                .andExpect(jsonPath("$.data[2].annotation.id", is("private1")))
                .andExpect(jsonPath("$.data[2].user.mail", is(johnDoe.getMail())))
                .andExpect(jsonPath("$.data[3].annotation.id", is("private2")))
                .andExpect(jsonPath("$.data[3].user.mail", is(johnDoe.getMail())))
                .andExpect(jsonPath("$.data[4].annotation.id", is("public1OtherUser")))
                .andExpect(jsonPath("$.data[4].user.mail", is(janeDoe.getMail())))
                .andExpect(jsonPath("$.data[5].annotation.id", is("public2OtherUser")))
                .andExpect(jsonPath("$.data[5].user.mail", is(janeDoe.getMail())))
                .andReturn();
    }

}