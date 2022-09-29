const {
  MongoClient,
  ObjectId
} = require('mongodb')
const {
  hashPassword
} = require('../utils/bcryptUtils')
require('dotenv').config();

// Should be moved to ENV variable
const connectionUrl = "mongodb+srv://mongo:mongo@cluster0.qzf0u01.mongodb.net/?retryWrites=true&w=majority";

const dbName = 'nyheter'
let db

const initAcc = () =>
  MongoClient.connect(connectionUrl, {
    useNewUrlParser: true
  }).then((client) => {
    db = client.db(dbName)
  })

const getAccountByEmail = async (account) => {
  const collection = db.collection('account')
  let res = await collection.find({
    email: account.email
  }).toArray()
  console.log(res)
  return res;
}

const createAccount = async (account) => {

  // FIXA SÅ DEN KOLLAR SÅ DET INTE FINNS ETT ACCOUNT MED SAMMA MAIL
  const collection = db.collection('account')
  account.role = "user";
  account.stillPaying = false;
  account.subscriptionEnd = "";
  account.password = await hashPassword(account.password);
  console.log(account);
  return await collection.insertOne(account);
}


/// kolla så den funkar som den ska
const updateAccount = async (account) => {
  const collection = db.collection('account')
  let updatedAccount = {};
  if (account.name) updatedAccount.name = account.name;
  if (account.email) updatedAccount.email = account.email;
  if (account.preference) updatedAccount.preference = account.preference;
  if (account.role) updatedAccount.role = account.role;
  if (account.stillPaying) updatedAccount.stillPaying = account.stillPaying;
  if (account.subscriptionEnd) updatedAccount.subscriptionEnd = account.subscriptionEnd;
  if (account.token) updatedAccount.token = account.token;

  console.log(updatedAccount)
  console.log(account.id)
  updatedAccount = {
    $set: updatedAccount
  }
  let accountId = new ObjectId(account.id)
  const filter = {
    _id: accountId
  }
  const result = await collection.updateOne(filter, updatedAccount);
  return result;
}


module.exports = {
  initAcc,
  getAccountByEmail,
  createAccount,
  updateAccount
}
