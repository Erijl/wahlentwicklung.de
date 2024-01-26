package com.erijl.wahlentwicklung.backend.controller;

import com.erijl.wahlentwicklung.backend.model.State;
import com.erijl.wahlentwicklung.backend.service.StateService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StateController {

    private final StateService stateService;

    public StateController(StateService stateService) {
        this.stateService = stateService;
    }

    @RequestMapping("/state/all")
    public State[] getAllStates() {
        return this.stateService.getAllStates();
    }
}
