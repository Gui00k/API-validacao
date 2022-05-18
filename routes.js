const res = require('express/lib/response');
const { runInNewContext } = require('vm');
const { execute, searchUsers, searchUser, updateUser } = require('./database/db')

function erro(err) {
  console.log({
    "nome": err.name,
    "Mensagem": err.message,
    "Erro": err
  })
}

function checkParameters (req, res, next) {
  const toAddress = req.query['address'];
  const valor = req.query['valor'];
  isEmpity = JSON.stringify(req.body) === JSON.stringify({})

  if (isEmpity && (!toAddress || !valor)) {
    console.log('2')
    res.json({ "status": "failed" });
  }

  next();
}

async function checkUsers (data, valor) {
      const [ rows, fields ] = await searchUser(data);
      
      if (rows[0].user_balance > valor) {
        return 2
      }

      if (rows.length) {
        return 1
      }
      
      return 0
}

async function loadUsers (req, res) {
  let address = req.query.address
  let valor = req.query.valor || 0

  try {
    if(address || valor) {
      const [ rows, fields ] = await searchUser(address, valor);
      res.json(rows)
    }
  
    const [ rows, fields ] = await searchUsers();
    res.json(rows)

  } catch (error) {
    res.json({ "status": "failed", "erro": error })
  }
}

async function updateValue(req, res) {
  const dados = req.body;
  isEmpity = JSON.stringify(req.body) === JSON.stringify({})

  const toAddress = req.query['address'];
  const valor = req.query['valor'];

  try {
    if (!isEmpity){
      if(dados.length) {
        for(let i = 0; i < dados.length; i++) {
          const ifExists = await checkUsers(dados[i].address, dados[i].valor);
          
          if(ifExists == 1) {
            updateUser(dados[i].address, dados[i].valor).then(() => {
              res.json({ "status": "OK", "mensagem" : "O valor foi alterado com sucesso!" });
            })
          } else if(ifExists == 2) {
            res.json({ "status": "Failed", "mensagem" : "O valor informado é menor que o valor cadastrado!" })
          } else {
            res.json({ "status": "Failed", "mensagem" : "O address informado não foi encontrado!" })
          }
        }
      }
    } else {
      const ifExists = await checkUsers(toAddress, valor);
      
          console.log(ifExists)
          if(ifExists == 1) {
            updateUser(toAddress, valor).then(() => {
              res.json({ "status": "OK", "mensagem" : "O valor foi alterado com sucesso!" });
            })
          } else if(ifExists == 2) {
            res.json({ "status": "Failed", "mensagem" : "O valor informado é menor que o valor cadastrado!" })
          } else {
            res.json({ "status": "Failed", "mensagem" : "O address informado não foi encontrado!" })
          }
    }
    
  } catch (error) {
    console.log(error)
  }
}

module.exports = { execute, checkParameters, loadUsers, updateValue }