package com.erijl.wahlentwicklung.backend.repository;

import com.erijl.wahlentwicklung.backend.model.PartyElectionResult;
import com.erijl.wahlentwicklung.backend.model.State;
import com.erijl.wahlentwicklung.backend.util.RestUtil;
import com.erijl.wahlentwicklung.backend.util.UrlBuilder;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class StateRepository {

    @Value("${supabase.url}")
    private String supabaseUrl;

    private final RestUtil restUtil;

    private final Gson gson = new GsonBuilder().create();


    public StateRepository(RestUtil restUtil) {
        this.restUtil = restUtil;
    }

    public List<State> fetchAllStates() {
        RestTemplate restTemplate = new RestTemplate();

        final String supabaseUrl = new UrlBuilder(this.supabaseUrl).from("state").select("*").getUrl();

        ResponseEntity<String> response = restTemplate.exchange(
                supabaseUrl, HttpMethod.GET, this.restUtil.getStandardHttpEntity(), String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            Type listType = new TypeToken<List<State>>() {}.getType();
            return this.gson.fromJson(response.getBody(), listType);
        } else {
            System.out.println("Request Failed");
            System.out.println(response.getStatusCode());
        }

        return null;
    }

    public List<PartyElectionResult> fetchStateElectionResult(int electionId, int stateId) {
        RestTemplate restTemplate = new RestTemplate();
        final String supabaseUrl = new UrlBuilder(this.supabaseUrl).rpc("getstateelectionresults").getUrl();

        Map<String, String> body = new HashMap<>();
        body.put("p_election_id", String.valueOf(electionId));
        body.put("p_state_id", String.valueOf(stateId));

        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(body, this.restUtil.getStandardHeaders());

        ResponseEntity<String> response = restTemplate.exchange(
                supabaseUrl, HttpMethod.POST, requestEntity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            Type listType = new TypeToken<List<PartyElectionResult>>() {}.getType();
            return this.gson.fromJson(response.getBody(), listType);
        } else {
            System.out.println("Request Failed");
            System.out.println(response.getStatusCode());
        }

        return null;
    }
}
