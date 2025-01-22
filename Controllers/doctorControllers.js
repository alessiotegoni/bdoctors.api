const connection = require('../data/db')

function index(req, res) {
  const sql = `SELECT * FROM doctors`
  connection.query(sql, (err, doctors) => {
    if (err) throw new Error(err)
    res.json(doctors)
  })
}

function show(req, res) {
  ;``
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return res.status(400).json({ error: 'id not found' })
  }
  const IdSql = `SELECT * FROM doctors WHERE id = ?`
  connection.query(IdSql, [id], (err, [doctor]) => {
    if (err) {
      return res.status(500).json({ error: 'server error' })
    }
    if (!doctor) {
      return res.status(404).json({ error: 'Not found' })
    }
    res.status(200).json(doctor)
  })
}

function getDoctorsSpecializations(_, res) {
  connection.query('SELECT * FROM specializations', (err, specializations) => {
    if (err) throw new Error(err.message)

    res.status(200).json(specializations.map((s) => ({ value: s.id, label: s.name })))
  })
}

function storeDoctor(req, res) {
  const { firstName, lastName, email, phone, address, specializationsIds } = req.body

  if (
    !firstName ||
    firstName.length > 50 ||
    firstName.length < 3 ||
    !lastName ||
    lastName.length > 50 ||
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    !email.includes('@') ||
    !email.includes('.') ||
    !phone ||
    phone.length < 5 ||
    typeof phone !== 'string' ||
    !address ||
    address.length < 5 ||
    !specializationsIds
  ) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'First name, last name, specializations and address are required',
    })
  }

  //aggiunta nuovo dottore al database
  //cerco in database se la mail inserita risulta già registrata
  const mailSql = `SELECT * FROM doctors WHERE email = ?`

  connection.query(mailSql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message })
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'email already registered' })
    }

    //se la mail non esiste allora si procede alla creazione di un nuovo dottore
    const sql = `INSERT INTO doctors (first_name, last_name, email, phone, address) VALUES (?, ?, ?, ?, ?)`

    connection.query(sql, [firstName, lastName, email, phone, address], (err, results) => {
      if (err) {
        return res.status(500).json({ message: err.message })
      }

      const sql2 = `INSERT INTO doctor_specializations (doctor_id, specialization_id) VALUES ?`

      const newId = results.insertId

      //array di coppia [id Dottore - id specializzazione] che saranno eseguiti in query
      //utilizzando questo metodo con una sola query è possibile inserire piú righe nella tabella ponte
      const values = specializationsIds.map((specialization) => [newId, specialization])

      //aggiunta nella tabella ponte id dottore creato ed id specializzazioni
      connection.query(sql2, [values], (err, _) => {
        if (err) return res.status(500).json({ message: err.message })
        return res.status(201).json(newId)
      })
    })
  })
}

function storeReview(req, res) {
  //id del medico
  const doctorId = parseInt(req.params.id)

  //recupero parametri dalla body request
  const { firstName, lastName, rating, reviewText } = req.body

  //campi nome e voto necessari
  if (
    !firstName ||
    firstName.length > 50 ||
    firstName.length < 3 ||
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
    [firstName.trim(), lastName.trim(), reviewText.trim(), rating, doctorId],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message })

      res.status(201).json(results.insertId)
    }
  )
}

module.exports = {
  index,
  show,
  getDoctorsSpecializations,
  storeDoctor,
  storeReview,
}
