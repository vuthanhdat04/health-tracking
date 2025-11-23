import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
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
    // backend bạn đang trả { message, token }
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

  const value = {
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
