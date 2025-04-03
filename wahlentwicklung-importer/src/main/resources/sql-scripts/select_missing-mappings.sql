
-- Parteien
select count(pm.column_index) as 'missing mappings', election_year from party_mapping pm
where pm.party_id is null
group by election_year order by election_year DESC;


select pm.party_id, pm.column_index, ep.name, ep.election_year, (party_id is not null) as 'mapped' from party_mapping pm
                                                                                                            join election_party ep on pm.column_index = ep.column_index and pm.election_year = ep.election_year;

select pm.id, pm.election_year, ep.name from party_mapping pm
                                                 join main.election_party ep on ep.election_year = pm.election_year and ep.column_index = pm.column_index
where pm.party_id is null
  and pm.election_year = 2017;


--  Bundesländer

select sm.* from state_mapping sm where state_id is null;


-- Wahlkreis
select cm.* from constituency_mapping cm where cm.constituency_id is null;

select count(cm.id) as 'missing mappings', election_year from constituency_mapping cm where cm.constituency_id is null group by election_year;

select * from constituency_mapping cm
                  join main.election_constituency ec on cm.election_year = ec.election_year and cm.election_state_id = ec.state_id and cm.row_id = ec.row_id;
