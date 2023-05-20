const {User} = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const passport = require('passport');
const jwtConfig = require('../config/config.json').development;
const connection = require('../models/db');
const mysql = require('mysql2');
const encryptionUtil = require('../config/encryptionUtil');
// create a connection pool to reuse connections
const pool = mysql.createPool({
  host: 'localhost',
  user: 'antoine',
  password: 'password',
  database: 'designwebdb',
});

async function generateMeterId() {
  let meterId;
  const min = 1000;
  const max = 9999;
  do {
    // Generate a random 4-digit number
    meterId = Math.floor(Math.random() * (max - min + 1) + min);

    // Check if the generated meterId already exists in the database
    const [results] = await pool.promise().query('SELECT * FROM sensordata WHERE meterid = ?', [meterId]);
    if (results.length === 0) {
      // Unique meterId found, exit the loop
      break;
    }
  } while (true);

  return meterId;
}

module.exports.authenticate = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(400).json(err);

    if (user) {
      const token = generateJwtToken(user);
      return res.status(200).json({ token});
    }

    return res.status(404).json(info);
  })(req, res);
};

// Function to generate JWT token
function generateJwtToken(user) {
  const payload = {
    userId: user.meterId,
    email: user.email,
    
    // Add any other desired user properties to the payload
  };
  console.log('Email:', payload.email);
  const token = jwt.sign(payload, jwtConfig.JWT_SECRET, { expiresIn: '1h' }); // Replace 'secret' with your JWT secret
  return token;
}
module.exports.userProfile = (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify and decode the token
    const decodedToken = jwt.verify(token, jwtConfig.JWT_SECRET);

    // Get the email from the decoded token
    const email = decodedToken.email;


    const meterid = req.meterid // Assuming the email is stored in req.body.email

    // Check if email exists
    if (!email) {
      console.log('Email:', email);
      return res.status(400).json({ status: false, message: 'Email is required.' });
    }

    // Get the user record from the database
    pool.promise()
      .execute('SELECT * FROM users WHERE email = ?', [email])
      .then(([users]) => {
        if (users.length === 0) {
          return res.status(404).json({ status: false, message: 'User record not found.' });
        }

        const user = users[0];

        // Get the corresponding meterId from the sensordata table
        return pool.promise().execute('SELECT meterid FROM sensordata WHERE meterid = ?', [user.meterid || null])
          .then(([sensordata]) => {
            if (sensordata.length === 0) {
              return res.status(404).json({ status: false, message: 'Meter ID not found in sensordata table.' });
            }

            const meterId = sensordata[0].meterid;

            // Include meterId in the user object
            //user.meterId = meterId;

            res.status(200).json({ status: true, user });
          });
      })
      .catch(err => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
};


module.exports.updateUser = async (req, res, next) => {
  const userEmail = req.params.email;
  const { password } = req.body;

  try {
    // Check if the user exists
    const [users] = await connection.promise().query('SELECT * FROM users WHERE email = ?', [userEmail]);
    if (users.length === 0) {
      return res.status(404).json({ status: false, message: 'User not found.' });
    }

    // Update the user record
    await connection.promise().query('UPDATE users SET password = ? WHERE email = ?', [password, userEmail]);

    res.status(200).json({ status: true, message: 'User updated successfully.' });
  } catch (err) {
    next(err);
  }
};


module.exports.addCard = async (req, res, next) => {
  const userEmail = req.params.email;
  const { cardNumber, cardHolderName, expirationDate, cvv } = req.body;

  try {
    // Check if the user exists
    const [users] = await connection.promise().query('SELECT * FROM users WHERE email = ?', [userEmail]);
    if (users.length === 0) {
      return res.status(404).json({ status: false, message: 'User not found.' });
    }

    // Encrypt sensitive card details before storing in the database
    const encryptedCardNumber = encryptionUtil.encrypt(cardNumber);
    const encryptedCardHolderName = encryptionUtil.encrypt(cardHolderName);
    const encryptedExpirationDate = encryptionUtil.encrypt(expirationDate);
    const encryptedCvv = encryptionUtil.encrypt(cvv);

    // Store the encrypted card details in the database
    await connection
      .promise()
      .query('INSERT INTO cards (email, card_number, card_holder_name, expiration_date, cvv) VALUES (?, ?, ?, ?, ?)', [
        users[0].id,
        encryptedCardNumber,
        encryptedCardHolderName,
        encryptedExpirationDate,
        encryptedCvv,
      ]);

    // Redirect the user to a confirmation page or other destination
    res.redirect('/confirmation');
  } catch (err) {
    next(err);
  }
};