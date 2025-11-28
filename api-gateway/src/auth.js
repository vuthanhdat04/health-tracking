// src/auth.js
const jwt = require("jsonwebtoken");
const env = require("./config/env");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded; // { userId, email }
    next();
  } catch (err) {
    console.error("[api-gateway] auth error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = {
  authMiddleware,
};
