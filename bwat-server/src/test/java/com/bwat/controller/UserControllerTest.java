package com.bwat.controller;

import com.bwat.core.domain.User;
import com.bwat.core.repository.UserRepository;
import com.bwat.core.request.RegisterReq;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.junit.After;
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

import java.util.Calendar;
import java.util.Date;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class UserControllerTest {

    @Autowired
    WebApplicationContext webApplicationContext;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper mapper;

    private MockMvc mockMvc;

    private User savedUser;

    private RegisterReq registerReq;

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

        registerReq = new RegisterReq();
        registerReq.setFirstName("John");
        registerReq.setLastName("Smith");
        registerReq.setMail("john.smith@example.com");
        registerReq.setPassword("12345678");

    }

    @After
    public void tearDown() throws Exception {
        userRepository.deleteAll();
    }

    @Test
    public void user() throws Exception {

    }

    /**
     * Tests user registration
     */
    @Test
    public void create() throws Exception {
        String jsonReq = mapper.writeValueAsString(registerReq);

        MvcResult result = mockMvc.perform(post("/api/users")
                .content(jsonReq)
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.mail", is(registerReq.getMail())))
                .andExpect(jsonPath("$.firstName", is(registerReq.getFirstName())))
                .andExpect(jsonPath("$.lastName", is(registerReq.getLastName())))
                .andExpect(jsonPath("$.password").doesNotExist())
                .andReturn();
        String jsonRes = result.getResponse().getContentAsString();

        System.out.println("#####");
        System.out.println(jsonRes);

        //      check registration date +-
        Date userRegistrationDate = new Date((Long) JsonPath.read(jsonRes, "$.registered"));
        Calendar date = Calendar.getInstance();
        long t = date.getTimeInMillis();
        Date before10Sec = new Date(t - (10000));
        Date after10Sec = new Date(t + (10000));
        assertTrue(userRegistrationDate.before(after10Sec) && userRegistrationDate.after(before10Sec));

        //get user record from database
        User daoUser = userRepository.findByMail(JsonPath.read(jsonRes, "$.mail"));

        //check if user registered correctly
        assertNotNull(daoUser);
        assertTrue(passwordEncoder.matches(registerReq.getPassword(), daoUser.getPassword()));
        // user's id should be defined
        assertTrue(daoUser.getId() > 0);
    }

}