import { Routes, Route } from "react-router-dom";

import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import NotFound from "../pages/not-found/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "../context/authContext";
import Dashboard from "../components/dashboard/Dashboard";
import VerifyOtp from "../pages/verify-otp/VerifyOtp";
import ForgotPassword from "../pages/forgot-password/ForgotPassword";

export default function AppRouter() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* route cần đăng nhập */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
