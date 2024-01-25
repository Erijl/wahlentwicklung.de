CREATE OR REPLACE FUNCTION getElectionResults(p_election_id integer)
    RETURNS TABLE
            (
                party_name                    text,
                total_votes_primary           bigint,
                percentage_of_votes_primary   numeric,
                total_votes_seconary          bigint,
                percentage_of_votes_secondary numeric,
                color_hex                     text
            )
AS
$$
BEGIN
    RETURN QUERY
        WITH state_votes
                 AS (SELECT SUM(CAST(sv.valid_votes ->> 'primary_votes_final' AS INTEGER))   AS total_valid_votes,
                            SUM(CAST(sv.valid_votes ->> 'secondary_votes_final' AS INTEGER)) AS total_valid_votes_s
                     FROM state_votes sv
                     WHERE sv.election_id = p_election_id
                       AND sv.state_id = 99)
        SELECT p.name::text                                               AS party_name,
               SUM(CAST(pv.votes ->> 'primary_votes_final' AS INTEGER))   AS total_votes_primary,
               (SUM(CAST(pv.votes ->> 'primary_votes_final' AS INTEGER)) * 100.0 /
                stv.total_valid_votes)::numeric                           AS percentage_of_votes_primary,
               SUM(CAST(pv.votes ->> 'secondary_votes_final' AS INTEGER)) AS total_votes_seconary,
               (SUM(CAST(pv.votes ->> 'secondary_votes_final' AS INTEGER)) * 100.0 /
                stv.total_valid_votes_s)::numeric                         AS percentage_of_votes_secondary,
               p.color_hex::text
        FROM party p
                 JOIN party_votes pv ON p.party_id = pv.party_id
                 JOIN district d ON pv.district_id = d.district_id
                 JOIN state_votes stv ON true
        WHERE d.election_id = p_election_id
        GROUP BY p.name, d.election_id, stv.total_valid_votes, stv.total_valid_votes_s, p.color_hex
        ORDER BY total_votes_primary DESC;
END;
$$ LANGUAGE plpgsql;
