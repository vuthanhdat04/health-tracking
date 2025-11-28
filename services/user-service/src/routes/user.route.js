// src/routes/user.route.js
const express = require("express");
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../utils/auth.middleware");

const router = express.Router();

// Đăng ký
router.post("/register", userController.register);

// Đăng nhập
router.post("/login", userController.login);

// Lấy profile (cần Bearer token)
router.get("/me", authMiddleware, userController.getProfile);

module.exports = router;
