const connection = require('../data/db');

function index(req, res) {
    const sql = `SELECT * FROM doctors`;
    connection.query(sql, (err, doctors) => {
        if (err) return res.status(404).json({ error: `error` });
        res.json({ doctors })
    })
}
module.exports = index