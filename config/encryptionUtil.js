const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = '@Thisisfordesign2023'; // Replace with your own encryption key
const iv = crypto.randomBytes(16); // Generate a random initialization vector

// Encrypt data using AES-256-CBC algorithm
module.exports.encrypt = (data) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  return `${iv.toString('hex')}:${encryptedData}`;
};

// Decrypt data using AES-256-CBC algorithm
module.exports.decrypt = (encryptedData) => {
  const [ivHex, data] = encryptedData.split(':');
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
  let decryptedData = decipher.update(data, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
};
