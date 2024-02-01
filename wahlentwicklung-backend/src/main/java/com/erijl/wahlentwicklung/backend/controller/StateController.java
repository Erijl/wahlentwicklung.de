package com.erijl.wahlentwicklung.backend.controller;

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

    @RequestMapping("/state/bellwether")
    public State getBellwetherState(@RequestParam(value="electionId") int electionId) {
        return this.stateService.getBellwetherState(electionId);
    }

}
