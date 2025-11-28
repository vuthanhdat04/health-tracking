// src/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const env = require("./config/env");
const activityRoutes = require("./routes/activity.routes");

const app = express();

// ----- middlewares -----
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ----- routes -----
app.use("/api/activities", activityRoutes);

// endpoint kiểm tra service sống
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "activity-service" });
});

// ----- start server -----
const start = async () => {
  try {
    console.log("[activity-service] Connecting to DB:", env.dbUri);
    await mongoose.connect(env.dbUri);
    console.log("[activity-service] Connected to DB");

    app.listen(env.port, () => {
      console.log(`[activity-service] running on port ${env.port}`);
    });
  } catch (err) {
    console.error("[activity-service] Failed to start", err);
    process.exit(1);
  }
};

start();
