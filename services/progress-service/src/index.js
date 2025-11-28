// src/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const env = require("./config/env");
const progressRoutes = require("./routes/progress.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/progress", progressRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "progress-service" });
});

const start = async () => {
  try {
    console.log("[progress-service] Connecting to DB:", env.dbUri);
    await mongoose.connect(env.dbUri, { serverSelectionTimeoutMS: 5000 });
    console.log("[progress-service] Connected to DB");

    app.listen(env.port, () => {
      console.log(`[progress-service] running on port ${env.port}`);
    });
  } catch (err) {
    console.error("[progress-service] Failed to start", err);
    process.exit(1);
  }
};

start();
