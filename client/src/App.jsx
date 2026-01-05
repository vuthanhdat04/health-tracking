// src/App.jsx
import React, { useEffect, useState } from "react";
import api from "./api";
import "./App.css";


function App() {
  const [user, setUser] = useState(null); // { id, fullName, email, ... }
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState("auth"); // auth | activity | metrics | overview
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [weeklyProgress, setWeeklyProgress] = useState(null);




  // ------- Auth form state -------
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    age: "",
    gender: "male",
  });


  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });


  // ------- Activity form/list -------
  const [activityForm, setActivityForm] = useState({
    type: "",
    duration: "",
    calories: "",
    distance: "",
    note: "",
  });
  const [activities, setActivities] = useState([]);


  // ------- Metrics form/list -------
  const [metricForm, setMetricForm] = useState({
    weight: "",
    height: "",
    heartRate: "",
    systolic: "",
    diastolic: "",
    note: "",
  });
  const [latestMetric, setLatestMetric] = useState(null);


  // ----------------- Helpers -----------------


  // load token + user từ localStorage khi mở trang
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setActiveTab("overview");
    }
  }, []);


  const showMessage = (text, timeout = 3000) => {
    setMessage(text);
    if (text) {
      setTimeout(() => setMessage(""), timeout);
    }
  };


  const handleLogout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setActiveTab("auth");
    showMessage("Đã đăng xuất");
  };


  // ----------------- Auth -----------------


  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/users/register", {
        fullName: registerForm.fullName,
        email: registerForm.email,
        password: registerForm.password,
        age: registerForm.age ? Number(registerForm.age) : undefined,
        gender: registerForm.gender,
      });
      showMessage("Đăng ký thành công! Hãy đăng nhập.");
      setActiveTab("auth");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      showMessage(msg);
    } finally {
      setLoading(false);
    }
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/users/login", {
        email: loginForm.email,
        password: loginForm.password,
      });
      const { token: t, user: u } = res.data.data;
      setToken(t);
      setUser(u);
      localStorage.setItem("token", t);
      localStorage.setItem("user", JSON.stringify(u));
      setActiveTab("overview");
      showMessage("Đăng nhập thành công");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      showMessage(msg);
    } finally {
      setLoading(false);
    }
  };


  // ----------------- Activity -----------------


  const fetchActivities = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get("/activities", {
        params: { userId: user.id },
      });
      setActivities(res.data.data || []);
    } catch (err) {
      console.error(err);
      showMessage("Không thể tải danh sách hoạt động");
    } finally {
      setLoading(false);
    }
  };


  const fetchWeeklyProgress = async () => {
  if (!user) return;
  setLoading(true);
  try {
    const res = await api.get("/progress/weekly", {
      params: { userId: user.id },
    });
    setWeeklyProgress(res.data.data || null);
    if (!res.data.data) {
      showMessage("Chưa có dữ liệu để tạo báo cáo tuần");
    }
  } catch (err) {
    console.error(err);
    showMessage("Không thể lấy báo cáo 7 ngày");
  } finally {
    setLoading(false);
  }
};




  const handleCreateActivity = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await api.post("/activities", {
        userId: user.id,
        type: activityForm.type,
        duration: activityForm.duration
          ? Number(activityForm.duration)
          : undefined,
        calories: activityForm.calories
          ? Number(activityForm.calories)
          : undefined,
        distance: activityForm.distance
          ? Number(activityForm.distance)
          : undefined,
        note: activityForm.note,
      });
      showMessage("Đã ghi nhận hoạt động");
      setActivityForm({
        type: "",
        duration: "",
        calories: "",
        distance: "",
        note: "",
      });
      fetchActivities();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || "Không thể tạo hoạt động";
      showMessage(msg);
    } finally {
      setLoading(false);
    }
  };


  // ----------------- Metrics -----------------


  const fetchLatestMetric = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get("/metrics/latest", {
        params: { userId: user.id },
      });
      setLatestMetric(res.data.data || null);
    } catch (err) {
      console.error(err);
      // 404 thì coi như chưa có dữ liệu, không cần báo lỗi to
      if (err?.response?.status !== 404) {
        showMessage("Không thể lấy chỉ số sức khỏe mới nhất");
      } else {
        setLatestMetric(null);
      }
    } finally {
      setLoading(false);
    }
  };


  const handleCreateMetric = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await api.post("/metrics", {
        userId: user.id,
        weight: metricForm.weight ? Number(metricForm.weight) : undefined,
        height: metricForm.height ? Number(metricForm.height) : undefined,
        heartRate: metricForm.heartRate
          ? Number(metricForm.heartRate)
          : undefined,
        systolic: metricForm.systolic
          ? Number(metricForm.systolic)
          : undefined,
        diastolic: metricForm.diastolic
          ? Number(metricForm.diastolic)
          : undefined,
        note: metricForm.note,
      });
      showMessage("Đã ghi nhận chỉ số sức khỏe");
      setMetricForm({
        weight: "",
        height: "",
        heartRate: "",
        systolic: "",
        diastolic: "",
        note: "",
      });
      fetchLatestMetric();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || "Không thể tạo chỉ số sức khỏe";
      showMessage(msg);
    } finally {
      setLoading(false);
    }
  };


  // ----------------- UI components -----------------


  const renderAuthSection = () => (
    <div className="card auth-card">
      <h2>Đăng ký</h2>
      <form onSubmit={handleRegister} className="form">
        <input
          type="text"
          placeholder="Họ tên"
          value={registerForm.fullName}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, fullName: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={registerForm.email}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={registerForm.password}
          onChange={(e) =>
            setRegisterForm({ ...registerForm, password: e.target.value })
          }
          required
        />
        <div className="form-row">
          <input
            type="number"
            placeholder="Tuổi"
            value={registerForm.age}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, age: e.target.value })
            }
          />
          <select
            value={registerForm.gender}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, gender: e.target.value })
            }
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>


      <h2 style={{ marginTop: "2rem" }}>Đăng nhập</h2>
      <form onSubmit={handleLogin} className="form">
        <input
          type="email"
          placeholder="Email"
          value={loginForm.email}
          onChange={(e) =>
            setLoginForm({ ...loginForm, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={loginForm.password}
          onChange={(e) =>
            setLoginForm({ ...loginForm, password: e.target.value })
          }
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );


  const renderOverview = () => {
    if (!user) {
      return (
        <div className="card">
          <p>Hãy đăng nhập để xem bảng điều khiển.</p>
        </div>
      );
    }


      return (
    <div className="card">
      <div className="card-header-row">
        <h2>Xin chào, {user.fullName}</h2>
        <button className="secondary" onClick={fetchWeeklyProgress}>
          Xem báo cáo 7 ngày
        </button>
      </div>


      <p>Email: {user.email}</p>
      <p>Giới tính: {user.gender}</p>
      <p>Tuổi: {user.age}</p>
      <p>
        Bạn có thể ghi nhận hoạt động tập luyện và chỉ số sức khỏe ở các tab
        bên trên.
      </p>


      {weeklyProgress && (
  <>
    <h3 style={{ marginTop: "1.5rem" }}>Báo cáo sức khỏe 7 ngày</h3>


    <div className="metric-card">
      <p>
        <strong>
          Từ{" "}
          {new Date(weeklyProgress.start).toLocaleDateString("vi-VN")} đến{" "}
          {new Date(weeklyProgress.end).toLocaleDateString("vi-VN")}
        </strong>
      </p>


      <p>
        Tổng số lần đo:{" "}
        <strong>{weeklyProgress.totalMetrics}</strong>
      </p>


      {weeklyProgress.daily && weeklyProgress.daily.length > 0 ? (
        <ul className="list">
          {weeklyProgress.daily.map((d) => (
            <li key={d.date} className="list-item">
              <div className="list-main">
                📅 {d.date} – Số lần đo:{" "}
                <strong>{d.metricCount}</strong>
              </div>


              <div className="list-sub">
                BMI:{" "}
                <strong>
                  {d.bmi !== undefined && d.bmi !== null ? d.bmi : "N/A"}
                </strong>
                {" | "}
                Nhịp tim:{" "}
                <strong>
                  {d.heartRate !== undefined && d.heartRate !== null
                    ? `${d.heartRate} bpm`
                    : "N/A"}
                </strong>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Chưa có dữ liệu sức khỏe trong 7 ngày gần nhất.</p>
      )}
    </div>
  </>
)}


    </div>
  );


  };


  const renderActivitySection = () => {
    if (!user) {
      return (
        <div className="card">
          <p>Hãy đăng nhập trước khi ghi nhận hoạt động.</p>
        </div>
      );
    }


    return (
      <div className="card">
        <div className="card-header-row">
          <h2>Hoạt động tập luyện</h2>
          <button className="secondary" onClick={fetchActivities}>
            Tải danh sách
          </button>
        </div>


        <form onSubmit={handleCreateActivity} className="form">
          <input
            type="text"
            placeholder="Loại hoạt động (chạy bộ, đi bộ...)"
            value={activityForm.type}
            onChange={(e) =>
              setActivityForm({ ...activityForm, type: e.target.value })
            }
            required
          />
          <div className="form-row">
            <input
              type="number"
              placeholder="Thời lượng (phút)"
              value={activityForm.duration}
              onChange={(e) =>
                setActivityForm({ ...activityForm, duration: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Quãng đường (km)"
              value={activityForm.distance}
              onChange={(e) =>
                setActivityForm({ ...activityForm, distance: e.target.value })
              }
            />
          </div>
          <div className="form-row">
            <input
              type="number"
              placeholder="Calo tiêu hao"
              value={activityForm.calories}
              onChange={(e) =>
                setActivityForm({ ...activityForm, calories: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Ghi chú"
              value={activityForm.note}
              onChange={(e) =>
                setActivityForm({ ...activityForm, note: e.target.value })
              }
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu hoạt động"}
          </button>
        </form>


        <h3 style={{ marginTop: "1.5rem" }}>Hoạt động gần đây</h3>
        {activities.length === 0 ? (
          <p>Chưa có dữ liệu, hãy nhấn "Tải danh sách" hoặc thêm hoạt động mới.</p>
        ) : (
          <ul className="list">
            {activities.map((a) => (
              <li key={a._id} className="list-item">
                <div className="list-main">
                  <strong>{a.type}</strong> – {a.duration} phút
                  {a.distance ? `, ${a.distance} km` : ""}{" "}
                  {a.calories ? `, ${a.calories} cal` : ""}
                </div>
                <div className="list-sub">
                  {new Date(a.date).toLocaleString()}{" "}
                  {a.note ? `– ${a.note}` : ""}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };


  const renderMetricsSection = () => {
    if (!user) {
      return (
        <div className="card">
          <p>Hãy đăng nhập trước khi ghi nhận chỉ số sức khỏe.</p>
        </div>
      );
    }


    return (
      <div className="card">
        <div className="card-header-row">
          <h2>Chỉ số sức khỏe</h2>
          <button className="secondary" onClick={fetchLatestMetric}>
            Lấy chỉ số mới nhất
          </button>
        </div>


        <form onSubmit={handleCreateMetric} className="form">
          <div className="form-row">
            <input
              type="number"
              placeholder="Cân nặng (kg)"
              value={metricForm.weight}
              onChange={(e) =>
                setMetricForm({ ...metricForm, weight: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Chiều cao (cm)"
              value={metricForm.height}
              onChange={(e) =>
                setMetricForm({ ...metricForm, height: e.target.value })
              }
              required
            />
          </div>
          <div className="form-row">
            <input
              type="number"
              placeholder="Nhịp tim (bpm)"
              value={metricForm.heartRate}
              onChange={(e) =>
                setMetricForm({ ...metricForm, heartRate: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Huyết áp trên"
              value={metricForm.systolic}
              onChange={(e) =>
                setMetricForm({ ...metricForm, systolic: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Huyết áp dưới"
              value={metricForm.diastolic}
              onChange={(e) =>
                setMetricForm({ ...metricForm, diastolic: e.target.value })
              }
            />
          </div>
          <input
            type="text"
            placeholder="Ghi chú"
            value={metricForm.note}
            onChange={(e) =>
              setMetricForm({ ...metricForm, note: e.target.value })
            }
          />
          <button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu chỉ số"}
          </button>
        </form>


        <h3 style={{ marginTop: "1.5rem" }}>Chỉ số gần nhất</h3>
        {!latestMetric ? (
          <p>Chưa có dữ liệu, hãy nhấn "Lấy chỉ số mới nhất" hoặc thêm mới.</p>
        ) : (
          <div className="metric-card">
            <p>
              <strong>
                Ngày:{" "}
                {new Date(latestMetric.date || latestMetric.createdAt).toLocaleString()}
              </strong>
            </p>
            <p>
              Cân nặng: {latestMetric.weight} kg – Chiều cao:{" "}
              {latestMetric.height} cm
            </p>
            <p>
              BMI:{" "}
              {latestMetric.bmi !== undefined && latestMetric.bmi !== null
                ? latestMetric.bmi
                : "N/A"}
            </p>
            {latestMetric.heartRate && (
              <p>Nhịp tim: {latestMetric.heartRate} bpm</p>
            )}
            {(latestMetric.systolic || latestMetric.diastolic) && (
              <p>
                Huyết áp: {latestMetric.systolic || "?"}/
                {latestMetric.diastolic || "?"}
              </p>
            )}
            {latestMetric.note && <p>Ghi chú: {latestMetric.note}</p>}
          </div>
        )}
      </div>
    );
  };


  // ----------------- Render tổng -----------------


  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Health Tracker</h1>
        <div className="header-right">
          {user ? (
            <>
              <span className="user-name">{user.fullName}</span>
              <button className="secondary small" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <span className="user-name">Chưa đăng nhập</span>
          )}
        </div>
      </header>


      <nav className="tab-nav">
        <button
          className={activeTab === "auth" ? "active" : ""}
          onClick={() => setActiveTab("auth")}
        >
          Đăng nhập / Đăng ký
        </button>
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Tổng quan
        </button>
        <button
          className={activeTab === "activity" ? "active" : ""}
          onClick={() => setActiveTab("activity")}
        >
          Hoạt động
        </button>
        <button
          className={activeTab === "metrics" ? "active" : ""}
          onClick={() => setActiveTab("metrics")}
        >
          Chỉ số sức khỏe
        </button>
      </nav>


      <main className="app-main">
        {message && <div className="toast">{message}</div>}


        {activeTab === "auth" && renderAuthSection()}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "activity" && renderActivitySection()}
        {activeTab === "metrics" && renderMetricsSection()}
      </main>


      <footer className="app-footer">
        <small>
          Đồ án Điện toán đám mây – Health Tracking (User, Activity, Health
          Metrics microservices + API Gateway + MongoDB Atlas)
        </small>
      </footer>
    </div>
  );
}


export default App;
