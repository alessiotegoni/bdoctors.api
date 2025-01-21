//express base config
const express = require('express')
const doctorRouter = require('./Routes/doctorsRouter')
const app = express()
const PORT = process.env.PORT

//middlewares
const errorsHandler = require('./middlewares/errorsHandler')
const notFound = require('./middlewares/notFound')

//body parser
app.use(express.json())

//routes
app.use('/doctors', doctorRouter)

app.use(errorsHandler)
app.use(notFound)

app.listen(PORT, () => console.log(`✅ Server running on PORT: ${PORT}`))
