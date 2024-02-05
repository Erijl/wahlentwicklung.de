package com.erijl.wahlentwicklung.backend.service;

import com.erijl.wahlentwicklung.backend.model.Party;
import com.erijl.wahlentwicklung.backend.repository.PartyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartyService {

    private final PartyRepository partyRepository;

    public PartyService(PartyRepository partyRepository) {
        this.partyRepository = partyRepository;
    }

    public List<Party> getAllParties(int electionId) {
        return this.partyRepository.fetchAllPartiesFromElection(electionId);
    }
}
