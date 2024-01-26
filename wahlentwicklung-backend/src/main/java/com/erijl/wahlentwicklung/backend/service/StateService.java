package com.erijl.wahlentwicklung.backend.service;

import com.erijl.wahlentwicklung.backend.model.State;
import com.erijl.wahlentwicklung.backend.repository.StateRepository;
import org.springframework.stereotype.Service;

@Service
public class StateService {

    private final StateRepository stateRepository;

    public StateService(StateRepository stateRepository) {
        this.stateRepository = stateRepository;
    }

    public State[] getAllStates() {
        return this.stateRepository.fetchAllStates();
    }
}
