import MainLayout from "../../layouts/MainLayout";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="p-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bạn đã đăng nhập thành công 🎉
        </p>
      </div>
    </MainLayout>
  );
}
