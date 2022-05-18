require('dotenv').config()

const express = require('express');
const app = express();
const { execute, checkParameters, loadUsers, updateValue } = require('./routes.js')

app.use(express.json())

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.get('/api/teste', execute, loadUsers);
app.patch('/api/teste', checkParameters, updateValue);

app.listen(process.env.PORT, () => console.log(`Server running in http://localhost:${process.env.PORT}/`))
// app.listen(8545)
