select evp.secondaryvote_definitiv,
       (CAST(evp.secondaryvote_definitiv AS FLOAT) / evb.validvoters_secondarybote_definitive),
       ep.name
from election_vote_party evp
         join main.election_party ep on evp.election_year = ep.election_year and evp.party_id = ep.column_index
         join election_vote_base evb on evp.election_year = evb.election_year
where evp.election_year = 2021
order by evp.secondaryvote_definitiv DESC;