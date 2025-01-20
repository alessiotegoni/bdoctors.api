//express base config
const dotenv = require('dotenv')
const express = require('express')
dotenv.config();
const doctorRouter = require('./Routes/doctorsRouter');
const app = express()
const PORT = process.env.PORT


//middlewares
const errorsHandler = require('./middlewares/errorsHandler')
const notFound = require('./middlewares/notFound')

//body parser
app.use(express.json())


//routes
app.use('/doctors',doctorRouter);

app.get('/doctors', (_, res) => {
  // console.log('doctors default')
  res.json({ message: 'doctors default' })
  // throw new Error('error') //errorHandler test
})

app.use('/', errorsHandler)
app.use('/', notFound)

app.listen(PORT, () => console.log(`✅ Server running on PORT: ${PORT}`))
