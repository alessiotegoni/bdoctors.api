const { body, validationResult } = require('express-validator');

// Middleware di validazione per la creazione di un doctor
const validateDoctor = [
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
    .notEmpty()
    .withMessage('inserisci il cognome')
    .isString()
    .withMessage('il cognome deve essere costituito solo da lettere')
    .isLength({ min: 3, max: 50 })
    .withMessage('Il cognome deve essere compreso tra 3 e 50 caratteri'),
  //specializzazioni
  body('specializationsIds')
    .isArray()
    .notEmpty()
    .withMessage('Scegli almeno una specializzazione'),
  //email
  body('email').isEmail().withMessage('Per favore inserisci una mail valida'),
  //phone - puo' contenere solo numeri e il simbolo +
  body('phone')
    .isString()
    // .isMobilePhone('it-IT', { strictMode: false })
    .matches(/^\+?\d+$/)
    .withMessage(
      `Il numero di telefono puo essere composto solo da numeri e contenere un simbolo + solo all'inizio`
    ),
  //address
  body('address')
    .isLength({ min: 5, max: 255 })
    .withMessage(`Inserisci un indirizzo valido`),

  // Middleware per gestire gli errori di validazione
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Se ci sono errori, restituisci un errore 400 con i dettagli dei campi che non hanno superato la validazione
      return res.status(400).json({ errors: errors.array() });
    } else {
      next(); // Se tutto è valido, passa alla funzione successiva
    }
  },
];

module.exports = validateDoctor;
