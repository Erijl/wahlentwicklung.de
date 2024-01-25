package com.erijl.wahlentwicklung.backend.repository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

@Repository
public class ElectionRepository {

    @Value("${supabase.service.key}")
    private String supabaseServiceKey;

    public ElectionRepository() {

    }

    public void fetchAllElections() {
        RestTemplate restTemplate = new RestTemplate();
        final String supabaseUrl = "https://yunvtkoxdvyltqdinama.supabase.co/rest/v1/election?select=*";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        headers.set("apikey", supabaseServiceKey);
        headers.set("Authorization", "Bearer " + supabaseServiceKey);

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                supabaseUrl, HttpMethod.GET, requestEntity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            String responseBody = response.getBody();
            System.out.println(responseBody);
        } else {
            System.out.println("Request Failed");
            System.out.println(response.getStatusCode());
        }
    }

}