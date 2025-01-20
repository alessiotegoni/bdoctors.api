const express = require('express')

const app = express()

const PORT = 5000

app.use(express.json());

app.use('/doctors', () => {
  console.log('rotta default')
})

app.listen(PORT, () => console.log(`✅ Server running on PORT: ${PORT}`))
