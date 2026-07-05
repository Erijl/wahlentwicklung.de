-- dto tables

CREATE TABLE election
(
    year INTEGER NOT NULL,
    date TEXT, -- ISO date, set post-import in update_mappings.sql
    PRIMARY KEY (year)
);

CREATE TABLE state
(
    id           INTEGER      NOT NULL,
    name         VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(5),
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
-- =====================================================================
-- statistics domains (docs/08): RWS, Zeitreihen, Urne/Brief, Kreise,
-- Strukturdaten. Dimension tables are seeded from
-- insert_statistics-dimensions.sql / insert_indicator-catalog.sql;
-- birth_cohort rows are created by the importer from the source files.
-- =====================================================================

-- provenance + methodology notes, one row per dataset family
CREATE TABLE dataset
(
    id         TEXT NOT NULL,
    name       TEXT NOT NULL,
    source_url TEXT,
    license    TEXT,
    note       TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE dataset_note
(
    dataset_id    TEXT    NOT NULL,
    election_year INTEGER, -- NULL = applies to the whole dataset
    note          TEXT    NOT NULL,
    FOREIGN KEY (dataset_id) REFERENCES dataset (id)
);

-- union party dimension for the statistics domains. Source files label
-- parties with short names that differ from kerg's election_party names,
-- plus pseudo entries (TOTAL/INVALID/SONSTIGE/CDU_CSU/WGR_EB) that have
-- no canonical party. party_id links to the canonical party where one exists.
CREATE TABLE stat_party
(
    id       INTEGER NOT NULL,
    code     TEXT    NOT NULL UNIQUE,
    party_id INTEGER,
    note     TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (party_id) REFERENCES party (id)
);

-- every column/row label variant found in any source file; the importer
-- hard-fails on labels that do not resolve here ("dar. "-prefixed memo
-- labels are stripped to their base label and flagged is_memo on the fact)
CREATE TABLE stat_party_alias
(
    alias         TEXT    NOT NULL,
    stat_party_id INTEGER NOT NULL,
    PRIMARY KEY (alias),
    FOREIGN KEY (stat_party_id) REFERENCES stat_party (id)
);

CREATE TABLE gender
(
    code TEXT NOT NULL, -- total | m | w
    note TEXT,
    PRIMARY KEY (code)
);

-- age brackets of the 1953/1957 time-series files (shift across eras,
-- stored with parsed bounds; never string-match brackets across years)
CREATE TABLE age_group
(
    id       INTEGER NOT NULL,
    label    TEXT    NOT NULL UNIQUE,
    age_from INTEGER, -- NULL for 'total'
    age_to   INTEGER, -- NULL for 'total' and open brackets (>=70)
    PRIMARY KEY (id)
);

-- per-election birth-year cohorts of the RWS files (brackets and label
-- format change every election; bw2 uses finer cohorts than bst2)
CREATE TABLE birth_cohort
(
    election_year INTEGER NOT NULL,
    id            INTEGER NOT NULL,
    label         TEXT    NOT NULL,
    year_from     INTEGER, -- NULL for 'total' and open brackets
    year_to       INTEGER,
    PRIMARY KEY (election_year, id),
    FOREIGN KEY (election_year) REFERENCES election (year)
);

-- Zeitreihen: btw_rws_wb-1953 (turnout by gender x age since 1953).
-- year has no FK: covers 1953-2025 while election starts at 2005.
-- turnout_pct is the published figure (voter base varies pre-1990,
-- recomputation would not be faithful); 1953/57 rows are sample counts.
CREATE TABLE ts_age_turnout
(
    year                 INTEGER NOT NULL,
    gender               TEXT    NOT NULL,
    age_group_id         INTEGER NOT NULL,
    eligible             INTEGER,
    eligible_plain       INTEGER, -- ohne Wahlscheinvermerk
    eligible_wahlschein  INTEGER,
    voters               INTEGER,
    turnout_pct          REAL,
    PRIMARY KEY (year, gender, age_group_id),
    FOREIGN KEY (gender) REFERENCES gender (code),
    FOREIGN KEY (age_group_id) REFERENCES age_group (id)
);

-- Zeitreihen: btw_rws_zwst-1953 (Zweitstimmen shares by gender x age, %-only source)
CREATE TABLE ts_age_vote_share
(
    year          INTEGER NOT NULL,
    gender        TEXT    NOT NULL,
    age_group_id  INTEGER NOT NULL,
    stat_party_id INTEGER NOT NULL,
    share_pct     REAL    NOT NULL,
    PRIMARY KEY (year, gender, age_group_id, stat_party_id),
    FOREIGN KEY (gender) REFERENCES gender (code),
    FOREIGN KEY (age_group_id) REFERENCES age_group (id),
    FOREIGN KEY (stat_party_id) REFERENCES stat_party (id)
);

-- Zeitreihen: btw_ab57_wahlschein (Wahlschein/Briefwahl participation since 1957).
-- land_code: state abbreviation or 'Bund'; ratio columns dropped (derivable).
CREATE TABLE ts_absentee
(
    year                  INTEGER NOT NULL,
    land_code             TEXT    NOT NULL,
    state_id              INTEGER, -- NULL for Bund
    eligible              INTEGER,
    eligible_plain        INTEGER, -- ohne Sperrvermerk
    eligible_sperrvermerk INTEGER,
    voters                INTEGER,
    voters_plain          INTEGER, -- ohne Wahlschein
    voters_simple_ws      INTEGER, -- mit einfachem Wahlschein
    voters_brief          INTEGER, -- mit Briefwahlschein
    PRIMARY KEY (year, land_code),
    FOREIGN KEY (state_id) REFERENCES state (id)
);

-- Zeitreihen: btw_ab57_brief_urne (Zweitstimmen Urne vs. Brief since 1957)
CREATE TABLE ts_ballot_base
(
    year        INTEGER NOT NULL,
    land_code   TEXT    NOT NULL,
    state_id    INTEGER,
    ballot_type TEXT    NOT NULL CHECK (ballot_type IN ('urne', 'brief', 'total')),
    voters      INTEGER,
    invalid     INTEGER,
    valid       INTEGER,
    PRIMARY KEY (year, land_code, ballot_type),
    FOREIGN KEY (state_id) REFERENCES state (id)
);

CREATE TABLE ts_ballot_party
(
    year          INTEGER NOT NULL,
    land_code     TEXT    NOT NULL,
    state_id      INTEGER,
    ballot_type   TEXT    NOT NULL CHECK (ballot_type IN ('urne', 'brief', 'total')),
    stat_party_id INTEGER NOT NULL,
    votes         INTEGER NOT NULL, -- 'X' (party not standing) => no row
    PRIMARY KEY (year, land_code, ballot_type, stat_party_id),
    FOREIGN KEY (state_id) REFERENCES state (id),
    FOREIGN KEY (stat_party_id) REFERENCES stat_party (id)
);

-- RWS bw2: turnout by gender x birth cohort x Land (incl. BE-O/BE-W 2017/21)
CREATE TABLE rws_turnout
(
    election_year       INTEGER NOT NULL,
    land_code           TEXT    NOT NULL, -- 'Bund', 'SH'..'TH', 'BE-O', 'BE-W'
    state_id            INTEGER,          -- NULL for Bund/BE-O/BE-W
    gender              TEXT    NOT NULL,
    cohort_id           INTEGER NOT NULL,
    eligible            INTEGER,
    eligible_plain      INTEGER,
    eligible_wahlschein INTEGER,
    voters              INTEGER,
    voters_plain        INTEGER,
    voters_wahlschein   INTEGER,
    turnout_pct         REAL,
    PRIMARY KEY (election_year, land_code, gender, cohort_id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (election_year, cohort_id) REFERENCES birth_cohort (election_year, id),
    FOREIGN KEY (gender) REFERENCES gender (code),
    FOREIGN KEY (state_id) REFERENCES state (id)
);

-- RWS bst2: votes by vote type x gender x cohort x Land x party.
-- TOTAL/INVALID are stat_party rows (extrapolated + rounded source: totals
-- are NOT derivable). is_memo=1 rows ("dar. X") are subsets of SONSTIGE.
CREATE TABLE rws_vote
(
    election_year INTEGER NOT NULL,
    land_code     TEXT    NOT NULL,
    state_id      INTEGER,
    vote_type     INTEGER NOT NULL CHECK (vote_type IN (1, 2)), -- 1 Erst, 2 Zweit
    gender        TEXT    NOT NULL,
    cohort_id     INTEGER NOT NULL,
    stat_party_id INTEGER NOT NULL,
    is_memo       INTEGER NOT NULL DEFAULT 0 CHECK (is_memo IN (0, 1)),
    votes         INTEGER NOT NULL,
    PRIMARY KEY (election_year, land_code, vote_type, gender, cohort_id, stat_party_id, is_memo),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (election_year, cohort_id) REFERENCES birth_cohort (election_year, id),
    FOREIGN KEY (gender) REFERENCES gender (code),
    FOREIGN KEY (stat_party_id) REFERENCES stat_party (id),
    FOREIGN KEY (state_id) REFERENCES state (id)
);

-- RWS bst2-kombi: Erst x Zweit combination matrix (the true Stimmensplitting)
CREATE TABLE rws_vote_combo
(
    election_year           INTEGER NOT NULL,
    land_code               TEXT    NOT NULL,
    state_id                INTEGER,
    gender                  TEXT    NOT NULL,
    cohort_id               INTEGER NOT NULL,
    secondary_stat_party_id INTEGER NOT NULL, -- Zweitstimme (rows in the source)
    secondary_is_memo       INTEGER NOT NULL DEFAULT 0 CHECK (secondary_is_memo IN (0, 1)),
    primary_stat_party_id   INTEGER NOT NULL, -- Erststimme (columns in the source)
    primary_is_memo         INTEGER NOT NULL DEFAULT 0 CHECK (primary_is_memo IN (0, 1)),
    votes                   INTEGER NOT NULL,
    PRIMARY KEY (election_year, land_code, gender, cohort_id,
                 secondary_stat_party_id, secondary_is_memo, primary_stat_party_id, primary_is_memo),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (election_year, cohort_id) REFERENCES birth_cohort (election_year, id),
    FOREIGN KEY (gender) REFERENCES gender (code),
    FOREIGN KEY (secondary_stat_party_id) REFERENCES stat_party (id),
    FOREIGN KEY (primary_stat_party_id) REFERENCES stat_party (id),
    FOREIGN KEY (state_id) REFERENCES state (id)
);

-- RWS bst2-ba: votes by ballot type (Bund only in the sources)
CREATE TABLE rws_ballot_vote
(
    election_year INTEGER NOT NULL,
    vote_type     INTEGER NOT NULL CHECK (vote_type IN (1, 2)),
    ballot_type   TEXT    NOT NULL CHECK (ballot_type IN ('urne', 'brief', 'total')),
    gender        TEXT    NOT NULL,
    cohort_id     INTEGER NOT NULL,
    stat_party_id INTEGER NOT NULL,
    is_memo       INTEGER NOT NULL DEFAULT 0 CHECK (is_memo IN (0, 1)),
    votes         INTEGER NOT NULL,
    PRIMARY KEY (election_year, vote_type, ballot_type, gender, cohort_id, stat_party_id, is_memo),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (election_year, cohort_id) REFERENCES birth_cohort (election_year, id),
    FOREIGN KEY (gender) REFERENCES gender (code),
    FOREIGN KEY (stat_party_id) REFERENCES stat_party (id)
);

-- Urne/Brief per Wahlkreis (brief_wkr 2009-2025). wkr_nr is the per-year
-- Wahlkreis number = election_constituency.row_id (goes through
-- constituency_mapping for canonical joins, like everything per-year).
CREATE TABLE constituency_ballot_vote_base
(
    election_year     INTEGER NOT NULL,
    wkr_nr            INTEGER NOT NULL,
    ballot_type       TEXT    NOT NULL CHECK (ballot_type IN ('urne', 'brief')),
    eligible          INTEGER, -- source reports eligible voters on the Urne row only
    voters            INTEGER,
    invalid_primary   INTEGER,
    valid_primary     INTEGER,
    invalid_secondary INTEGER,
    valid_secondary   INTEGER,
    PRIMARY KEY (election_year, wkr_nr, ballot_type),
    FOREIGN KEY (election_year) REFERENCES election (year)
);

CREATE TABLE constituency_ballot_vote_party
(
    election_year   INTEGER NOT NULL,
    wkr_nr          INTEGER NOT NULL,
    ballot_type     TEXT    NOT NULL CHECK (ballot_type IN ('urne', 'brief')),
    stat_party_id   INTEGER NOT NULL,
    primary_votes   INTEGER,
    secondary_votes INTEGER,
    PRIMARY KEY (election_year, wkr_nr, ballot_type, stat_party_id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (stat_party_id) REFERENCES stat_party (id)
);

-- Kreisergebnisse (2009-2025). Raw level keyed by the official AGS
-- (Statistische Kennziffer); deliberately no canonical Kreis entity yet
-- (Kreis reforms = own lineage problem, revisit with F1/F2).
CREATE TABLE kreis
(
    election_year INTEGER NOT NULL,
    ags           TEXT    NOT NULL,
    name          TEXT    NOT NULL,
    state_id      INTEGER NOT NULL,
    PRIMARY KEY (election_year, ags),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (state_id) REFERENCES state (id)
);

CREATE TABLE kreis_vote_base
(
    election_year     INTEGER NOT NULL,
    ags               TEXT    NOT NULL,
    eligible          INTEGER,
    voters            INTEGER,
    invalid_primary   INTEGER,
    valid_primary     INTEGER,
    invalid_secondary INTEGER,
    valid_secondary   INTEGER,
    PRIMARY KEY (election_year, ags),
    FOREIGN KEY (election_year, ags) REFERENCES kreis (election_year, ags)
);

CREATE TABLE kreis_vote_party
(
    election_year   INTEGER NOT NULL,
    ags             TEXT    NOT NULL,
    stat_party_id   INTEGER NOT NULL,
    primary_votes   INTEGER,
    secondary_votes INTEGER,
    PRIMARY KEY (election_year, ags, stat_party_id),
    FOREIGN KEY (election_year, ags) REFERENCES kreis (election_year, ags),
    FOREIGN KEY (stat_party_id) REFERENCES stat_party (id)
);

-- Strukturdaten: canonical indicator catalog + per-year source mapping
-- (column labels embed shifting reference dates -> never name-match)
CREATE TABLE indicator
(
    id      INTEGER NOT NULL,
    code    TEXT    NOT NULL UNIQUE,
    name_de TEXT    NOT NULL,
    unit    TEXT,
    source  TEXT,
    note    TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE indicator_source_column
(
    election_year  INTEGER NOT NULL,
    column_no      INTEGER NOT NULL, -- the file's own Spalten-Nr.
    indicator_id   INTEGER NOT NULL,
    source_label   TEXT    NOT NULL,
    reference_date TEXT,
    PRIMARY KEY (election_year, column_no),
    FOREIGN KEY (indicator_id) REFERENCES indicator (id)
);

-- area_nr follows the kerg row convention: 1-299 Wahlkreis (per-year nr),
-- 901-916 Land (900 + canonical state id), 999 Bund
CREATE TABLE structure_value
(
    election_year INTEGER NOT NULL,
    area_nr       INTEGER NOT NULL,
    indicator_id  INTEGER NOT NULL,
    value         REAL,
    PRIMARY KEY (election_year, area_nr, indicator_id),
    FOREIGN KEY (election_year) REFERENCES election (year),
    FOREIGN KEY (indicator_id) REFERENCES indicator (id)
);

-- query indexes (the UI build joins heavily via the mapping tables)

CREATE INDEX idx_party_mapping_party ON party_mapping (party_id, election_year);
CREATE INDEX idx_party_mapping_col ON party_mapping (election_year, column_index);
CREATE INDEX idx_constituency_mapping_c ON constituency_mapping (constituency_id, election_year);
CREATE INDEX idx_constituency_mapping_raw ON constituency_mapping (election_year, election_state_id, row_id);
CREATE INDEX idx_state_mapping_state ON state_mapping (state_id, election_year);
CREATE INDEX idx_cvp_year_c ON constituency_vote_party (election_year, constituency_id);
CREATE INDEX idx_svp_year_s ON state_vote_party (election_year, state_id);

-- statistics-domain indexes (fact tables are read per year/area by the UI build)
CREATE INDEX idx_rws_vote_party ON rws_vote (stat_party_id, election_year);
CREATE INDEX idx_rws_combo_sec ON rws_vote_combo (election_year, secondary_stat_party_id);
CREATE INDEX idx_cbvp_year_wkr ON constituency_ballot_vote_party (election_year, wkr_nr);
CREATE INDEX idx_kvp_year ON kreis_vote_party (election_year, stat_party_id);
CREATE INDEX idx_structure_indicator ON structure_value (indicator_id, election_year);
CREATE INDEX idx_structure_area ON structure_value (election_year, area_nr);
