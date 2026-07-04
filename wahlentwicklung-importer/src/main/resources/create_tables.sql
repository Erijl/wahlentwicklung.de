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

-- mapping tables

CREATE TABLE state_mapping
(
    id            INTEGER NOT NULL,
    state_id      INTEGER,
    election_year INTEGER NOT NULL,
    row_id        INTEGER NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (election_year, row_id) REFERENCES election_state (election_year, row_id),
    FOREIGN KEY (state_id) REFERENCES state (id)
);

CREATE TABLE constituency_mapping
(
    id                INTEGER NOT NULL,
    constituency_id   INTEGER,
    election_state_id INTEGER,
    election_year     INTEGER NOT NULL,
    row_id            INTEGER NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (constituency_id) REFERENCES constituency (id),
    FOREIGN KEY (election_year, election_state_id, row_id) REFERENCES election_constituency (election_year, state_id, row_id)
);

CREATE TABLE party_mapping
(
    id            INTEGER NOT NULL,
    party_id      INTEGER,
    election_year INTEGER NOT NULL,
    column_index  INTEGER NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (election_year, column_index) REFERENCES election_party (election_year, column_index),
    FOREIGN KEY (party_id) REFERENCES party (id)
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
    election_year     INTEGER      NOT NULL,
    column_index      INTEGER      NOT NULL,

    name              VARCHAR(255) NOT NULL,
    seat_count        INTEGER      NOT NULL,
    part_of_coalition BOOLEAN      NOT NULL CHECk (part_of_coalition IN (0, 1)),

    PRIMARY KEY (election_year, column_index),
    FOREIGN KEY (election_year) REFERENCES election (year)
);

CREATE TABLE election_vote_base
(
    election_year                            INTEGER NOT NULL,

    eligiblevoters_primaryvote_previous   INTEGER NOT NULL,
    eligiblevoters_primaryvote_definitive    INTEGER NOT NULL,

    eligiblevoters_secondaryvote_previous INTEGER NOT NULL,
    eligiblevoters_secondaryvote_definitive  INTEGER NOT NULL,

    actualvoters_primaryvote_previous     INTEGER NOT NULL,
    actualvoters_primaryvote_definitive      INTEGER NOT NULL,

    actualvoters_secondaryvote_previous   INTEGER NOT NULL,
    actualvoters_secondaryvote_definitive    INTEGER NOT NULL,

    validvoters_primaryvote_previous      INTEGER NOT NULL,
    validvoters_primaryvote_definitive       INTEGER NOT NULL,

    validvoters_secondaryvote_previous    INTEGER NOT NULL,
    validvoters_secondaryvote_definitive     INTEGER NOT NULL,

    invalidvoters_primaryvote_previous    INTEGER NOT NULL,
    invalidvoters_primaryvote_definitive     INTEGER NOT NULL,

    invalidvoters_secondaryvote_previous  INTEGER NOT NULL,
    invalidvoters_secondaryvote_definitive   INTEGER NOT NULL,

    PRIMARY KEY (election_year),
    FOREIGN KEY (election_year) REFERENCES election (year)
);

