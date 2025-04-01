const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(process.cwd(), 'wahlentwicklung.db');

function getElectionById(id) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.get('SELECT * FROM main.election WHERE year = ?', [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
            db.close();
        });
    });
}

function getAllElectionIds() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.all('SELECT year FROM main.election', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map(row => row.year));
            }
            db.close();
        });
    });
}

function getElectionBaseResultByYear(year) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.get('SELECT * FROM main.election_vote_base WHERE election_year = ?', [year], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
            db.close();
        });
    });
}

module.exports = { getElectionById, getAllElectionIds, getElectionBaseResultByYear };