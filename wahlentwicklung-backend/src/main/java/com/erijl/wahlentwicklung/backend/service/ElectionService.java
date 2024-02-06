package com.erijl.wahlentwicklung.backend.service;

import com.erijl.wahlentwicklung.backend.model.Election;
import com.erijl.wahlentwicklung.backend.model.ElectionStatistic;
import com.erijl.wahlentwicklung.backend.model.PartyElectionResult;
import com.erijl.wahlentwicklung.backend.repository.ElectionRepository;
import com.erijl.wahlentwicklung.backend.util.FilterUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ElectionService {

    private final ElectionRepository electionRepository;

    private final FilterUtil filterUtil;

    public ElectionService(ElectionRepository electionRepository, FilterUtil filterUtil) {
        this.electionRepository = electionRepository;
        this.filterUtil = filterUtil;
    }
    public List<Election> getAllElections() {
        return this.electionRepository.fetchAllElections();
    }

    public List<PartyElectionResult> getElectionResult(int electionId) {
        List<PartyElectionResult> partyElectionResults = this.electionRepository.fetchElectionResult(electionId);
        return this.filterUtil.filterForValidParties(partyElectionResults);
    }

    public ElectionStatistic getElectionStatistics(int electionId) {
        List<ElectionStatistic> statistics = this.electionRepository.fetchElectionStatistic(electionId, 99);

        if (!statistics.isEmpty()) {
            return statistics.getFirst();
        }

        return null;
    }
}
