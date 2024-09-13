package com.erijl.wahlentwicklung.importer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "party")

@Getter
@Setter
public class Party {

    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "abbreviation")
    private String abbreviation;


    @Column(name = "color")
    private String color;

    public Party(int id, String name, String abbreviation, String color) {
        this.id = id;
        this.name = name;
        this.abbreviation = abbreviation;
        this.color = color;
    }



}
