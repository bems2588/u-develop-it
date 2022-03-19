const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');


// WHY DOES THIS HAPPEN? 
// const { endianness } = require('os');

const PORT = process.env.PORT || 3001;
const app = express();

//  EXPRESS MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Use apiRoutes

app.use('/api', apiRoutes);


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