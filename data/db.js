const sql = require('mysql2')

const connection = sql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})
connection.connect((err) => {
  if (err) throw new Error(err)
  console.log('Connected to database')
})
module.exports = connection
