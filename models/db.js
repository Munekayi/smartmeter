const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'risework.co.za',
  user: 'risework_db',
  password: '@Thisisfordesign2023',
  database: 'risework_db',
});
// Create a connection
/*const connection = mysql.createConnection({
  host: 'munekayi-smart-meter.000webhostapp.com',
  user: 'id20711199_antoine',
  password: '@Thisisfordesign2023',
  database: 'designwebdb'
});
*/
// Connect to the database
connection.connect((error) => {
  if (error) {
    console.error('Unable to connect to the database:', error);
  } else {
    console.log('Connection has been established successfully.');

    // Import and use the "./users" module (assuming it exports a function)
    //require('./users')(connection);

    // Use the users module as needed
    // For example, you can call a function like users.getAllUsers()
  }
});
// Export the connection
module.exports.connection = connection;
