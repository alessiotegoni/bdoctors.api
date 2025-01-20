const sql = require('mysql2');

 const connection = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'boolean123@',
    database: 'bdoctors.sql'
})
connection.connect((err)=>{
    if(err) throw err
})

module.exports = connection;