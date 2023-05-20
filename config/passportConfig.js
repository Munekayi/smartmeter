const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const {connection} = require('../models/db');
const bcrypt = require('bcryptjs');
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
    connection.query(
      'SELECT * FROM users WHERE email = ?',
      [username],
      (err, results) => {
        if (err) return done(err);
        const user = results[0];

        // unknown user
        if (!user) return done(null, false, { message: 'Email is not registered' });

        // Verify password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) return done(err);

          // wrong password
          if (!isMatch) return done(null, false, { message: 'Wrong password.' });

          user.meterId = user.meterid;

          // authentication succeeded
          return done(null, user);
        });
      }
    );
  })
);