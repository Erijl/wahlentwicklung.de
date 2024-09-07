-- dto tables

create table election
(
    year integer not null,

    constraint election_pkey primary key (year)
);

create table state
(
    id   integer      not null,
    name varchar(255) not null,

    constraint state_pkey primary key (id)
);

create table constituency
(
    id       integer not null,
    state_id integer not null,

    constraint constituency_pkey primary key (id),
    constraint constituency_state_id_fkey foreign key (state_id) references state (id)
);

create table party
(
    id           integer      not null,
    name         varchar(255) not null,
    abbreviation varchar(20),
    color        varchar(6),

    constraint party_pkey primary key (id)
);


-- base data tables

create table election_vote_base
(
    id                                       integer not null,
    election_year                            integer not null,


    eligiblevoters_primaryvote_preliminary   integer not null,
    eligiblevoters_primaryvote_definitiv     integer not null,

    eligiblevoters_secondaryvote_preliminary integer not null,
    eligiblevoters_secondarybote_definitive  integer not null,


    actualvoters_primaryvote_preliminary     integer not null,
    actualvoters_primaryvote_definitiv       integer not null,

    actualvoters_secondaryvote_preliminary   integer not null,
    actualvoters_secondarybote_definitive    integer not null,


    validvoters_primaryvote_preliminary      integer not null,
    validvoters_primaryvote_definitiv        integer not null,

    validvoters_secondaryvote_preliminary    integer not null,
    validvoters_secondarybote_definitive     integer not null,


    invalidvoters_primaryvote_preliminary    integer not null,
    invalidvoters_primaryvote_definitiv      integer not null,

    invalidvoters_secondaryvote_preliminary  integer not null,
    invalidvoters_secondarybote_definitive   integer not null,

    constraint election_vote_base_pkey primary key (id),
    constraint election_vote_base_election_year_fkey foreign key (election_year) references election (year)
);

create table state_vote_base
(
    id                                       integer not null,
    election_year                            integer not null,
    state_id                                 integer not null,


    eligiblevoters_primaryvote_preliminary   integer not null,
    eligiblevoters_primaryvote_definitiv     integer not null,

    eligiblevoters_secondaryvote_preliminary integer not null,
    eligiblevoters_secondarybote_definitive  integer not null,


    actualvoters_primaryvote_preliminary     integer not null,
    actualvoters_primaryvote_definitiv       integer not null,

    actualvoters_secondaryvote_preliminary   integer not null,
    actualvoters_secondarybote_definitive    integer not null,


    validvoters_primaryvote_preliminary      integer not null,
    validvoters_primaryvote_definitiv        integer not null,

    validvoters_secondaryvote_preliminary    integer not null,
    validvoters_secondarybote_definitive     integer not null,


    invalidvoters_primaryvote_preliminary    integer not null,
    invalidvoters_primaryvote_definitiv      integer not null,

    invalidvoters_secondaryvote_preliminary  integer not null,
    invalidvoters_secondarybote_definitive   integer not null,

    constraint state_vote_base_pkey primary key (id),
    constraint state_vote_base_election_year_fkey foreign key (election_year) references election (year),
    constraint state_vote_base_state_id_fkey foreign key (state_id) references state (id)
);

create table constituency_vote_base
(
    id                                       integer not null,
    election_year                            integer not null,
    constituency_id                          integer not null,


    eligiblevoters_primaryvote_preliminary   integer not null,
    eligiblevoters_primaryvote_definitiv     integer not null,

    eligiblevoters_secondaryvote_preliminary integer not null,
    eligiblevoters_secondarybote_definitive  integer not null,


    actualvoters_primaryvote_preliminary     integer not null,
    actualvoters_primaryvote_definitiv       integer not null,

    actualvoters_secondaryvote_preliminary   integer not null,
    actualvoters_secondarybote_definitive    integer not null,


    validvoters_primaryvote_preliminary      integer not null,
    validvoters_primaryvote_definitiv        integer not null,

    validvoters_secondaryvote_preliminary    integer not null,
    validvoters_secondarybote_definitive     integer not null,


    invalidvoters_primaryvote_preliminary    integer not null,
    invalidvoters_primaryvote_definitiv      integer not null,

    invalidvoters_secondaryvote_preliminary  integer not null,
    invalidvoters_secondarybote_definitive   integer not null,

    constraint constituency_vote_base_pkey primary key (id),
    constraint constituency_vote_base_election_year_fkey foreign key (election_year) references election (year),
    constraint constituency_vote_base_constituency_id_fkey foreign key (constituency_id) references constituency (id)
);

-- party tables

create table election_vote_party
(
    id                        integer not null,
    election_year             integer not null,
    party_id                  integer not null,

    primaryvote_ppreliminary  integer not null,
    primaryvote_definitiv     integer not null,

    secondaryvote_preliminary integer not null,
    secondaryvote_definitiv   integer not null,

    constraint election_vote_party_pkey primary key (id),
    constraint election_vote_party_election_year_fkey foreign key (election_year) references election (year),
    constraint election_vote_party_party_id_fkey foreign key (party_id) references party (id)
);

create table state_vote_party
(
    id                        integer not null,
    election_year             integer not null,
    party_id                  integer not null,
    state_id                  integer not null,

    primaryvote_ppreliminary  integer not null,
    primaryvote_definitiv     integer not null,

    secondaryvote_preliminary integer not null,
    secondaryvote_definitiv   integer not null,

    constraint state_vote_party_pkey primary key (id),
    constraint state_vote_party_election_year_fkey foreign key (election_year) references election (year),
    constraint state_vote_party_party_id_fkey foreign key (party_id) references party (id),
    constraint state_vote_party_state_id_fkey foreign key (state_id) references state (id)
);

create table constituency_vote_party
(
    id                        integer not null,
    election_year             integer not null,
    party_id                  integer not null,
    constituency_id           integer not null,

    primaryvote_ppreliminary  integer not null,
    primaryvote_definitiv     integer not null,

    secondaryvote_preliminary integer not null,
    secondaryvote_definitiv   integer not null,

    constraint constituency_vote_party_pkey primary key (id),
    constraint constituency_vote_party_election_year_fkey foreign key (election_year) references election (year),
    constraint constituency_vote_party_party_id_fkey foreign key (party_id) references party (id),
    constraint constituency_vote_party_constituency_id_fkey foreign key (constituency_id) references constituency (id)
);
