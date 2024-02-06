package com.erijl.wahlentwicklung.backend.controller;

import com.erijl.wahlentwicklung.backend.dto.BellwetherState;
import com.erijl.wahlentwicklung.backend.model.PartyElectionResult;
import com.erijl.wahlentwicklung.backend.model.State;
import com.erijl.wahlentwicklung.backend.service.StateService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class StateController {

    private final StateService stateService;

    public StateController(StateService stateService) {
        this.stateService = stateService;
    }

    @RequestMapping("/state/all")
    public List<State> getAllStates() {
        return this.stateService.getAllStates();
    }

    @RequestMapping("/state/electionresult")
    public List<PartyElectionResult> getStateElectionResult(
            @RequestParam(value = "electionId") int electionId,
            @RequestParam(value = "stateId") int stateId) {
        return this.stateService.getStateElectionResult(electionId, stateId);
    }

    @RequestMapping("/state/bellwether")
    public List<BellwetherState> getBellwetherState(@RequestParam(value = "electionId") int electionId) {
        return this.stateService.getBellwetherState(electionId);
    }

}
