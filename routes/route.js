const express = require('express');
const router = express.Router();
const User = require('../models/users');
const _ = require('lodash');
const passport = require('passport');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/users')
const ctrlUser = require('../controllers/user.controller');
const jwtHelper = require('../config/jwtHelper');
const jwtConfig = require('../config/config.json').development;
const bcrypt = require('bcrypt');
// create a connection pool to reuse connections
const pool = mysql.createPool({
    host: 'risework.co.za',
    user: 'risework_db',
    password: '@Thisisfordesign2023',
    database: 'risework_db',
});



// retrieving users
// retrieving users
router.get('/users', (req, res, next) => {
  const sql = "SELECT * FROM users";
  pool.query(sql)
    .then(([result]) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({
        message: "An error occurred",
        error: err
      });
    });
});

// Check if voucher exists and insert purchase record
router.get('/vouchers/:voucherNumber', async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    // Verify and decode the token
    const decodedToken = jwt.verify(token, jwtConfig.JWT_SECRET);
    const meterId = decodedToken.meterId;

    const voucherNumber = req.params.voucherNumber;
    const sql = "SELECT * FROM vouchers WHERE voucherNumber = ?";
    const [result] = await pool.query(sql, [voucherNumber]);

    if (result.length > 0) {
      const refno = await generateRefNo();
      const amount = result[0].amount;

      const qwertysql = "INSERT INTO purchases (refno, amount, meterid) VALUES (?, ?, ?)";
      await pool.query(qwertysql, [refno, amount, meterId]);

      // Delete the voucher
      const deleteSql = "DELETE FROM vouchers WHERE voucherNumber = ?";
      await pool.query(deleteSql, [voucherNumber]);

      res.json({ 
        message: "Voucher found, purchase record inserted, and voucher deleted successfully", 
        refno: refno,
        amount: amount,
        meterid: meterId
      });
    } else {
      res.status(400).json({ message: "Invalid voucher number" });
    }
  } catch (err) {
    res.status(500).json({
      message: "An error occurred",
      error: err
    });
  }
});

  // generate reference no
  async function generateRefNo() {
    let meterId;
    const min = 100000;
    const max = 999999;
    do {
      // Generate a random 4-digit number
      Refno = Math.floor(Math.random() * (max - min + 1) + min);
  
      // Check if the generated meterId already exists in the database
      const [results] = await pool.query('SELECT * FROM sensordata WHERE meterid = ?', [Refno]);
      if (results.length === 0) {
        // Unique meterId found, exit the loop
        break;
      }
    } while (true);
  
    return Refno;
  }

  // generate meterid
  async function generateMeterId() {
    let meterId;
    const min = 1000;
    const max = 9999;
    do {
      // Generate a random 4-digit number
      meterId = Math.floor(Math.random() * (max - min + 1) + min);
  
      // Check if the generated meterId already exists in the database
      const [results] = await pool.query('SELECT * FROM sensordata WHERE meterid = ?', [meterId]);
      if (results.length === 0) {
        // Unique meterId found, exit the loop
        break;
      }
    } while (true);
  
    return meterId;
  }
  
  // add user
  router.post('/user', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
  
    try {
      // Generate a 4-digit meter ID
      const meterId = await generateMeterId();
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Insert the user record
      const [userResult] = await pool.query('INSERT INTO users (email, password, meterid) VALUES (?, ?, ?)', [email, hashedPassword, meterId]);
      if (userResult.affectedRows > 0) {
        // Insert the meter ID into the sensordata table
        const [sensorResult] = await pool.query('INSERT INTO sensordata (meterid, amountowing, volumeused, flowrate, frequency) VALUES (?, 0, 0, 0, 0)', [meterId]);
        if (sensorResult.affectedRows > 0) {
          res.status(201).json({
            message: 'User registered successfully',
            meterId: meterId,
          });
        } else {
          throw new Error('An error occurred');
        }
      } else {
        throw new Error('An error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred' });
    }
  });
 
//delete user
router.delete('/user/:id', (req, res, next)=>{
    const id = req.params.id;
    const query = "DELETE FROM users WHERE id = ?";
    pool.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).json({
                message: "An error occurred",
                error: err
            });
        }
        res.json(result);
    });
});

