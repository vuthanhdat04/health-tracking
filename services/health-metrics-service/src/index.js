import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import metricRoutes from "./routes/metric.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Health Metric Service is running" });
});

// Routes
app.use("/metrics", metricRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`💙 Health Metric Service running on port ${PORT}`);
});
