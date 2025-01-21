const connection = require('../data/db')

function index(req, res) {
  const sql = `SELECT * FROM doctors`
  connection.query(sql, (err, doctors) => {
    if (err) throw new Error(err)
    res.json(doctors)
  })
}

function show(req, res) {
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return res.status(400).json({ error: 'id not found' })
  }
  const IdSql = `SELECT * FROM doctors WHERE id = ?`
  connection.query(IdSql, [id], (err, doctors) => {
    if (err) {
      return res.status(500).json({ error: 'server error' })
    }
    if (doctors.length === 0) {
      return res.status(404).json({ error: 'Not found' })
    }
    res.status(200).json({ doctors })
  })
}

function storeReview(req, res) {
  //id del medico
  const doctorId = parseInt(req.params.id)

  //recupero parametri dalla body request
  const { firstName, lastName, rating, text } = req.body

  //campi nome e voto necessari
  if (
    !firstName ||
    firstName.length > 50 ||
    typeof firstName !== 'string' ||
    rating < 1 ||
    rating > 5
  ) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'name and vote are required',
    })
  }

  //query
  const sql = `INSERT INTO reviews (first_name, last_name, review_text, rating, doctor_id) VALUES (?,?,?,?,?)`

  connection.query(
    sql,
    [firstName.trim(), lastName.trim(), text.trim(), rating, doctorId],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message })

      // console.log(results);

      res.status(201).json({
        message: 'review created successfully',
        newId: results.insertId,
      })
    }
  )
}
module.exports = { index, show, storeReview }
