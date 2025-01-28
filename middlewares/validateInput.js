//middleware per la validazione dei dati inviati alla body request
//creare un oggetto rules con le regole di ogni input da controllare

const rules = {
  first_name: {
    min: 3,
    max: 50,
  },
  last_name: {
    min: 3,
    max: 50,
  },
  email: {
    min: 3,
    max: 50,
    isRequired: ['@', '.com'],
  },
  phone: {
    min: 3,
    max: 20,
    //controllo che solo il primo carattere sia un +
    startsWith: ['+'],
    specialCharacters: ['+'],
  },
  address: {
    min: 5,
    max: 255,
    startsWith: ['Via', 'Piazza'],
  },
};

/**
 * Questa funzione, come le altre non ritorna alcun valore ma modifica l'oggetto errors passato come parametro
 *
 * @param {object} errors oggetto che contiene i messaggi di errore per ogni input e che serve a poter fermare la funzione e mandare un codice di errore se la validazione fallisce
 * @param {string} key
 * @param {string} value valore della chiave dsa validare dell'oggetto input
 * @param {Array} isRequired array di caratteri richiesti per rendere la stringa valida
 * @returns
 */
function validateEmail(errors, key, value, isRequired = []) {
  //ciclo for per il controllo di ogni carattere
  for (let i = 0; i < isRequired.length; i++) {
    //controlla per ogni valore contenuto nell'oggetto rules, se i caratteri indicati alla chiave 'isRequired' sono presenti all'interno della chiave dell'oggetto input
    if (!value.includes(isRequired[i])) {
      // console.log('invio header email function');

      errors[key] = `la mail deve contenere ${isRequired[i]}`;
    }
  }

  return errors;
}

/**
 *
 * @param {object} errors oggetto che contiene i messaggi di errore per ogni input e che serve a poter fermare la funzione e mandare un codice di errore se la validazione fallisce
 * @param {string} key
 * @param {string} value valore della chiave daa validare dell'oggetto input
 * @param {Array} startsWith array di caratteri che devono essere presenti all'inizio della stringa da validare
 * @returns
 */
function validateAddress(errors, key, value, startsWith = []) {
  //split per controllare il la prima parola dell'indirizzo
  const address = value.toLowerCase().split(' '); //trasformo in array la stringa da validare in modo da poter accedere alla prima parola (index 0)

  //ciclo for per il controllo di ogni carattere
  for (let i = 0; i < startsWith.length; i++) {
    if (address[0] !== startsWith[0].toLowerCase() && address[0] !== startsWith[1].toLowerCase()) {
      errors[
        key
      ] = `la prima parola dell'indirizzo deve essere ${rules[key].startsWith[0]} o ${rules[key].startsWith[1]}`;
      break;
    }
  }
  return errors;
}

/**
 *
 * @param {object} errors oggetto che contiene i messaggi di errore per ogni input e che serve a poter fermare la funzione e mandare un codice di errore se la validazione fallisce
 * @param {string} key
 * @param {string} value valore della chiave daa validare dell'oggetto input
 * @param {Array} specialCharacters array di caratteri che possono essere presenti nella stringa da validare
 * @returns
 */
function validatePhone(errors, value, key) {
  //ciclo for per il controllo di ogni carattere
  for (let i = 0; i < value.length; i++) {
    //controllo che nel numero non sia presente il simbolo + ma che possa esserlo solo all'inizio
    if (value.includes('+') && value.indexOf('+') !== 0) {
      // console.log('invio header phone function');
      errors[key] = "il simbolo + puo' essere presente solo all' inizio del numero";
    }
  }
}

function validateInput(req, res, next) {
  console.log('start validate');

  const input = req.body;

  const errors = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
  };

  //controllo rispetto valori di lunghezza minimi e massimi
  for (const key in input) {
    // console.log(`lunghezza ${key}: ${input[key].length}`)

    const value = input[key];
    const rule = rules[key];

    //se non sono presenti regole per il campo ispezionato salta la parte di validazione e termina il loop
    if (!rule) continue;

    //controllo che i campi siano stringhe
    if (typeof value !== 'string') {
      // console.log('invio header string function');
      errors[key] = `${key} deve essere una stringa`;
    }

    //controllo lunghezza minima e massima per tutti i campi
    if (value.length > rule.max || value.length < rule.min) {
      // console.log('invio header length function');;

      errors[
        key
      ] = `la lunghezza di ${key} deve essere compresa tra ${rules[key].min} e ${rules[key].max} caratteri`;
    }

    //controllo mail
    if (key === 'email') {
      validateEmail(errors, key, value, rule.isRequired);
      // console.log(errors);
    }

    //controllo indirizzo
    if (key === 'address') {
      validateAddress(errors, key, value, rule.startsWith);
    }

    //controllo phone
    if (key === 'phone') {
      validatePhone(errors, value, key);
    }

    // Se ci sono errori, passa l'errore al middleware di gestione degli errori
    console.log(errors);
    if (Object.values(errors).some((err) => err.length > 0)) {
      return res.status(400).json({ message: errors[key] });
    }
  }

  next();
  console.log('parte insert per database');
}

module.exports = validateInput;
