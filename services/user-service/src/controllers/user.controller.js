// src/controllers/user.controller.js
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const userService = require("../services/user.service");
const { successResponse, errorResponse } = require("../utils/response");

// POST /api/users/register
const register = async (req, res) => {
  try {
    const { fullName, email, password, age, gender } = req.body;

    if (!fullName || !email || !password) {
      return errorResponse(res, "fullName, email, password là bắt buộc", 400);
    }

    const user = await userService.createUser({ fullName, email, password, age, gender });

    const userSafe = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      age: user.age,
      gender: user.gender,
    };

    return successResponse(res, userSafe, "Đăng ký thành công", 201);
  } catch (err) {
    console.error("register error:", err);
    if (err.code === "EMAIL_EXISTS") {
      return errorResponse(res, err.message, 400);
    }
    return errorResponse(res, "Không thể đăng ký", 500);
  }
};

// POST /api/users/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "email và password là bắt buộc", 400);
    }

    const user = await userService.validateUser(email, password);

    const payload = { userId: user._id.toString(), email: user.email };
    const token = jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });

    const userSafe = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      age: user.age,
      gender: user.gender,
    };

    return successResponse(
      res,
      { token, user: userSafe },
      "Đăng nhập thành công"
    );
  } catch (err) {
    console.error("login error:", err);
    if (err.code === "INVALID_CREDENTIALS") {
      return errorResponse(res, err.message, 401);
    }
    return errorResponse(res, "Không thể đăng nhập", 500);
  }
};

// GET /api/users/me
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userService.getUserById(userId);
    if (!user) return errorResponse(res, "Không tìm thấy người dùng", 404);

    return successResponse(res, user, "Lấy thông tin người dùng thành công");
  } catch (err) {
    console.error("getProfile error:", err);
    return errorResponse(res, "Không thể lấy thông tin người dùng", 500);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
