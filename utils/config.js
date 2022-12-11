const dotenv = require("dotenv");
dotenv.config();
// require("dotenv").config()

const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  PORT,
  JWT_SECRET,
};
