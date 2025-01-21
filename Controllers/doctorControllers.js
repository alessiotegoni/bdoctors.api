const connection = require('../data/db');

function index(req, res) {
    const sql = `SELECT * FROM doctors`;
    connection.query(sql, (err, doctors) => {
        if (err) throw new Error(err)
        res.json(doctors)
    })
}
<<<<<<< HEAD:Controllers/doctorControllers.js
module.exports = index
=======
function show(req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "id not found" });
    }
    const IdSql = `SELECT * FROM doctors WHERE id = ?`;
    connection.query(IdSql, [id], (err, doctors) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (doctors.length === 0) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.status(200).json({ doctors });
    });
}
module.exports = {index,show}
>>>>>>> 4f5d876 (completed index and show):Controllers/DoctorController.js
