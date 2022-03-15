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

// db.query(`SELECT * FROM candidates`, (err, rows) => {
//   console.log(rows);
// });

//GET A SINGLE CANDIDATE
// db.query(`SELECT * FROM candidates WHERE id = 1`,(err, row) => {
//   if(err) {
//     console.log(err);
//   }
//   console.log(row);
// });

//DELETE A CANDIDATE

// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//   if(err) {
//     console.log(err);
//   }
//   console.log(result);
// });

//CREATE A CANDIDATE

const sql = ` INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES(?, ?, ?, ?)`;
const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err, result) => {
  if(err) {
    console.log(err);
  }
  console.log(result);
});

//DEFAULT RESPONSE FOR ANY OTHER REQUEST(NOT FOUND)

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});