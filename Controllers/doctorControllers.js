const connection = require("../data/db");

function index(req, res) {
  const sql = `SELECT * FROM doctors`;
  connection.query(sql, (err, doctors) => {
    if (err) throw new Error(err);
    res.json(doctors);
  });
}

function show(req, res) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "id not found" });
  }
  const IdSql = `SELECT * FROM doctors WHERE id = ?`;
  connection.query(IdSql, [id], (err, [doctor]) => {
    if (err) {
      return res.status(500).json({ error: "server error" });
    }
    if (!doctor) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(200).json(doctor);
  });
}

function getDoctorsSpecializations(_, res) {
  connection.query("SELECT * FROM specializations", (err, specializations) => {
    if (err) throw new Error(err.message);

    res.status(200).json(specializations);
  });
}

module.exports = { index, show, getDoctorsSpecializations };
