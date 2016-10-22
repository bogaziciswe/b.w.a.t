package com.bwat.ld;

import com.github.jsonldjava.core.JsonLdError;
import com.github.jsonldjava.core.JsonLdOptions;
import com.github.jsonldjava.core.JsonLdProcessor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class LDProcessor implements Processor{
    public LinkedHashMap extractAnnotationModel(Object rawLD) throws JsonLdError {

        Map<String, Object> context = new HashMap<String, Object>();
        context.put("@context", "http://www.w3.org/ns/anno.jsonld");

        JsonLdOptions options = new JsonLdOptions();
        options.setProcessingMode("json-ld-1.0");

        LinkedHashMap compact = (LinkedHashMap) JsonLdProcessor.compact(rawLD, context, options);
        return compact;
    }
}
