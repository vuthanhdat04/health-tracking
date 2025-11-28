import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { setupRoutes } from "./routes.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS"
}));

// FIX quan trọng — xử lý preflight
app.use(express.json());

app.use((req, res, next) => {
  console.log("➡️ Gateway nhận:", req.method, req.originalUrl);
  next();
});

// Route test gateway
app.get("/", (req, res) => {
  res.json({ message: "API Gateway is running" });
});

setupRoutes(app);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🌐 API Gateway running on port ${PORT}`);
});
