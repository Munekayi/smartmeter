const { connection } = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

function cardData(email, password) {
  
  this.email = email;
  this.cardNumber=cardNumber,
  this.cardHolderName=cardHolderName,
  this.expirationDate=expirationDate,
  this.cvv=cvv
}


module.exports = cardData;