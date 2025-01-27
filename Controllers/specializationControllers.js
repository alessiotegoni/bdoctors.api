const connection = require("../data/db");

function getDoctorsSpecializations(_, res) {
  connection.query("SELECT * FROM specializations", (err, specializations) => {
    if (err) throw new Error(err.message);
    res
      .status(200)
      .json(specializations.map((s) => ({ value: s.id, label: s.name })));
  });
}

module.exports = { getDoctorsSpecializations };
