const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const env = require("./config/env");
const routes = require("./routes/progress.routes");
const morgan = require("morgan");
const { startMetricConsumer } = require("./utils/rabbitmq");
const { handleIncomingMetricEvent } = require("./services/progress.service");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "progress-service",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/progress", routes);

mongoose
  .connect(env.dbUri)
  .then(() => {
    console.log("[progress-service] Connected to DB");

    // ----- THÊM HÀM RETRY KẾT NỐI RABBITMQ -----
    const startConsumerWithRetry = () => {
      startMetricConsumer(handleIncomingMetricEvent)
        .then(() => {
          console.log(
            "[progress-service] RabbitMQ consumer started successfully"
          );
        })
        .catch((err) => {
          console.error(
            "[progress-service] RabbitMQ error, retry in 5s:",
            err.message
          );
          setTimeout(startConsumerWithRetry, 5000);
        });
    };

    startConsumerWithRetry();
    // ------------------------------------------

    app.listen(env.port, () => {
      console.log(`[progress-service] running on port ${env.port}`);
    });
  })
  .catch((err) => {
    console.error("[progress-service] DB connection error", err);
    process.exit(1);
  });

