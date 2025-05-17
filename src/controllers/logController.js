const db = require('./connection');

const refreshLogs = async (req, res) => {
    const result = await db.query(`SELECT * FROM refresh_logs ORDER BY refresh_time DESC LIMIT 50`);
    res.json(result.rows);
}

module.exports = { refreshLogs };