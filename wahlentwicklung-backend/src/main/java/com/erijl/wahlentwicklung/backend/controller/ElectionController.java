package com.erijl.wahlentwicklung.backend.controller;

import com.erijl.wahlentwicklung.backend.service.ElectionService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ElectionController {

    private final ElectionService electionService;

    public ElectionController(ElectionService electionService) {
        this.electionService = electionService;
    }
    @RequestMapping("/election/all")
    public String getAllElections() {
        this.electionService.getAllElections();
        return "Hello world!";
    }

    @RequestMapping("/election/result")
    public String getElectionResult(@RequestParam(value="electionId") String electionId) {
        return "Hello world! " + electionId;
    }

    @RequestMapping("/election/statistic")
    public String getElectionStatistics(@RequestParam(value="electionId") String electionId) {
        return "Hello world!";
    }

}
