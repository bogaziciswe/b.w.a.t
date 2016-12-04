package com.bwat.validator;

import com.bwat.exception.MissingMustFieldException;
import com.bwat.ld.AnnotationValidator;
import com.bwat.ld.LDProcessor;
import com.github.jsonldjava.core.JsonLdError;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.LinkedHashMap;

import static org.mockito.Matchers.any;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ForInvalidAnnotation {

    @InjectMocks
    AnnotationValidator validator= new AnnotationValidator();

    @Spy
    private LDProcessor ldProcessor;

    @Test(expected=MissingMustFieldException.class)
	public void no_exception_should_be_thrown_for_missing_type_annotation() throws JsonLdError {
        MockitoAnnotations.initMocks(this);

        LinkedHashMap<String, String> toBeReturned = new LinkedHashMap<>();
        toBeReturned.put("@context", "http://www.w3.org/ns/anno.jsonld");
        toBeReturned.put("id", "http://example.org/anno1");
        toBeReturned.put("target", "http://example.org/post1");
        toBeReturned.put("body", "http://example.org/post2");

        Mockito.doReturn(toBeReturned).when(ldProcessor).extractAnnotationModel(any(Object.class));

        JSONObject validJsonObject = new JSONObject();

        validator.validateAndExtractRawAnnotation(validJsonObject);
	}

    @Test(expected=MissingMustFieldException.class)
    public void no_exception_should_be_thrown_for_missing_target_annotation() throws JsonLdError {
        MockitoAnnotations.initMocks(this);

        LinkedHashMap<String, String> toBeReturned = new LinkedHashMap<>();
        toBeReturned.put("@context", "http://www.w3.org/ns/anno.jsonld");
        toBeReturned.put("id", "http://example.org/anno1");
        toBeReturned.put("type", "Annotation");
        toBeReturned.put("body", "http://example.org/post2");

        Mockito.doReturn(toBeReturned).when(ldProcessor).extractAnnotationModel(any(Object.class));

        JSONObject validJsonObject = new JSONObject();

        validator.validateAndExtractRawAnnotation(validJsonObject);
    }
}
