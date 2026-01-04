// src/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const env = require("./config/env");
const metricRoutes = require("./routes/metric.routes");

require("./utils/rabbitmq");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const promBundle = require("express-prom-bundle");

const metricsMiddleware = promBundle({
  includeMethod: true, // Đo method GET/POST...
  includePath: true,   // Đo đường dẫn API
  // QUAN TRỌNG: Đổi đường dẫn metrics sang tên khác để không trùng với service của bạn
  metricsPath: '/actuator/prometheus', 
  customLabels: { app: 'health-metrics-service' }, // Sửa tên này thành 'activity-service', 'api-gateway' tùy service
  promClient: {
    collectDefaultMetrics: {}
  }
});
app.use(metricsMiddleware);

app.use("/api/metrics", metricRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "health-metrics-service" });
});


const start = async () => {
  try {
    await mongoose.connect(env.dbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("[health-metrics-service] Connected to DB");

    app.listen(env.port, () => {
      console.log(`[health-metrics-service] running on port ${env.port}`);
    });
  } catch (err) {
    console.error("[health-metrics-service] Failed to start", err);
    process.exit(1);
  }
};

start();
