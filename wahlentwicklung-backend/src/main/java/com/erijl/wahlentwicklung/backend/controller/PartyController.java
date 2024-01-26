package com.erijl.wahlentwicklung.backend.controller;

import com.erijl.wahlentwicklung.backend.model.Party;
import com.erijl.wahlentwicklung.backend.service.PartyService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PartyController {

    private final PartyService partyService;

    public PartyController(PartyService partyService) {
        this.partyService = partyService;
    }

    @RequestMapping("/party/all")
    public Party[] getAllParties() {
        return this.partyService.getAllParties();
    }
}