CREATE TABLE state_vote_base
(
    election_year                            INTEGER NOT NULL,
    state_id                                 INTEGER NOT NULL,

    eligiblevoters_primaryvote_previous   INTEGER NOT NULL,
    eligiblevoters_primaryvote_definitive    INTEGER NOT NULL,

    eligiblevoters_secondaryvote_previous INTEGER NOT NULL,
    eligiblevoters_secondaryvote_definitive  INTEGER NOT NULL,

    actualvoters_primaryvote_previous     INTEGER NOT NULL,
    actualvoters_primaryvote_definitive      INTEGER NOT NULL,

    actualvoters_secondaryvote_previous   INTEGER NOT NULL,
    actualvoters_secondaryvote_definitive    INTEGER NOT NULL,

    validvoters_primaryvote_previous      INTEGER NOT NULL,
    validvoters_primaryvote_definitive       INTEGER NOT NULL,

    validvoters_secondaryvote_previous    INTEGER NOT NULL,
    validvoters_secondaryvote_definitive     INTEGER NOT NULL,

    invalidvoters_primaryvote_previous    INTEGER NOT NULL,
    invalidvoters_primaryvote_definitive     INTEGER NOT NULL,

    invalidvoters_secondaryvote_previous  INTEGER NOT NULL,
    invalidvoters_secondaryvote_definitive   INTEGER NOT NULL,

    PRIMARY KEY (election_year, state_id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (election_year, state_id) REFERENCES election_state (election_year, row_id)
);

CREATE TABLE constituency_vote_base
(
    election_year                            INTEGER NOT NULL,
    state_id                                 INTEGER NOT NULL,
    constituency_id                          INTEGER NOT NULL,

    eligiblevoters_primaryvote_previous   INTEGER NOT NULL,
    eligiblevoters_primaryvote_definitive    INTEGER NOT NULL,

    eligiblevoters_secondaryvote_previous INTEGER NOT NULL,
    eligiblevoters_secondaryvote_definitive  INTEGER NOT NULL,

    actualvoters_primaryvote_previous     INTEGER NOT NULL,
    actualvoters_primaryvote_definitive      INTEGER NOT NULL,

    actualvoters_secondaryvote_previous   INTEGER NOT NULL,
    actualvoters_secondaryvote_definitive    INTEGER NOT NULL,

    validvoters_primaryvote_previous      INTEGER NOT NULL,
    validvoters_primaryvote_definitive       INTEGER NOT NULL,

    validvoters_secondaryvote_previous    INTEGER NOT NULL,
    validvoters_secondaryvote_definitive     INTEGER NOT NULL,

    invalidvoters_primaryvote_previous    INTEGER NOT NULL,
    invalidvoters_primaryvote_definitive     INTEGER NOT NULL,

    invalidvoters_secondaryvote_previous  INTEGER NOT NULL,
    invalidvoters_secondaryvote_definitive   INTEGER NOT NULL,

    PRIMARY KEY (election_year, constituency_id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (election_year, state_id, constituency_id) REFERENCES election_constituency (election_year, state_id, row_id)
);

-- party tables

CREATE TABLE election_vote_party
(
    election_year             INTEGER NOT NULL,
    party_id                  INTEGER NOT NULL,

    primaryvote_previous   INTEGER NOT NULL,
    primaryvote_definitive    INTEGER NOT NULL,

    secondaryvote_previous INTEGER NOT NULL,
    secondaryvote_definitive  INTEGER NOT NULL,

    PRIMARY KEY (election_year, party_id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (election_year, party_id) REFERENCES election_party (election_year, column_index)
);

CREATE TABLE state_vote_party
(
    election_year             INTEGER NOT NULL,
    party_id                  INTEGER NOT NULL,
    state_id                  INTEGER NOT NULL,

    primaryvote_previous   INTEGER NOT NULL,
    primaryvote_definitive    INTEGER NOT NULL,

    secondaryvote_previous INTEGER NOT NULL,
    secondaryvote_definitive  INTEGER NOT NULL,

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

    primaryvote_previous   INTEGER NOT NULL,
    primaryvote_definitive    INTEGER NOT NULL,

    secondaryvote_previous INTEGER NOT NULL,
    secondaryvote_definitive  INTEGER NOT NULL,

    PRIMARY KEY (election_year, party_id, constituency_id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (election_year, party_id) REFERENCES election_party (election_year, column_index),
    FOREIGN KEY (election_year, state_id, party_id) REFERENCES election_constituency (election_year, state_id, row_id)
);
-- query indexes (the UI build joins heavily via the mapping tables)

CREATE INDEX idx_party_mapping_party ON party_mapping (party_id, election_year);
CREATE INDEX idx_party_mapping_col ON party_mapping (election_year, column_index);
CREATE INDEX idx_constituency_mapping_c ON constituency_mapping (constituency_id, election_year);
CREATE INDEX idx_constituency_mapping_raw ON constituency_mapping (election_year, election_state_id, row_id);
CREATE INDEX idx_state_mapping_state ON state_mapping (state_id, election_year);
CREATE INDEX idx_cvp_year_c ON constituency_vote_party (election_year, constituency_id);
CREATE INDEX idx_svp_year_s ON state_vote_party (election_year, state_id);
