package com.erijl.wahlentwicklung.backend.service;

import com.erijl.wahlentwicklung.backend.repository.ElectionRepository;
import org.springframework.stereotype.Service;

@Service
public class ElectionService {

    private final ElectionRepository electionRepository;

    public ElectionService(ElectionRepository electionRepository) {
        this.electionRepository = electionRepository;
    }
    public String getAllElections() {
        this.electionRepository.fetchAllElections();
        return "Hello world!";
    }

    public String getElectionResult(String electionId) {
        return "Hello world! " + electionId;
    }

    public String getElectionStatistics(String electionId) {
        return "Hello world!";
    }
}
