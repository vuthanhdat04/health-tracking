import axios from "axios";

const API_URL = "http://localhost:8000/users";

export const registerUser = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data;
};

// ===============================
// 🔹 FORGOT PASSWORD (Gửi OTP)
// ===============================
export const sendForgotPassword = async (email) => {
    console.log("📡 Gọi API forgot-password tới:", `${API_URL}/forgot-password`);

  const res = await axios.post(`${API_URL}/forgot-password`, { email });
  return res.data;
};

// ===============================
// 🔹 VERIFY OTP (nếu có bước nhập OTP)
// ===============================
export const verifyOtp = async ({ email, otp }) => {
  const res = await axios.post(`${API_URL}/verify-otp`, { email, otp });
  return res.data;
};

// ===============================
// 🔹 RESET PASSWORD
// ===============================
export const resetPassword = async (data) => {
  const res = await axios.post(`${API_URL}/reset-password`, data);
  return res.data;
};