// src/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const env = require("./config/env");
const progressRoutes = require("./routes/progress.routes");

const { startMetricConsumer } = require("./utils/rabbitmq");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const promBundle = require("express-prom-bundle");

const metricsMiddleware = promBundle({
  includeMethod: true, // so sánh method GET/POST,...
  includePath: true,   
  metricsPath: '/actuator/prometheus', 
  customLabels: { app: 'progress-service' }, 
  promClient: {
    collectDefaultMetrics: {}
  }
});

app.use(metricsMiddleware);

app.use("/api/progress", progressRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "progress-service" });
});

const handleMetricUpdate = async (data) => {
  try {
    console.log("[progress-service] 📩 Received event from RabbitMQ:", data);
    
    // --- CHỖ NÀY LÀ LOGIC CODE CỦA BẠN ---
    // Ví dụ:
    // 1. Tìm bản ghi Progress của user (data.userId)
    // 2. Cộng dồn chỉ số (data.value) vào Progress
    // 3. Lưu vào DB
    // const { userId, type, value } = data;
    // await ProgressModel.findOneAndUpdate(...)
    
    console.log("[progress-service] ✅ Processed metric update for User:", data.userId);
  } catch (err) {
    console.error("[progress-service] ❌ Error processing message:", err);
    // Không cần throw lỗi ở đây để tránh crash consumer, chỉ log lại
  }
};

const start = async () => {
  try {
    await mongoose.connect(env.dbUri, { serverSelectionTimeoutMS: 5000 });
    console.log("[progress-service] Connected to DB");

    await startMetricConsumer(handleMetricUpdate);
    
    app.listen(env.port, () => {
      console.log(`[progress-service] running on port ${env.port}`);
    });
  } catch (err) {
    console.error("[progress-service] Failed to start", err);
    process.exit(1);
  }
};

start();
