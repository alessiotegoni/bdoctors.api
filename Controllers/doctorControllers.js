const connection = require('../data/db');

function index(req, res) {
  let sql = `
    SELECT
      doctors.*,
      GROUP_CONCAT(DISTINCT specializations.name ORDER BY specializations.name SEPARATOR ', ') AS specializations,
      ROUND(AVG(reviews.rating), 2) AS avg_rating
    FROM doctors
    JOIN doctor_specializations
      ON doctors.id = doctor_specializations.doctor_id
    JOIN specializations
      ON doctor_specializations.specialization_id = specializations.id
    LEFT JOIN reviews
      ON doctors.id = reviews.doctor_id
    GROUP BY doctors.id
  `;

  const { doctor, specializations, min_rating } = req.query;

  let havingConditions = [];
  let queryParams = [];

  if (doctor) {
    havingConditions.push(
      `(LOWER(CONCAT(doctors.first_name, ' ', doctors.last_name)) LIKE ? OR doctors.email LIKE ?)`
    );
    queryParams.push(`%${doctor}%`, `%${doctor}%`);
  }

  if (Array.isArray(specializations) && specializations.length) {
    const specializationIds = specializations.map((id) => parseInt(id.trim()));
    havingConditions.push(
      `GROUP_CONCAT(DISTINCT specializations.id ORDER BY specializations.id SEPARATOR ',') LIKE ?`
    );
    queryParams.push(`%${specializationIds.join(',')}%`);
  }

  if (min_rating) {
    havingConditions.push(`AVG(reviews.rating) >= ?`);
    queryParams.push(parseFloat(min_rating));
  }

  if (havingConditions.length > 0) {
    sql += ` HAVING ${havingConditions.join(' AND ')}`;
  }

  connection.query(sql, queryParams, (err, doctors) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'error' });
    }
    if (!doctors.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(doctors);
  });
}

// add filters with name surname and specializations of doctors

function show(req, res) {
  const id = parseInt(req.params.id);
  console.log(id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'id not found' });
  }
  const IdSql = `SELECT
                  doctors.*,
                  GROUP_CONCAT(DISTINCT specializations.name) AS specializations
                  FROM doctors
                  JOIN doctor_specializations
                  ON doctors.id = doctor_specializations.doctor_id
                  JOIN specializations
                  ON doctor_specializations.specialization_id = specializations.id
                  WHERE doctors.id = ?
                  GROUP BY doctors.id
                  `;
  connection.query(IdSql, [id], (err, doctor) => {
    // console.log(doctor);
    if (!doctor?.length) {
      return res.status(404).json({ error: 'Not found' });
    }

    connection.query(
      'SELECT * FROM reviews WHERE doctor_id = ?',
      [doctor[0].id],
      (err, reviews) => {
        res.status(200).json({ ...doctor[0], reviews: reviews ?? [] });
      }
    );
  });
}

function storeDoctor(req, res) {
  const { first_name, last_name, email, phone, address, specializationsIds } = req.body;

  //aggiunta nuovo dottore al database
  //cerco in database se la mail inserita risulta già registrata
  const mailSql = `SELECT * FROM doctors WHERE email = ?`;

  connection.query(mailSql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'email already registered' });
    }

    //se la mail non esiste allora si procede alla creazione di un nuovo dottore
    const sql = `INSERT INTO doctors (first_name, last_name, email, phone, address) VALUES (?, ?, ?, ?, ?)`;

    connection.query(sql, [first_name, last_name, email, phone, address], (err, results) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      const sql2 = `INSERT INTO doctor_specializations (doctor_id, specialization_id) VALUES ?`;

      const newId = results.insertId;

      //array di coppia [id Dottore - id specializzazione] che saranno eseguiti in query
      //utilizzando questo metodo con una sola query è possibile inserire piú righe nella tabella ponte
      const values = specializationsIds.map((specialization) => [newId, specialization]);

      //aggiunta nella tabella ponte id dottore creato ed id specializzazioni
      connection.query(sql2, [values], (err, _) => {
        if (err) return res.status(500).json({ message: err.message });
        return res.status(201).json(newId);
      });
    });
  });
}

function storeReview(req, res) {
  //id del medico
  const doctorId = parseInt(req.params.id);

  //recupero parametri dalla body request
  const { first_name, last_name, rating, review_text } = req.body;

  //campi nome e voto necessari
  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'Rating must be between 1 and 5',
    });
  }

  //query
  const sql = `INSERT INTO reviews (first_name, last_name, review_text, rating, doctor_id) VALUES (?,?,?,?,?)`;

  connection.query(
    sql,
    [first_name.trim(), last_name.trim(), review_text && review_text.trim(), rating, doctorId],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });

      res.status(201).json(results.insertId);
    }
  );
}

module.exports = {
  index,
  show,
  storeDoctor,
  storeReview,
};
