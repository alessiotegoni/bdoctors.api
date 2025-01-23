const connection = require('../data/db');

function index(req, res) {
  const { doctor, specializations, min_rating } = req.query;

  // doctor is first_name, last_name concatenati or email
  // specializations is an array of string with specializationsId
  // min rating is a string

  const sql = `SELECT
    doctors.*,
    GROUP_CONCAT(DISTINCT specializations.name ORDER BY specializations.name SEPARATOR ', ') AS specializations,
    AVG(reviews.rating) AS avg_rating
FROM doctors
JOIN doctor_specializations
    ON doctors.id = doctor_specializations.doctor_id
JOIN specializations
    ON doctor_specializations.specialization_id = specializations.id
LEFT JOIN reviews
    ON doctors.id = reviews.doctor_id
GROUP BY doctors.id`;

  connection.query(sql, (err, doctors) => {
    if (err) res.status(500).json({ err: 'error' });
    res.json(doctors);
  });
}

// addind filters with name surname and specializations of doctors

function getFilteredDoctors(req, res) {
  // Retrieve parameters from URL path using req.query
  const { first_name, last_name, specialization } = req.query;

  const sql = `SELECT
    doctors.*,
    GROUP_CONCAT(DISTINCT specializations.name ORDER BY specializations.name SEPARATOR ', ') AS specializations,
    AVG(reviews.rating) AS rating
FROM doctors
JOIN doctor_specializations
    ON doctors.id = doctor_specializations.doctor_id
JOIN specializations
    ON doctor_specializations.specialization_id = specializations.id
LEFT JOIN reviews
    ON doctors.id = reviews.doctor_id
GROUP BY doctors.id`;

  const values = [
    first_name || null,
    first_name ? `%${first_name}%` : null,
    last_name || null,
    last_name ? `%${last_name}%` : null,
    specialization || null,
    specialization ? `%${specialization}%` : null,
  ];

  connection.query(sql, values, (err, doctors) => {
    if (err) {
      return res.status(500).json({ error: 'error' });
    }
    res.json(doctors);
  });
}

function show(req, res) {
  const id = parseInt(req.params.id);
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
                  GROUP BY doctors.id`;
  connection.query(IdSql, [id], (err, [doctor]) => {
    console.log(doctor);
    if (err) {
      return res.status(500).json({ error: 'server error' });
    }
    if (!doctor) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.status(200).json(doctor);
  });
}

function getDoctorsSpecializations(_, res) {
  connection.query('SELECT * FROM specializations', (err, specializations) => {
    if (err) throw new Error(err.message);
    res.status(200).json(specializations.map((s) => ({ value: s.id, label: s.name })));
  });
}

function storeDoctor(req, res) {
  const { firstName, lastName, email, phone, address, specializationsIds } = req.body;

  if (firstName.length > 50 || firstName.length < 3 || typeof firstName !== 'string') {
    return res.status(400).json({
      error: 'Invalid first name',
      message: 'Il campo Nome deve avere un valore tra 3 e 50 caratteri',
    });
  }

  if (lastName.length > 50 || lastName.length < 3 || typeof firstName !== 'string') {
    return res.status(400).json({
      error: 'Invalid last name',
      message: 'Il campo Cognome deve avere un valore tra 3 e 50 caratteri',
    });
  }

  if (!email.includes('@') || !email.includes('.com')) {
    return res.status(400).json({
      error: 'Invalid email',
      message: 'Il campo Email deve includere i caratteri @ e .com',
    });
  }

  if (
    phone.length < 5 ||
    typeof phone !== 'string' ||
    (phone.includes('+') && phone.indexOf('+') !== 0)
  ) {
    return res.status(400).json({
      error: 'Invalid phone number',
      message:
        'Il campo Telefono deve avere un valore numerico di almeno 5 caratteri e il simbolo + puo essere usato solo come prefisso',
    });
  }

  if (
    address.length > 255 ||
    address.length < 5 ||
    typeof address !== 'string' ||
    (!address.toLowerCase().startsWith('via') && !address.toLowerCase().startsWith('piazza'))
  ) {
    console.log(address.startsWith('Via'), address.startsWith('Piazza'));
    return res.status(400).json({
      error: 'Invalid address',
      message:
        'Il campo Indirizzo deve avere un valore tra 5 e 255 caratteri e deve iniziare con Via o Piazza',
    });
  }

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

    connection.query(sql, [firstName, lastName, email, phone, address], (err, results) => {
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
  const { firstName, lastName, rating, reviewText } = req.body;

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
      message: 'first name and vote are required',
    });
  }

  //query
  const sql = `INSERT INTO reviews (first_name, last_name, review_text, rating, doctor_id) VALUES (?,?,?,?,?)`;

  connection.query(
    sql,
    [firstName.trim(), lastName.trim(), reviewText && reviewText.trim(), rating, doctorId],
    (err, results) => {
      if (!results) return res.status(404).json({ message: 'doctor not found' });
      if (err) return res.status(500).json({ message: err.message });

      res.status(201).json(results.insertId);
    }
  );
}

module.exports = {
  index,
  show,
  getDoctorsSpecializations,
  storeDoctor,
  storeReview,
  getFilteredDoctors,
};
