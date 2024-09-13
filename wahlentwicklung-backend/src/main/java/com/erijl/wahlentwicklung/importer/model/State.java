package com.erijl.wahlentwicklung.importer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "state")

@Getter
@Setter
public class State {

    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    public State(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public State() {}
}
