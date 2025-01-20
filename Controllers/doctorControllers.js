const connection = require('../data/db');

function index(req, res) {
    const sql = `SELECT * FROM doctors`;
    connection.query(sql, (err, doctors) => {
        if (err) throw new Error(err)
        res.json(doctors)
    })
}
module.exports = index
