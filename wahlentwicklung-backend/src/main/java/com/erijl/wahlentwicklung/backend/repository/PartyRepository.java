package com.erijl.wahlentwicklung.backend.repository;

import com.erijl.wahlentwicklung.backend.model.Party;
import com.erijl.wahlentwicklung.backend.util.RestUtil;
import com.erijl.wahlentwicklung.backend.util.UrlBuilder;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Type;
import java.util.List;

@Repository
public class PartyRepository {

    @Value("${supabase.url}")
    private String supabaseUrl;

    private final RestUtil restUtil;

    private final Gson gson = new GsonBuilder().create();

    public PartyRepository(RestUtil restUtil) {
        this.restUtil = restUtil;
    }

    public List<Party> fetchAllPartiesFromElection(int electionId) {
        RestTemplate restTemplate = new RestTemplate();

        final String supabaseUrl = new UrlBuilder(this.supabaseUrl)
                .from("party")
                .select("*")
                .eq("election_id", electionId)
                .getUrl();

        ResponseEntity<String> response = restTemplate.exchange(
                supabaseUrl, HttpMethod.GET, this.restUtil.getStandardHttpEntity(), String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            Type listType = new TypeToken<List<Party>>() {
            }.getType();
            return this.gson.fromJson(response.getBody(), listType);
        } else {
            System.out.println("Request Failed");
            System.out.println(response.getStatusCode());
        }

        return null;
    }
}
