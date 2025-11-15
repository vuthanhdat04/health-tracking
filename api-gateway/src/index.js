import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { setupRoutes } from "./routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Gateway is running" });
});

setupRoutes(app);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🌐 API Gateway running on port ${PORT}`);
});
