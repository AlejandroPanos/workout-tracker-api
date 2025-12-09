/* Create imports */
const jwt = require("jsonwebtoken");

/* Create helpers */
const maxAge = 30 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN, { expiresIn: maxAge });
};

module.exports = { maxAge, createToken };
