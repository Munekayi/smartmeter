const { connection } = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

function User(email, password) {
  this.id = uuidv4();
  this.email = email;
  this.password = password;
  this.saltSecret = null;
  this.createdAt = new Date();
  this.updatedAt = new Date();
}

User.beforeSave = async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.saltSecret = salt;
  }
};
User.findAllByEmail = async function (email) {
  try {
    const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    return users;
  } catch (err) {
    throw err;
  }
};
//User.prototype.generateJwt = function () {
  //return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
   // expiresIn: process.env.JWT_EXP,
  //});
//};

module.exports = User;