// Get Sensor values by meterid
router.get('/sensordata/:meterid', async (req, res, next) => {
  try{
        // Extract the token from the Authorization header
        const token = req.headers.authorization.split(' ')[1];

        // Verify and decode the token
        const decodedToken = jwt.verify(token, jwtConfig.JWT_SECRET);
    
        // Get the email from the decoded token
        const email = decodedToken.email;
        const meterId = decodedToken.meterId;

    const query = "SELECT * FROM sensordata WHERE meterid = ?";
    

    

    const [rows, fields] = await pool.execute(query, [meterId]);
   // pool.release();

    const dataRows = rows.map(row => ({
      meterid: row.meterid,
      amountowing: row.amountowing,
      volumeused: row.volumeused,
      flowrate: row.flowrate,
      frequency: row.frequency
    }));

    res.json(dataRows);
  }catch (err) {
    next(err);
  }
  });
    
// Update Sensordata
// Update sensordata table
router.put('/sensordata/:meterid', async (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization.split(' ')[1];

  // Verify and decode the token
  const decodedToken = jwt.verify(token, jwtConfig.JWT_SECRET);
  const meterId = decodedToken.meterId;

  try {
    // Retrieve the latest purchase amount from the purchases table
    const purchaseSql = "SELECT amount FROM purchases WHERE meterid = ? ORDER BY id DESC LIMIT 1";
    const [purchaseResult] = await pool.query(purchaseSql, [meterId]);

    if (purchaseResult.length === 0) {
      return res.status(404).json({ message: "No purchase record found" });
    }

    const amount = purchaseResult[0].amount;

    // Subtract the amount from the sensordata table
    const updateSql = "UPDATE sensordata SET amountowing = amountowing - ? WHERE meterid = ?";
    await pool.query(updateSql, [amount, meterId]);

    res.json({ message: "Sensordata updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error
    });
  }
});



  // add Card
router.post('/card', (req, res, next) => {
    const email = req.body.email;
    const cardNumber = req.body.cardNumber;
    const cardHolderName = req.body.cardHolderName;
    const expirationDate = req.body.expirationDate;
    const cvv = req.body.cvv;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ message: 'An error occurred' });
        }

        const sql = 'INSERT INTO cards (email, cardnumber, cardholder, expdate, cvv) VALUES (?, ?, ?, ?, ?)';
        const values = [email, cardNumber, cardHolderName, expirationDate, cvv];

        connection.query(sql, values, (err, result) => {
            connection.release(); // release connection back to pool

            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ message: 'An error occurred' });
            }

            if (result.affectedRows > 0) {
                console.log('Number of rows affected:', result.affectedRows);
                res.status(201).json({
                    message: 'New Card added successfully',
                    user: { email},
                });
            } else {
                return res.status(500).json({ message: 'An error occurred' });
            }
        });
    });
});

//generate token
function generateJwtToken(user) {
  const payload = {
    meterId: user.meterId,
    email: user.email,
    
    // Add any other desired user properties to the payload
  };
  console.log('Email:', payload.email);
  console.log('Meter ID: ',payload.meterId);
  const token = jwt.sign(payload, jwtConfig.JWT_SECRET, { expiresIn: '1h' }); // Replace 'secret' with your JWT secret
  return token;
}

//authenticate user
router.post('/authenticate', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(400).json(err);

    if (user) {
            // Assuming you retrieve the meterId from the user data
            //const meterId = user.username;

            // Set the meterId property in the user object
            //user.meterId = meterId;

      const token = generateJwtToken(user);
      return res.status(200).json({ token});
    }

    return res.status(404).json(info);
  })(req, res);
});

//user profile
router.get('/userprofile', (req, res, next) => {
  
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify and decode the token
    const decodedToken = jwt.verify(token, jwtConfig.JWT_SECRET);

    // Get the email from the decoded token
    const email = decodedToken.email;
    const meterId = decodedToken.meterId;
console.log('Email:', email);

  //const email = req.email;

    // Check if email exists

    const user = {
    email,
    meterId
    };
    // Include email and meterId in the user object
    //user.email = email;
    //user.meterId = meterId;
    //console.log('User profile:', user);
    // Include meterId in the user object
    // user.meterId = meterId;

    res.status(200).json({user: _.pick(user, ['email', 'meterId' ]) });


  } catch (err) {
    next(err);
  }
});


router.post('/cards', ctrlUser.addCard);
router.get('/card', async (req,res,next) => {
  try{
    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify and decode the token
    const decodedToken = jwt.verify(token, jwtConfig.JWT_SECRET);

    // Get the email from the decoded token
    const email = decodedToken.email;

const query = "SELECT * FROM cards WHERE email = ?";




const [rows, fields] = await pool.execute(query, [email]);
// pool.release();

const dataRows = rows.map(row => ({
  cardnumber: row.cardnumber,
  cardholder: row.cardholder,
  expdate: row.expdate,
  cvv: row.cvv
}));

res.json(dataRows);
}catch (err) {
next(err);
}
});  


module.exports = router;
