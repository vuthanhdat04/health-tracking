export default function Features() {
  return (
    <section className="py-20 px-8 md:px-16">
      <h2 className="text-3xl font-bold text-center mb-12">Tính năng nổi bật</h2>

      <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        <div className="p-6 border rounded-xl shadow">
          <h3 className="text-xl font-bold mb-2">Theo dõi hoạt động</h3>
          <p>Ghi lại bước chân, chạy bộ, luyện tập mỗi ngày.</p>
        </div>

        <div className="p-6 border rounded-xl shadow">
          <h3 className="text-xl font-bold mb-2">Nhịp tim & sức khỏe</h3>
          <p>Biểu đồ nhịp tim theo thời gian thực, các chỉ số sức khỏe.</p>
        </div>

        <div className="p-6 border rounded-xl shadow">
          <h3 className="text-xl font-bold mb-2">Báo cáo thông minh</h3>
          <p>Phân tích dữ liệu và đưa ra đề xuất sức khỏe.</p>
        </div>
      </div>
    </section>
  );
}
