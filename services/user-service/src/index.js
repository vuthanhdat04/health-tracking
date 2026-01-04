// src/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const env = require("./config/env");
const userRoutes = require("./routes/user.route");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


// --- BẮT ĐẦU CẤU HÌNH MONITORING ---
const promBundle = require("express-prom-bundle");

const metricsMiddleware = promBundle({
  includeMethod: true, // Đo method GET/POST...
  includePath: true,   // Đo đường dẫn API
  // QUAN TRỌNG: Đổi đường dẫn metrics sang tên khác để không trùng với service của bạn
  metricsPath: '/actuator/prometheus', 
  customLabels: { app: 'user-service' }, // Sửa tên này thành 'activity-service', 'api-gateway' tùy service
  promClient: {
    collectDefaultMetrics: {}
  }
});

app.use(metricsMiddleware);
// --- KẾT THÚC CẤU HÌNH MONITORING ---


app.use("/api/users", userRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "user-service" });
});

const start = async () => {
  try {
    console.log("[user-service] Connecting to DB:", env.dbUri);
    await mongoose.connect(env.dbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("[user-service] Connected to DB");

    app.listen(env.port, () => {
      console.log(`[user-service] running on port ${env.port}`);
    });
  } catch (err) {
    console.error("[user-service] Failed to start", err);
    process.exit(1);
  }
};

start();
