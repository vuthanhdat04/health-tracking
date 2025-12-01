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

app.use("/api/users", userRoutes);


app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "user-service",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
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
