package com.erijl.wahlentwicklung.backend.service;

import com.erijl.wahlentwicklung.backend.dto.BellwetherState;
import com.erijl.wahlentwicklung.backend.model.PartyElectionResult;
import com.erijl.wahlentwicklung.backend.model.State;
import com.erijl.wahlentwicklung.backend.repository.StateRepository;
import com.erijl.wahlentwicklung.backend.util.ComparisonUtil;
import com.erijl.wahlentwicklung.backend.util.FilterUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StateService {

    private final StateRepository stateRepository;
    private final ElectionService electionService;
    private final FilterUtil filterUtil;
    private final ComparisonUtil comparisonUtil;

    public StateService(StateRepository stateRepository, ElectionService electionService, FilterUtil filterUtil, ComparisonUtil comparisonUtil) {
        this.stateRepository = stateRepository;
        this.electionService = electionService;
        this.filterUtil = filterUtil;
        this.comparisonUtil = comparisonUtil;
    }

    public List<State> getAllStates() {
        return this.stateRepository.fetchAllStates();
    }

    public List<PartyElectionResult> getStateElectionResult(int electionId, int stateId) {
        return this.filterUtil.filterForValidParties(this.stateRepository.fetchStateElectionResult(electionId, stateId));
    }

    public List<BellwetherState> getBellwetherState(int electionId) {
        List<PartyElectionResult> electionResult = this.electionService.getElectionResult(electionId);
        List<State> states = this.filterUtil.filterOutFederal(this.stateRepository.fetchAllStates());
        List<BellwetherState> bellwetherStates = new ArrayList<BellwetherState>();

        for (State state : states) {
            List<PartyElectionResult> stateElectionResult = this.stateRepository
                    .fetchStateElectionResult(electionId, state.getStateId());

            double diff = comparisonUtil.getDifferenceBetweenPartyElectionResultLists(electionResult, stateElectionResult);
            System.out.println("########## State" + state.getName() + " Total Diff: " + diff + "#################");
            bellwetherStates.add(new BellwetherState(state, diff));
        }
        return bellwetherStates;
    }
}
