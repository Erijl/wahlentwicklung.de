package com.erijl.wahlentwicklung.importer.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "constituency")

@Setter
@Getter
public class Constituency {

    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "state_id")
    private int stateId;

    public Constituency(int id, String name, int stateId) {
        this.id = id;
        this.name = name;
        this.stateId = stateId;
    }

    public Constituency() {}
}
