package com.bwat.controller;

import com.bwat.repository.AnnotationRepository;
import com.bwat.repository.AnnotationDocument;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;

import static org.hamcrest.Matchers.is;
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
    private AnnotationRepository annotationRepository;

    @Autowired
    private ObjectMapper mapper;

    private MockMvc mockMvc;

    private AnnotationDocument savedAnnotationDocument;

    @Before
    @Transactional
    public void setUp() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .build();
    }

    @After
    public void tearDown() throws Exception {
        annotationRepository.deleteAll();
    }

    /**
     * Tests annotation adding
     */
    @Test
    public void addAnnotation_shouldAddNewAnnotation() throws Exception {
        String jsonRequestBody = "{\n" +
                "\"@context\": \"http://www.w3.org/ns/anno.jsonld\",\n" +
                "\"type\": \"Annotation\",\n" +
                "\"body\": {\n" +
                " \"type\": \"TextualBody\",\n" +
                " \"value\": \"Comment text\",\n" +
                " \"format\": \"text/plain\"\n" +
                "},\n" +
                "\"target\": {\n" +
                "\"source\": \"http://example.org/ebook1\",\n" +
                "\"selector\": [\n" +
                "{\n" +
                "\"type\": \"RangeSelector\",\n" +
                "   \"startSelector\": {\n" +
                "     \"type\": \"XPathSelector\",\n" +
                "     \"value\": \"//table[1]/tr[1]/td[2]\"\n" +
                "   },\n" +
                "   \"endSelector\": {\n" +
                "     \"type\": \"XPathSelector\",\n" +
                "     \"value\": \"//table[1]/tr[1]/td[4]\"\n" +
                "   }\n" +
                "},\n" +
                "{\n" +
                "  \"type\": \"DataPositionSelector\",\n" +
                "  \"start\": 412,\n" +
                "  \"end\": 795\n" +
                "}\n" +
                "]\n" +
                "}\n" +
                "}";

        MvcResult result = mockMvc.perform(post("/annotation")
                .content(jsonRequestBody)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.type", is("Annotation")))
                .andExpect(jsonPath("$.body.type", is("TextualBody")))
                .andExpect(jsonPath("$.body.format", is("text/plain")))
                .andExpect(jsonPath("$.body.value", is("Comment text")))
                .andExpect(jsonPath("$.target.source", is("http://example.org/ebook1")))
                .andExpect(jsonPath("$.target.selector[0].type", is("RangeSelector")))
                .andExpect(jsonPath("$.target.selector[0].startSelector.type", is("XPathSelector")))
                .andExpect(jsonPath("$.target.selector[0].startSelector.value", is("//table[1]/tr[1]/td[2]")))
                .andExpect(jsonPath("$.target.selector[0].endSelector.type", is("XPathSelector")))
                .andExpect(jsonPath("$.target.selector[0].endSelector.value", is("//table[1]/tr[1]/td[4]")))
                .andExpect(jsonPath("$.target.selector[1].type", is("DataPositionSelector")))
                .andExpect(jsonPath("$.target.selector[1].start", is(412)))
                .andExpect(jsonPath("$.target.selector[1].end", is(795)))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.updatedAt").exists())
                .andExpect(jsonPath("$.createdAt").exists())
                .andReturn();
        String jsonRes = result.getResponse().getContentAsString();

        System.out.println("#####");
        System.out.println(jsonRes);

    }

}

