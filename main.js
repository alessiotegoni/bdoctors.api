//express base config
const dotenv = require('dotenv')
const express = require('express')
const doctorRouter = require('./Routes/doctorRoutes')

dotenv.config()

const app = express()
const PORT = process.env.PORT

//middlewares
const errorsHandler = require('./middlewares/errorsHandler')
const notFound = require('./middlewares/notFound')

//body parser
app.use(express.json())

//routes
app.use('/doctors', doctorRouter)

app.use([notFound, errorsHandler])

app.listen(PORT, () => console.log(`✅ Server running on PORT: ${PORT}`))
