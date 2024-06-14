const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/default.json');

module.exports = (user) => {
  return jwt.sign({ user }, jwtSecret, {
    expiresIn: 3600
  });
};

