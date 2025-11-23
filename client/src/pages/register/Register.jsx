import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../context/authContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setErrMsg("");
    try {
      await register(form);
      alert("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login");
    } catch (err) {
      setErrMsg(err.response?.data?.message || "Register thất bại");
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Tạo tài khoản mới</h2>

        {errMsg && (
          <p className="mb-3 text-red-500 text-sm">{errMsg}</p>
        )}

        <input
          name="name"
          className="w-full p-3 border rounded mb-3"
          placeholder="Tên"
          value={form.name}
          onChange={handleChange}
        />
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
          Đăng ký
        </button>

        <p className="text-center">
          Đã có tài khoản?
          <span
            onClick={() => navigate("/login")}
            className="text-green-600 cursor-pointer ml-1"
          >
            Đăng nhập
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
