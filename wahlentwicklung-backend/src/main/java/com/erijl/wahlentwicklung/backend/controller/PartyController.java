package com.erijl.wahlentwicklung.backend.controller;

import com.erijl.wahlentwicklung.backend.model.Party;
import com.erijl.wahlentwicklung.backend.service.PartyService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PartyController {

    private final PartyService partyService;

    public PartyController(PartyService partyService) {
        this.partyService = partyService;
    }

    @RequestMapping("/party/all")
    public List<Party> getAllParties(@RequestParam(value="electionId") int electionId) {
        return this.partyService.getAllParties(electionId);
    }
}

