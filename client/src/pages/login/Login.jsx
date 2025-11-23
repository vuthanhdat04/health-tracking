import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../context/authContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setErrMsg("");
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setErrMsg(err.response?.data?.message || "Login thất bại");
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Đăng nhập</h2>

        {errMsg && (
          <p className="mb-3 text-red-500 text-sm">{errMsg}</p>
        )}

        <input
          name="email"
          className="w-full p-3 border rounded mb-3"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          className="w-full p-3 border rounded mb-3"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-green-600 text-white rounded mb-3"
        >
          Đăng nhập
        </button>

        <p className="text-center">
          Chưa có tài khoản?
          <span
            onClick={() => navigate("/register")}
            className="text-green-600 cursor-pointer ml-1"
          >
            Đăng ký
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
