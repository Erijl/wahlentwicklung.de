package com.erijl.wahlentwicklung.importer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "election")

@Getter
@Setter
public class Election {
    @Id
    @Column(name = "year")
    private int year;

    public Election(int year) {
        this.year = year;
    }

    public Election() {}
}