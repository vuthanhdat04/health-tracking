// src/config/env.js
const dotenv = require("dotenv");
dotenv.config();

const env = {
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET || "superSecretKey123",
  userServiceUrl: process.env.USER_SERVICE_URL || "http://localhost:4001/api/users",
  activityServiceUrl:
    process.env.ACTIVITY_SERVICE_URL || "http://localhost:4002/api/activities",
  metricServiceUrl:
    process.env.METRIC_SERVICE_URL || "http://localhost:4003/api/metrics",
  progressServiceUrl:
    process.env.PROGRESS_SERVICE_URL || "http://localhost:4004/api/progress",
};

module.exports = env;
