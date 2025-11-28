import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token khi refresh
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
    setLoading(false);
  }, []);

  const login = async (form) => {
    const data = await loginUser(form);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    return data;
  };

  const register = async (form) => {
    const data = await registerUser(form);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // 🟢 useMemo để tránh HMR bị invalid
  const value = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      login,
      register,
      logout,
      loading,
    }),
    [token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 🟢 Hook export riêng, không chung file default => ổn định HMR
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
};
