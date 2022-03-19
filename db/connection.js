const mysql = require('mysql2');


//CONNECT TO DATABASE

const db = mysql.createConnection(
  {
    host: 'localhost',
    //Your MySQL username,
    user: 'root',
    //Your MySQL password
    password: 'Password',
    database: 'election'
});

module.exports = db;