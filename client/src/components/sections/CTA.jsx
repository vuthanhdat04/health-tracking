import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-8 md:px-16 bg-green-600 text-white text-center">
      <h2 className="text-4xl font-bold mb-6">
        Sẵn sàng bắt đầu hành trình sức khỏe?
      </h2>
      <p className="text-lg mb-10 opacity-90">
        Tạo tài khoản ngay hôm nay.
      </p>

      <button
        onClick={() => navigate("/register")}
        className="px-10 py-4 bg-white text-green-600 font-semibold rounded-xl text-lg hover:bg-gray-100 transition"
      >
        Đăng ký ngay
      </button>
    </section>
  );
}
