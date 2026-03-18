const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');

module.exports = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
};