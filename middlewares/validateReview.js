const { body, validationResult } = require('express-validator');

// Middleware di validazione per la creazione di un doctor
const validateReview = [
  // Validazione dei campi
  //first name
  body('first_name')
    .notEmpty()
    .withMessage('Inserisci un nome')
    .isString()
    .withMessage('Il nome deve essere costituito solo da lettere')
    .isLength({ min: 3, max: 50 })
    .withMessage('Il nome deve essere compreso tra 3 e 50 caratteri'),
  //last name
  body('last_name')
    .optional()
    .notEmpty()
    .withMessage('inserisci il cognome')
    .isString()
    .withMessage('il cognome deve essere costituito solo da lettere')
    .isLength({ min: 3, max: 50 })
    .withMessage('Il cognome deve essere compreso tra 3 e 50 caratteri'),
  //rating
  body('rating')
    .notEmpty()
    .withMessage('Inserisci una valutazione')
    .isInt({ min: 1, max: 5 })
    .withMessage('La valutazione deve essere compresa tra 1 e 5'),
  //review text
  body('review_text')
    .optional()
    .notEmpty()
    .withMessage('Inserisci una recensione'),
  // Middleware per gestire gli errori di validazione
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Se ci sono errori, restituisci un errore 400 con i dettagli dei campi che non hanno superato la validazione
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Se tutto è valido, passa alla funzione successiva
  },
];

module.exports = validateReview;
