import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import axios from "axios";
import { sendForgotPassword } from "../../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("CLICKED");

    setError("");

    try {
       await sendForgotPassword(email);

      // 👉 Lưu email để VerifyOTP dùng
      localStorage.setItem("resetEmail", email);

      // 👉 Chuyển sang verify-otp
      navigate("/verify-otp");

    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Quên mật khẩu</h2>

        {msg && <p className="text-green-600 mb-3">{msg}</p>}
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="email"
          className="w-full p-3 border rounded mb-3"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-green-600 text-white rounded mb-3"
        >
          Gửi OTP
        </button>

        <p
          className="text-center text-green-600 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Quay lại đăng nhập
        </p>
      </div>
    </AuthLayout>
  );
}
