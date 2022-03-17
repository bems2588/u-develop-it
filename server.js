const express = require('express');
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

// WHY DOES THIS HAPPEN? 
// const { endianness } = require('os');

const PORT = process.env.PORT || 3001;
const app = express();

//  EXPRESS MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
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
});

//GET ALL CANDIDATES AND THEIR PARTY AFFILIATION

app.get('/api/candidates', (req, res) => {
  const sql = `SELECT candidates.*, parties.name
  AS party_name FROM candidates LEFT JOIN parties ON candidates.party_id = parties.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

//GET A SINGLE CANDIDATE WITH PARTY AFFILIATION

app.get('/api/candidate/:id', (req, res) => {
  const sql = `SELECT candidates.*, parties.name
  AS party_name FROM candidates LEFT JOIN parties
  ON candidates.party_id = parties.id WHERE candidates.id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

//CREATE A CANDIDATE

app.post('/api/candidate', ({ body }, res) => {
  const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql =  `INSERT INTO candidates (first_name, last_name,industry_connected, party_id) VALUES (?,?,?,?)`;
  const params = [body.first_name, body.last_name,  body.industry_connected, body.party_id]

  db.query(sql, params, (err, result) => {
    if(err) {
      res.status(400).json({ error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: body,
      changes: result.affectedRows
    });
  });
});


//UPDATE A CANDIDATES PARTY

app.put('/api/candidate/:id', (req, res) => {

  const errors = inputCheck(req.body, 'party_id');

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `UPDATE candidates SET party_id = ? 
  WHERE id = ?`;

  const params = [req.body.party_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      //check if a record was found
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

//DELETE A CANDIDATE

app.delete('/api/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});


//GET ALL PARTIES

app.get('/api/parties', (req, res) => {
  const sql = `SELECT * FROM parties`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

//GET A SINGLE PARTY

app.get('/api/party/:id', (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
  const  params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// DELETE A PARTY

app.delete('/api/party/:id', (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`;
  const params = [req.params.id];
  
  db.query(sql, params, (err, result) => {
    if(err) {
      res.status(400).json({ error: res.message });
      //checks if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: 'Party not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});


//DEFAULT RESPONSE FOR ANY OTHER REQUEST(NOT FOUND)

app.use((req, res) => {
  res.status(404).end();
});

//START SERVER AFTER DB CONNECTION
db.connect(err => {
  if (err) throw err;
  console.log('Database connected');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});