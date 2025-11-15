import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import activityRoutes from "./routes/activity.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Activity Service is running" });
});

// Main routes
app.use("/activities", activityRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`🚀 Activity Service running on port ${PORT}`);
});
