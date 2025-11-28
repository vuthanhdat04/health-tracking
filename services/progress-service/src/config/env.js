// src/config/env.js
const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 4004,
  dbUri: process.env.DB_URI,
};

module.exports = env;
