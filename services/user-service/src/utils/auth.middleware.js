// src/utils/auth.middleware.js
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { errorResponse } = require("./response");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, "Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded; // { userId, email }
    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return errorResponse(res, "Invalid token", 401);
  }
};

module.exports = {
  authMiddleware,
};
