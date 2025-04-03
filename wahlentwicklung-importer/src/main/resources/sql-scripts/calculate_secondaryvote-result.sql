select evp.secondaryvote_definitive,
       (CAST(evp.secondaryvote_definitive AS FLOAT) / evb.validvoters_secondaryvote_definitive),
       ep.name
from election_vote_party evp
         join main.election_party ep on evp.election_year = ep.election_year and evp.party_id = ep.column_index
         join election_vote_base evb on evp.election_year = evb.election_year
where evp.election_year = 2021
order by evp.secondaryvote_definitive DESC;

select evp.secondaryvote_definitive,
       (CAST(evp.secondaryvote_definitive AS FLOAT) / evb.validvoters_secondaryvote_definitive),
       ep.name,
       party.color
from election_vote_party evp
         join main.election_party ep on evp.election_year = ep.election_year and evp.party_id = ep.column_index
         join election_vote_base evb on evp.election_year = evb.election_year
         join party_mapping pm on ep.election_year = pm.election_year and ep.column_index = pm.column_index
         join party on pm.party_id = party.id
where evp.election_year = 2021
order by evp.secondaryvote_definitive DESC;