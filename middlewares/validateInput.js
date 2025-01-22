//middleware per la validazione dei dati inviati alla body request
//creare un oggetto rules con le regole di ogni input da controllare

const inputValues = {
  firstName: 'Pi',
  lastName: 'P',
  email: 'ab@.c',
  phone: '1234+567890',
  address: 'Via Roma, 1',
}

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
    specialCharacters: ['@', '.'],
  },
  phone: {
    min: 3,
    max: 20,
    //controllo che solo il primo carattere sia un +
    startsWith: ['+'],
    specialCharacters: ['+'],
  },
  address: {
    min: 3,
    max: 50,
    startsWith: ['Via', 'Piazza'],
  },
}

function validateInput(input = {}, rules = {}) {
  console.log('start validate')

  //funzione per la validazione
  const errors = []

  //controllo rispetto valori di lunghezza minimi e massimi
  for (const key in input) {
    if (input[key].length > rules[key].max || input[key].length < rules[key].min) {
      errors.push(`${key} must be between ${rules[key].min} and ${rules[key].max} characters`)
    }
  }

  //controllo rispetto caratteri iniziali
  for (const key in input) {
    //controlla se la chiave corrisponde all'indirizzo	allora controlla se l'indirizzo inizia con Via o piazza
    if (rules[key] === 'address' && rules[key].startsWith) {
      //ciclo for per il controllo di ogni carattere
      for (let i = 0; i < rules[key].startsWith.length; i++) {
        if (
          input[key] !== rules.address.startsWith[0] &&
          input[key] !== rules.address.startsWith[1]
        ) {
          errors.push(
            `${key} must start with ${rules[key].startsWith[0]} or ${rules[key].startsWith[1]}`
          )
        }
      }
    }

    //? controllo sul numero di telefono da sistemare

    if (rules[key] === 'phone' && rules[key].startsWith) {
      //ciclo for per il controllo di ogni carattere
      for (let i = 0; i < rules[key].startsWith.length; i++) {
        if (input[key][i] === rules[key].startsWith[0]) {
          errors.push(`il simbolo + è permesso solo all'inizio`)
        }
      }
    }
  }
  return errors
}

console.log(validateInput(inputValues, rules))
