package com.erijl.wahlentwicklung.backend.repository;

import com.erijl.wahlentwicklung.backend.model.State;
import com.erijl.wahlentwicklung.backend.util.RestUtil;
import com.erijl.wahlentwicklung.backend.util.UrlBuilder;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

@Repository
public class StateRepository {

    @Value("${supabase.url}")
    private String supabaseUrl;

    private final RestUtil restUtil;

    private final Gson gson = new GsonBuilder().create();


    public StateRepository(RestUtil restUtil) {
        this.restUtil = restUtil;
    }

    public State[] fetchAllStates() {
        RestTemplate restTemplate = new RestTemplate();

        final String supabaseUrl = new UrlBuilder(this.supabaseUrl).from("state").select("*").getUrl();

        ResponseEntity<String> response = restTemplate.exchange(
                supabaseUrl, HttpMethod.GET, this.restUtil.getStandardHttpEntity(), String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return this.gson.fromJson(response.getBody(), State[].class);
        } else {
            System.out.println("Request Failed");
            System.out.println(response.getStatusCode());
        }

        return null;
    }
}
