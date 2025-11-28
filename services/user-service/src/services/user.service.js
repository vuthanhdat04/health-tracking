// src/services/user.service.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

const createUser = async ({ fullName, email, password, age, gender }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error("Email đã được sử dụng");
    error.code = "EMAIL_EXISTS";
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    fullName,
    email,
    passwordHash,
    age,
    gender,
  });

  return user;
};

const validateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Sai email hoặc mật khẩu");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error("Sai email hoặc mật khẩu");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  return user;
};

const getUserById = async (id) => {
  return User.findById(id).select("-passwordHash");
};

module.exports = {
  createUser,
  validateUser,
  getUserById,
};
