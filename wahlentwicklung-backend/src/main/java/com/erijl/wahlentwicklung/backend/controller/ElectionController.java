package com.erijl.wahlentwicklung.backend.controller;

import com.erijl.wahlentwicklung.backend.model.Election;
import com.erijl.wahlentwicklung.backend.model.ElectionStatistic;
import com.erijl.wahlentwicklung.backend.model.PartyElectionResult;
import com.erijl.wahlentwicklung.backend.service.ElectionService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ElectionController {

    private final ElectionService electionService;

    public ElectionController(ElectionService electionService) {
        this.electionService = electionService;
    }
    @RequestMapping("/election/all")
    public List<Election> getAllElections() {
        return this.electionService.getAllElections();
    }

    @RequestMapping("/election/result")
    public List<PartyElectionResult> getElectionResult(@RequestParam(value="electionId") int electionId) {
        return this.electionService.getElectionResult(electionId);
    }

    @RequestMapping("/election/statistic")
    public ElectionStatistic getElectionStatistics(@RequestParam(value="electionId") int electionId) {
        return this.electionService.getElectionStatistics(electionId);
    }

}
