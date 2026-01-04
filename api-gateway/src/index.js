// src/index.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const env = require("./config/env");
const apiRoutes = require("./routes");

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
  customLabels: { app: 'api-gateway' }, // Sửa tên này thành 'activity-service', 'api-gateway' tùy service
  promClient: {
    collectDefaultMetrics: {}
  }
});
app.use(metricsMiddleware);


app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "api-gateway" });
});

// Tất cả API đều đi qua /api
app.use("/api", apiRoutes);

app.listen(env.port, "0.0.0.0", () => {
  console.log(`[api-gateway] running on port ${env.port}`);
});
