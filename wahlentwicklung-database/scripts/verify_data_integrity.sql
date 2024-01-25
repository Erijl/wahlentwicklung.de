SELECT e.election_id,
       e.year                                                         AS wahl_year,
       SUM(CAST(sv.valid_votes ->> 'primary_votes_final' AS INTEGER)) AS total_votes_except_federal,
       (SELECT SUM(CAST(valid_votes ->> 'primary_votes_final' AS INTEGER))
        FROM state_votes
        WHERE election_id = e.election_id
          AND state_id = 99)                                          AS total_votes_federal,
       CASE
           WHEN SUM(CAST(sv.valid_votes ->> 'primary_votes_final' AS INTEGER)) =
                (SELECT SUM(CAST(valid_votes ->> 'primary_votes_final' AS INTEGER))
                 FROM state_votes
                 WHERE election_id = e.election_id
                   AND state_id = 99) THEN TRUE
           ELSE FALSE
           END                                                        AS integrity_check
FROM election e
         JOIN state_votes sv ON e.election_id = sv.election_id
WHERE e.active = true
  AND sv.state_id <> 99
GROUP BY e.election_id, e.year
HAVING SUM(CAST(sv.valid_votes ->> 'primary_votes_final' AS INTEGER)) =
       (SELECT SUM(CAST(valid_votes ->> 'primary_votes_final' AS INTEGER))
        FROM state_votes
        WHERE election_id = e.election_id
          AND state_id = 99);