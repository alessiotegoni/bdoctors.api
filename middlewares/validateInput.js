//middleware per la validazione dei dati inviati alla body request
//creare un oggetto rules con le regole di ogni input da controllare

const inputValues = {
  firstName: 'Pipp',
  lastName: 'Pppp',
  email: 'abc@.',
  phone: '1234567890',
  address: 'Piazza Roma, 1',
};

const rules = {
  firstName: {
    min: 3,
    max: 50,
  },
  lastName: {
    min: 3,
    max: 50,
  },
  email: {
    min: 3,
    max: 50,
    isRequired: ['@', '.'],
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
 *
 * @param {string} key chiave dell'oggetto che si vuole validare
 * @param {string} value valore della chiave
 * @param {array} isRequired  array di stringhe che devono essere inclusi in value
 * @param {object} errors  oggetto contenente le keys con in rispettivi errori
 * @returns
 */
function validateEmail(key, value, isRequired = [], errors = {}) {
  //ciclo for per il controllo di ogni carattere
  for (let i = 0; i < isRequired.length; i++) {
    //controlla per ogni valore contenuto nell'oggetto rules, se i caratteri indicati alla chiave 'isRequired' sono presenti all'interno della chiave dell'oggetto input
    if (!value.includes(isRequired[i])) {
      errors[key].push(`${key} deve contenere ${rules[key].isRequired[i]}`);
      // break;
    }
  }

  return;
}

/**
 *
 * @param {string} key la chiave che viene presa in considerazione per il controllo
 * @param {string} value valore della chiave presa in considerazione (per il controllo di una parola all'inizio della stringa value eseguire lo split come in questo caso)
 * @param {string} startsWith carattere o parola
 * @param {object} errors oggetto che contiene le keys con i rispettivi messaggi di errore
 */

function validateAddress(key, value, startsWith = [], errors = {}) {
  //split per controllare il la prima parola dell'indirizzo
  const address = value.split(' '); //trasformo in array la stringa da validare in modo da poter accedere alla prima parola (index 0)

  //ciclo for per il controllo di ogni carattere
  for (let i = 0; i < startsWith.length; i++) {
    if (address[0] !== startsWith[0] && address[0] !== startsWith[1]) {
      errors[key].push(
        `${key} deve iniziare con ${rules[key].startsWith[0]} o ${rules[key].startsWith[1]}`
      );
      break;
    }
  }
}

/**
 *
 * @param {string} key la chiave che viene presa in considerazione per il controllo
 * @param {string} value valore della chiave presa in considerazione
 * @param {array} startsWith array di stringhe
 * @param {object} errors oggetto che contiene le keys con i rispettivi messaggi di errore
 */
function validatePhone(key, value, startsWith = [], errors = {}) {
  //ciclo for per il controllo di ogni carattere
  for (let i = 0; i < value.length; i++) {
    //controllo che nel numero non sia presente il simbolo + ma che possa esserlo solo all'inizio
    if (value.includes('+') && value.indexOf('+') !== 0) {
      // console.log(errors[key]);
      errors[key].push(`il simbolo '+' può essere inserito solo all'inizio`);
      break;
    }
  }
}

function validateInput(input = {}, rules = {}) {
  console.log('start validate');

  //funzione per la validazione
  const errors = {
    firstName: [],
    lastName: [],
    email: [],
    phone: [],
    address: [],
  };

  //controllo rispetto valori di lunghezza minimi e massimi
  for (const key in input) {
    // console.log(`lunghezza ${key}: ${input[key].length}`)

    const value = input[key];

    //controllo lunghezza minima e massima per tutti i campi
    if (value.length > rules[key].max || value.length < rules[key].min) {
      errors[key].push(
        `la lunghezza di ${key} deve essere compresa tra ${rules[key].min} e ${rules[key].max} caratteri`
      );
    }

    //controllo mail
    if (key === 'email') {
      validateEmail(key, value, rules[key].isRequired, errors);
    }

    //controllo indirizzo
    if (key === 'address') {
      validateAddress(key, value, rules[key].startsWith, errors);
    }

    //controllo phone
    if (key === 'phone') {
      validatePhone(key, value, rules[key].startsWith, errors);
    }
  }

  return errors;
}

console.log(validateInput(inputValues, rules));
