//middleware per la validazione dei dati inviati alla body request
//creare un oggetto rules con le regole di ogni input da controllare

const inputValues = {
  firstName: 'Pipp',
  lastName: 'Pipp',
  email: 'abc@.',
  phone: '1234567890',
  address: 'Via Roma, 1',
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

function validateInput(input = {}, rules = {}) {
  console.log('start validate');

  //funzione per la validazione
  const errors = [];

  //controllo rispetto valori di lunghezza minimi e massimi
  for (const key in input) {
    // console.log(`lunghezza ${key}: ${input[key].length}`)

    if (input[key].length > rules[key].max || input[key].length < rules[key].min) {
      errors.push(
        `la lunghezza di ${key} deve essere compresa tra ${rules[key].min} e ${rules[key].max} caratteri`
      );
    }

    //controllo mail
    if (key === 'email') {
      //ciclo for per il controllo di ogni carattere
      //controlla per ogni valore contenuto nell'oggetto rules, se i caratteri indicati alla chiave 'isRequired' sono presenti all'interno della chiave dell'oggetto input
      for (let i = 0; i < rules[key].isRequired.length; i++) {
        if (!input[key].includes(rules[key].isRequired[i])) {
          errors.push(`${key} deve contenere ${rules[key].isRequired[i]}`);
          break;
        }
      }
    }

    //controllo indirizzo
    if (key === 'address') {
      //split per controllare il la prima parola dell'indirizzo
      const address = input[key].split(' ');
      //ciclo for per il controllo di ogni carattere
      for (let i = 0; i < rules[key].startsWith.length; i++) {
        if (address[0] !== rules[key].startsWith[0] && address[0] !== rules[key].startsWith[1]) {
          errors.push(
            `l'indirizzo deve iniziare con ${rules[key].startsWith[0]} o ${rules[key].startsWith[1]}`
          );
          break;
        }
      }
    }

    //controllo phone
    if (key === 'phone') {
      //ciclo for per il controllo di ogni carattere
      for (let i = 0; i < input[key].length; i++) {
        //controllo che nel numero non sia presente il simbolo + ma che possa esserlo solo all'inizio
        if (input[key].includes('+') && input[key].indexOf('+') !== 0) {
          errors.push(`il simbolo + è permesso solo all'inizio`);
          break;
        }
      }
    }
  }

  return errors;
}

console.log(validateInput(inputValues, rules));
