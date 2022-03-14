const express = require('express');
const mysql = require('mysql2');
const { endianness } = require('os');
const PORT = process.env.PORT || 3001;
const app = express();

//  EXPRESS MIDDLEWARE
app.use(express.urlencoded({ extended: false}));
app.use(express.json());



//CONNECT TO DATABASE

const db = mysql.createConnection(
  {
    host: 'localhost',
    //Your MySQL username,
    user: 'root',
    //Your MySQL password
    password: 'Password',
    database: 'election'
  },
  console.log('Connected to the election database')
);

db.query(`SELECT * FROM candidates`, (err, rows) => {
  console.log(rows);
});

//DEFAULT RESPONSE FOR ANY OTHER REQUEST(NOT FOUND)

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});