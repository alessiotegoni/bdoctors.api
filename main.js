//express base config
const express = require('express')
const app = express()
const PORT = process.env.PORT

//middlewares
const errorsHandler = require('./middlewares/errorsHandler')
const notFound = require('./middlewares/notFound')

//body parser
app.use(express.json())

//routes
app.get('/', (_, res) => {
  res.json({ message: 'Server running' })
})

app.get('/doctors', (_, res) => {
  // console.log('doctors default')
  res.json({ message: 'doctors default' })
  // throw new Error('error') //errorHandler test
})

app.use('/', errorsHandler)
app.use('/', notFound)

app.listen(PORT, () => console.log(`✅ Server running on PORT: ${PORT}`))
