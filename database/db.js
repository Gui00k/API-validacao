const mysql = require('mysql2');
const pool =  mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = pool.promise();

async function execute(req, res, next) {
  
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tb_users (
      id INT PRIMARY KEY AUTO_INCREMENT, 
      user_address CHAR(49), 
      user_balance FLOAT DEFAULT(0))
  `)

  next()
}

async function searchUsers() {
  const sql = `
      SELECT * FROM tb_users
  `;

  const [ rows, fields ] = await db.query(sql);

  return [ rows, fields ];
}

async function searchUser(address, valor) {
  const sql = `
      SELECT * FROM tb_users
      WHERE user_address = ?
  `;
  
  const [ rows, fields ] = await db.query(sql, [address])
  console.log(rows)
  return [ rows, fields ];
}



async function updateUser(address, valor) {
  const sql = `
    UPDATE tb_users
    SET user_balance = ?
    WHERE user_address = ?
  `
  
  await db.execute(sql, [valor, address]).catch(e => { 
    throw {
    "nome": "UPDATE_ERR",
    "Mensagem": "",
    "Erro": e
    }
  })
}

module.exports = { execute, searchUsers, searchUser, updateUser }