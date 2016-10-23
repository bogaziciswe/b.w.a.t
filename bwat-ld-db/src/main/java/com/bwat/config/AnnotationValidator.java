package com.bwat.config;

import com.bwat.exception.MissingMustFieldException;
import com.bwat.ld.Processor;
import com.github.jsonldjava.core.JsonLdError;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;

@Service
public class AnnotationValidator{

    @Autowired
    private Processor ldProcessor;
    

    public LinkedHashMap validateAndExtractRawAnnotation(Object o) {
        LinkedHashMap processedAnnotation = null;
        try {
            processedAnnotation = ldProcessor.extractAnnotationModel(o);
            validateAnnotation(processedAnnotation);
        } catch (JsonLdError jsonLdError) {
            jsonLdError.printStackTrace();
        }

        return processedAnnotation;
    }

    private void validateAnnotation(LinkedHashMap processedAnnotation) {
        List<String> mustFields = new ArrayList<>();
        mustFields.addAll(Arrays.asList("id", "type", "target"));

        mustFields.forEach(field -> {
            if (processedAnnotation.get(field) == null){
                throw new MissingMustFieldException(field);
            }
        });
    }
}