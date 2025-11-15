import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "User Service is running" });
});

// User routes
app.use("/users", userRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🟦 User Service running on port ${PORT}`);
});
