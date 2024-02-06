package com.erijl.wahlentwicklung.backend.util;

import lombok.experimental.UtilityClass;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;

import org.springframework.http.*;
import org.springframework.stereotype.Component;

@Component
public class RestUtil {

    @Value("${supabase.service.key}")
    private String supabaseServiceKey;

    public HttpHeaders getStandardHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        headers.set("apikey", supabaseServiceKey);
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", "Bearer " + supabaseServiceKey);
        return headers;
    }

    public HttpEntity<String> getStandardHttpEntity() {
        return new HttpEntity<>(getStandardHeaders());
    }
}
