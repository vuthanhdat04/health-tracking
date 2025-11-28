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

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "api-gateway" });
});

// Tất cả API đều đi qua /api
app.use("/api", apiRoutes);

app.listen(env.port, () => {
  console.log(`[api-gateway] running on port ${env.port}`);
});
