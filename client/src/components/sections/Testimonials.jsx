export default function Testimonials() {
  return (
    <section className="py-20 px-8 md:px-16">
      <h2 className="text-3xl font-bold text-center mb-12">Người dùng nói gì</h2>

      <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        <div className="p-6 border rounded-xl shadow">
          “Ứng dụng rất tuyệt, theo dõi dễ dàng!”
        </div>
        <div className="p-6 border rounded-xl shadow">
          “Báo cáo sức khỏe hàng ngày rất hữu ích.”
        </div>
        <div className="p-6 border rounded-xl shadow">
          “Giao diện đẹp và dùng mượt lắm.”
        </div>
      </div>
    </section>
  );
}
