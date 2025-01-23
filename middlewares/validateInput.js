//middleware per la validazione dei dati inviati alla body request
//creare un oggetto rules con le regole di ogni input da controllare

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

function validateEmail(errors, key, value, isRequired = []) {
  //ciclo for per il controllo di ogni carattere
  for (let i = 0; i < isRequired.length; i++) {
    //controlla per ogni valore contenuto nell'oggetto rules, se i caratteri indicati alla chiave 'isRequired' sono presenti all'interno della chiave dell'oggetto input
    if (!value.includes(isRequired[i])) {
      // console.log('invio header email function');
      // errors[key].push(`la mail deve contenere ${isRequired[i]}`);

      errors[key] = `la mail deve contenere ${isRequired[i]}`;
    }
  }

  return errors;
}

function validateAddress(errors, key, value, startsWith = []) {
  //split per controllare il la prima parola dell'indirizzo
  const address = value.toLowerCase().split(' '); //trasformo in array la stringa da validare in modo da poter accedere alla prima parola (index 0)

  //ciclo for per il controllo di ogni carattere
  for (let i = 0; i < startsWith.length; i++) {
    if (address[0] !== startsWith[0].toLowerCase() && address[0] !== startsWith[1].toLowerCase()) {
      // console.log('invio header address function');
      // errors[key].push(
      //   `la prima parola dell'indirizzo deve essere ${rules[key].startsWith[0]} o ${rules[key].startsWith[1]}`
      // );

      errors[
        key
      ] = `la prima parola dell'indirizzo deve essere ${rules[key].startsWith[0]} o ${rules[key].startsWith[1]}`;
      break;
    }
  }
  return errors;
}

function validatePhone(errors, value) {
  //ciclo for per il controllo di ogni carattere
  for (let i = 0; i < value.length; i++) {
    //controllo che nel numero non sia presente il simbolo + ma che possa esserlo solo all'inizio
    if (value.includes('+') && value.indexOf('+') !== 0) {
      // console.log('invio header phone function');
      // errors[key].push("il simbolo + puo' essere presente solo all' inizio del numero");
      errors[key] = "il simbolo + puo' essere presente solo all' inizio del numero";
    }
  }
}

function validateInput(req, res, next) {
  console.log('start validate');

  const input = req.body;

  const errors = {
    firstName: '',
    lastName: '',
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
      // errors[key].push(`${key} deve essere una stringa`);
      errors[key] = `${key} deve essere una stringa`;
    }

    //controllo lunghezza minima e massima per tutti i campi
    if (value.length > rule.max || value.length < rule.min) {
      // console.log('invio header length function');
      // errors[key].push(
      //   `${key} deve essere compreso tra ${rules[key].min} e ${rules[key].max} caratteri`
      // );

      errors[
        key
      ] = `la lunghezza di ${key} deve essere compresa tra ${rules[key].min} e ${rules[key].max} caratteri`;
      // return res.status(400).json({
      //   message: `la lunghezza di ${key} deve essere compresa tra ${rules[key].min} e ${rules[key].max} caratteri`,
      // });
    }

    //controllo mail
    if (key === 'email') {
      validateEmail(errors, key, value, rule.isRequired);
      // result.length > 0 && errors[key].push(result);
      // console.log(errors);
    }

    //controllo indirizzo
    if (key === 'address') {
      validateAddress(errors, key, value, rule.startsWith);
    }

    //controllo phone
    if (key === 'phone') {
      validatePhone(errors, value);
    }

    // Se ci sono errori, passa l'errore al middleware di gestione degli errori
    if (Object.values(errors).some((err) => err.length > 0)) {
      return next({ status: 400, message: errors[key], errors });
    }
  }

  next();
  console.log('parte insert per database');
}

module.exports = validateInput;
