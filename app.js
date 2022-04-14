require('dotenv').config()
const mysql = require('mysql2');

const express = require('express');
const app = express();

const pool = mysql.createPool({
  host: process.env.db_host,
  user: process.env.db_user,
  database: process.env.db_name,
  password: process.env.db_pass,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/', function (req, res) {
  res.send('Hello World');
});


app.get('/api/teste', function (req, res) {
  console.log(req.query)
  const toAddress = req.query['address'];
  const valor = req.query['valor'];
 
  if (!toAddress || !valor) {
    res.json({ "status": "failed" });
    return;
  }

});

  pool.execute(
    'SELECT * FROM tb_users WHERE user_address = ? AND user_balance >= ?',
    [toAddress, valor],
    function (err, results, fields) {
     //console.log(results);
      //console.log(fields);
    }
  );

//app.listen(process.env.PORT)
app.listen(8545)
