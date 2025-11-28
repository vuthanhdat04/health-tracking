import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import AuthLayout from "../../layouts/AuthLayout";
import { verifyOtp } from "../../services/authService";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email");

  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async () => {
    setErr("");

    try {
      await verifyOtp({email, otp});

      alert("Xác minh OTP thành công!");
            navigate("/reset-password");


    } catch (error) {
      setErr(error.response?.data?.message || "OTP không hợp lệ");
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Xác minh OTP</h2>

        <p className="text-gray-700 mb-2">
          Mã OTP đã gửi tới email:
          <span className="font-semibold"> {email}</span>
        </p>

        {err && <p className="mb-3 text-red-500 text-sm">{err}</p>}

        <input
          className="w-full p-3 border rounded mb-3"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-green-600 text-white rounded"
        >
          Xác minh
        </button>
      </div>
    </AuthLayout>
  );
}
