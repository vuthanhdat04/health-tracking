import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import { auth } from "./middleware/auth.middleware.js";
import { connectDB, sequelize } from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối DB
await connectDB();

// Sync bảng (tự tạo nếu chưa có)
await sequelize.sync();

app.use("/users", authRoutes);

// Protected route test
app.get("/users/profile", auth, (req, res) => {
  res.json({ userId: req.userId });
});

app.listen(4001, () => {
  console.log("User Service running on port 4001");
});
