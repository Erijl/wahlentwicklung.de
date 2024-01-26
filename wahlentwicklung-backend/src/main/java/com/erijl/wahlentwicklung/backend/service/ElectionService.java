package com.erijl.wahlentwicklung.backend.service;

import com.erijl.wahlentwicklung.backend.model.Election;
import com.erijl.wahlentwicklung.backend.model.ElectionStatistic;
import com.erijl.wahlentwicklung.backend.model.PartyElectionResult;
import com.erijl.wahlentwicklung.backend.repository.ElectionRepository;
import org.springframework.stereotype.Service;

@Service
public class ElectionService {

    private final ElectionRepository electionRepository;

    public ElectionService(ElectionRepository electionRepository) {
        this.electionRepository = electionRepository;
    }
    public Election[] getAllElections() {
        return this.electionRepository.fetchAllElections();
    }

    public PartyElectionResult[] getElectionResult(int electionId) {
        return this.electionRepository.fetchElectionResult(electionId);
    }

    public ElectionStatistic getElectionStatistics(int electionId) {
        ElectionStatistic[] statistics = this.electionRepository.fetchElectionStatistic(electionId, 99);

        if (statistics.length > 0) {
            return statistics[0];
        }

        return null;
    }
}
