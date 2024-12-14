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


-- data tables based on each election

CREATE TABLE election_state
(
    election_year INTEGER      NOT NULL,
    row_id        INTEGER      NOT NULL,

    name          VARCHAR(255) NOT NULL,

    PRIMARY KEY (election_year, row_id),
    FOREIGN KEY (election_year) REFERENCES election (year)
);

CREATE TABLE election_constituency
(
    state_id      INTEGER      NOT NULL,
    election_year INTEGER      NOT NULL,
    row_id        INTEGER      NOT NULL,

    name          VARCHAR(255) NOT NULL,

    PRIMARY KEY (election_year, state_id, row_id),
    FOREIGN KEY (election_year, state_id) REFERENCES election_state (election_year, row_id),
    FOREIGN KEY (election_year) REFERENCES election (year)
);

CREATE TABLE election_party
(
    election_year INTEGER      NOT NULL,
    column_index  INTEGER      NOT NULL,

    name          VARCHAR(255) NOT NULL,

    PRIMARY KEY (election_year, column_index),
    FOREIGN KEY (election_year) REFERENCES election (year)
);

CREATE TABLE election_vote_base
(
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

    PRIMARY KEY (election_year),
    FOREIGN KEY (election_year) REFERENCES election (year)
);

CREATE TABLE state_vote_base
(
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

    PRIMARY KEY (election_year, state_id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (election_year, state_id) REFERENCES election_state (election_year, row_id)
);

CREATE TABLE constituency_vote_base
(
    election_year                            INTEGER NOT NULL,
    state_id                                 INTEGER NOT NULL,
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

    PRIMARY KEY (election_year, constituency_id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (election_year, state_id, constituency_id) REFERENCES election_constituency (election_year, state_id, row_id)
);

-- party tables

CREATE TABLE election_vote_party
(
    election_year             INTEGER NOT NULL,
    party_id                  INTEGER NOT NULL,

    primaryvote_preliminary   INTEGER NOT NULL,
    primaryvote_definitiv     INTEGER NOT NULL,

    secondaryvote_preliminary INTEGER NOT NULL,
    secondaryvote_definitiv   INTEGER NOT NULL,

    PRIMARY KEY (election_year, party_id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (election_year, party_id) REFERENCES election_party (election_year, column_index)
);

CREATE TABLE state_vote_party
(
    election_year             INTEGER NOT NULL,
    party_id                  INTEGER NOT NULL,
    state_id                  INTEGER NOT NULL,

    primaryvote_preliminary   INTEGER NOT NULL,
    primaryvote_definitiv     INTEGER NOT NULL,

    secondaryvote_preliminary INTEGER NOT NULL,
    secondaryvote_definitiv   INTEGER NOT NULL,

    PRIMARY KEY (election_year, party_id, state_id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (election_year, party_id) REFERENCES election_party (election_year, column_index),
    FOREIGN KEY (election_year, state_id) REFERENCES election_state (election_year, row_id)
);

CREATE TABLE constituency_vote_party
(
    election_year             INTEGER NOT NULL,
    party_id                  INTEGER NOT NULL,
    state_id                  INTEGER NOT NULL,
    constituency_id           INTEGER NOT NULL,

    primaryvote_preliminary   INTEGER NOT NULL,
    primaryvote_definitiv     INTEGER NOT NULL,

    secondaryvote_preliminary INTEGER NOT NULL,
    secondaryvote_definitiv   INTEGER NOT NULL,

    PRIMARY KEY (election_year, party_id, constituency_id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (election_year, party_id) REFERENCES election_party (election_year, column_index),
    FOREIGN KEY (election_year, state_id, party_id) REFERENCES election_constituency (election_year, state_id, row_id)
);