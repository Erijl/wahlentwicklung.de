select count(pm.column_index) as 'missing mappings', election_year from party_mapping pm
where pm.party_id is null
group by election_year order by election_year DESC;


select pm.party_id, pm.column_index, ep.name, ep.election_year, (party_id is not null) as 'mapped' from party_mapping pm
join election_party ep on pm.column_index = ep.column_index and pm.election_year = ep.election_year;