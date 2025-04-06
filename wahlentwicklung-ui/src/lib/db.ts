const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(process.cwd(), 'wahlentwicklung.db');

function queryDatabase(sql, params = []) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.error("DB Connect Error:", err.message);
                return reject(err);
            }
        });
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error("DB Query Error:", err.message, "SQL:", sql, "Params:", params);
                reject(err);
            } else {
                resolve(rows);
            }
            db.close((closeErr) => {
                if (closeErr) {
                    console.error("DB Close Error:", closeErr.message);
                }
            });
        });
    });
}

export async function getPreviousElectionYear(currentYear) {
    const sql = `
        SELECT MAX(year) as previousYear
        FROM election
        WHERE year < ?;
    `;
    const result = await queryDatabase(sql, [currentYear]);
    return result[0]?.previousYear || null;
}

export async function getPrimaryVotesForYear(year) {
    const sql = `
        SELECT
            p.abbreviation,
            p.color,
            evp.primaryvote_definitive as votes
        FROM election_vote_party evp
        JOIN party_mapping pm ON evp.election_year = pm.election_year AND evp.party_id = pm.column_index
        JOIN party p ON pm.party_id = p.id
        WHERE evp.election_year = ?
          AND p.abbreviation IS NOT NULL; -- TODO check all relevant parties
    `;
    return await queryDatabase(sql, [year]);
}

export async function getTotalValidPrimaryVotesForYear(year) {
    const sql = `
        SELECT validvoters_primaryvote_definitive  as totalVotes
        FROM election_vote_base
        WHERE election_year = ?;
    `;
    const result = await queryDatabase(sql, [year]);
    return result[0]?.totalVotes || 0;
}

export async function getAllElectionYears() {
    const sql = `SELECT year FROM election ORDER BY year ASC;`;
    const rows = await queryDatabase(sql);
    return rows.map(row => row.year);
}

// Helper if further information will be stored in the election table
export async function getElectionByYear(year) {
    const sql = `SELECT year FROM election WHERE year = ?;`;
    const result = await queryDatabase(sql, [year]);
    return result[0] || null;
}

export async function getSeatDistributionForYear(year) {
    const sql = `
        SELECT
            p.abbreviation,
            p.color,
            ep.seat_count as seats
        FROM election_party ep
        JOIN party_mapping pm ON ep.election_year = pm.election_year AND ep.column_index = pm.column_index
        JOIN party p ON pm.party_id = p.id
        WHERE ep.election_year = ? AND ep.seat_count > 0
          AND p.abbreviation IS NOT NULL -- TODO check, see above todo
        ORDER BY ep.seat_count DESC;
    `;
    try {
        const rows = await queryDatabase(sql, [year]);
        return rows.map(row => ({
            ...row,
            seats: Number(row.seats) || 0,
        }));
    } catch (error) {
        console.error(`Error fetching seat distribution for year ${year}:`, error);
        return [];
    }
}