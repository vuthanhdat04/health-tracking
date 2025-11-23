import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="w-full py-5 flex justify-between items-center px-8 md:px-16">
      <h1
        className="text-2xl font-bold text-green-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        HealthTrack
      </h1>

      <div className="flex items-center gap-6">
        <a href="#" className="hover:text-green-500">Tính năng</a>
        <a href="#" className="hover:text-green-500">Liên hệ</a>

        {!isAuthenticated ? (
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Đăng nhập
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
            >
              Dashboard
            </button>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
