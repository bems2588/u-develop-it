const express = require('express');
const { endianness } = require('os');
const PORT = process.env.PORT || 3001;
const app = express();

//  EXPRESS MIDDLEWARE
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//DEFAULT RESPONSE FOR ANY OTHER REQUEST(NOT FOUND)

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});