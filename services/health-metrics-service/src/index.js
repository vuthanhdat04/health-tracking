// src/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const env = require("./config/env");
const metricRoutes = require("./routes/metric.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/metrics", metricRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "health-metrics-service" });
});

const start = async () => {
  try {
    console.log("[health-metrics-service] Connecting to DB:", env.dbUri);
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
