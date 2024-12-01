-- dto tables

CREATE TABLE election
(
    year INTEGER NOT NULL,
    PRIMARY KEY (year)
);

CREATE TABLE state
(
    id   INTEGER      NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE constituency
(
    id       INTEGER      NOT NULL,
    state_id INTEGER      NOT NULL,
    name     VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (state_id) REFERENCES state (id)
);

CREATE TABLE party
(
    id           INTEGER      NOT NULL,
    name         VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(20),
    color        VARCHAR(6),
    PRIMARY KEY (id)
);

-- base data tables

CREATE TABLE election_party
(
    id            INTEGER      NOT NULL,
    election_year INTEGER      NOT NULL,
    column_index  INTEGER      NOT NULL, -- this will be used for future mapping of parties cross-election

    name          VARCHAR(255) NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (election_year) REFERENCES election (year)
);

CREATE TABLE election_vote_base
(
    id                                       INTEGER NOT NULL,
    election_year                            INTEGER NOT NULL,

    eligiblevoters_primaryvote_preliminary   INTEGER NOT NULL,
    eligiblevoters_primaryvote_definitiv     INTEGER NOT NULL,

    eligiblevoters_secondaryvote_preliminary INTEGER NOT NULL,
    eligiblevoters_secondarybote_definitive  INTEGER NOT NULL,

    actualvoters_primaryvote_preliminary     INTEGER NOT NULL,
    actualvoters_primaryvote_definitiv       INTEGER NOT NULL,

    actualvoters_secondaryvote_preliminary   INTEGER NOT NULL,
    actualvoters_secondarybote_definitive    INTEGER NOT NULL,

    validvoters_primaryvote_preliminary      INTEGER NOT NULL,
    validvoters_primaryvote_definitiv        INTEGER NOT NULL,

    validvoters_secondaryvote_preliminary    INTEGER NOT NULL,
    validvoters_secondarybote_definitive     INTEGER NOT NULL,

    invalidvoters_primaryvote_preliminary    INTEGER NOT NULL,
    invalidvoters_primaryvote_definitiv      INTEGER NOT NULL,

    invalidvoters_secondaryvote_preliminary  INTEGER NOT NULL,
    invalidvoters_secondarybote_definitive   INTEGER NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (election_year) REFERENCES election (year)
);

CREATE TABLE state_vote_base
(
    id                                       INTEGER NOT NULL,
    election_year                            INTEGER NOT NULL,
    state_id                                 INTEGER NOT NULL,

    eligiblevoters_primaryvote_preliminary   INTEGER NOT NULL,
    eligiblevoters_primaryvote_definitiv     INTEGER NOT NULL,

    eligiblevoters_secondaryvote_preliminary INTEGER NOT NULL,
    eligiblevoters_secondarybote_definitive  INTEGER NOT NULL,

    actualvoters_primaryvote_preliminary     INTEGER NOT NULL,
    actualvoters_primaryvote_definitiv       INTEGER NOT NULL,

    actualvoters_secondaryvote_preliminary   INTEGER NOT NULL,
    actualvoters_secondarybote_definitive    INTEGER NOT NULL,

    validvoters_primaryvote_preliminary      INTEGER NOT NULL,
    validvoters_primaryvote_definitiv        INTEGER NOT NULL,

    validvoters_secondaryvote_preliminary    INTEGER NOT NULL,
    validvoters_secondarybote_definitive     INTEGER NOT NULL,

    invalidvoters_primaryvote_preliminary    INTEGER NOT NULL,
    invalidvoters_primaryvote_definitiv      INTEGER NOT NULL,

    invalidvoters_secondaryvote_preliminary  INTEGER NOT NULL,
    invalidvoters_secondarybote_definitive   INTEGER NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (state_id) REFERENCES state (id)
);

CREATE TABLE constituency_vote_base
(
    id                                       INTEGER NOT NULL,
    election_year                            INTEGER NOT NULL,
    constituency_id                          INTEGER NOT NULL,

    eligiblevoters_primaryvote_preliminary   INTEGER NOT NULL,
    eligiblevoters_primaryvote_definitiv     INTEGER NOT NULL,

    eligiblevoters_secondaryvote_preliminary INTEGER NOT NULL,
    eligiblevoters_secondarybote_definitive  INTEGER NOT NULL,

    actualvoters_primaryvote_preliminary     INTEGER NOT NULL,
    actualvoters_primaryvote_definitiv       INTEGER NOT NULL,

    actualvoters_secondaryvote_preliminary   INTEGER NOT NULL,
    actualvoters_secondarybote_definitive    INTEGER NOT NULL,

    validvoters_primaryvote_preliminary      INTEGER NOT NULL,
    validvoters_primaryvote_definitiv        INTEGER NOT NULL,

    validvoters_secondaryvote_preliminary    INTEGER NOT NULL,
    validvoters_secondarybote_definitive     INTEGER NOT NULL,

    invalidvoters_primaryvote_preliminary    INTEGER NOT NULL,
    invalidvoters_primaryvote_definitiv      INTEGER NOT NULL,

    invalidvoters_secondaryvote_preliminary  INTEGER NOT NULL,
    invalidvoters_secondarybote_definitive   INTEGER NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (constituency_id) REFERENCES constituency (id)
);

-- party tables

CREATE TABLE election_vote_party
(
    id                        INTEGER NOT NULL,
    election_year             INTEGER NOT NULL,
    party_id                  INTEGER NOT NULL,

    primaryvote_preliminary   INTEGER NOT NULL,
    primaryvote_definitiv     INTEGER NOT NULL,

    secondaryvote_preliminary INTEGER NOT NULL,
    secondaryvote_definitiv   INTEGER NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (party_id) REFERENCES party (id)
);

CREATE TABLE state_vote_party
(
    id                        INTEGER NOT NULL,
    election_year             INTEGER NOT NULL,
    party_id                  INTEGER NOT NULL,
    state_id                  INTEGER NOT NULL,

    primaryvote_preliminary   INTEGER NOT NULL,
    primaryvote_definitiv     INTEGER NOT NULL,

    secondaryvote_preliminary INTEGER NOT NULL,
    secondaryvote_definitiv   INTEGER NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (party_id) REFERENCES party (id),
    FOREIGN KEY (state_id) REFERENCES state (id)
);

CREATE TABLE constituency_vote_party
(
    id                        INTEGER NOT NULL,
    election_year             INTEGER NOT NULL,
    party_id                  INTEGER NOT NULL,
    constituency_id           INTEGER NOT NULL,

    primaryvote_preliminary   INTEGER NOT NULL,
    primaryvote_definitiv     INTEGER NOT NULL,

    secondaryvote_preliminary INTEGER NOT NULL,
    secondaryvote_definitiv   INTEGER NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (party_id) REFERENCES party (id),
    FOREIGN KEY (constituency_id) REFERENCES constituency (id)
);